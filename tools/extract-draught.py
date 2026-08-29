#!/usr/bin/env python3
"""
extract-draught.py -- reproducible hull-lines extraction from RMG plan ZAZ3067.

Source plan
    RMG ZAZ3067, "Lines & Profile", HMS Surprise (ex-Unite, 1794),
    Plymouth Yard, February 1798, signed John Marshall.  Scale 1:48.
    Free web scan: https://collections.rmg.co.uk/media/2/440/707/j5948.jpg
    1280 x 451 px, RGB JPEG.

The scan is Crown copyright.  It is NEVER copied into this repository:
the script downloads it to a cache directory outside the repo.

Output
    docs/offsets.json                     machine-readable offsets
    <scratch>/zaz3067-overlay.png         diagnostic overlay for visual check
    stdout                                calibration + sanity report

Datum (matches docs/CONVENTIONS.md)
    origin  = design load waterline, on the centreline, at the midship station
    +X      = starboard,  +Y = up,  -Z = forward.  Units metres.

Dependencies: numpy, Pillow only.
"""

import argparse
import json
import math
import os
import sys
import urllib.request

import numpy as np
from PIL import Image, ImageDraw

# --------------------------------------------------------------------------
# Known facts about the ship.  These are NOT used to derive geometry; they are
# used only to calibrate and to check the extraction.
# --------------------------------------------------------------------------
SHIP = {
    "length_gundeck_ft": 126.0,          # 126 ft 0 in
    "length_keel_tonnage_ft": 108.0 + 6.125 / 12.0,
    "breadth_extreme_ft": 31.0 + 8.0 / 12.0,
    "breadth_moulded_ft": 31.0 + 2.0 / 12.0,
    "depth_in_hold_ft": 10.0 + 0.5 / 12.0,
    "draught_ft": 14.0 + 0.5 / 12.0,
    "burthen_tons_bm": 578.0 + 73.0 / 94.0,
}
FT_TO_M = 0.3048
SOURCE_URL = "https://collections.rmg.co.uk/media/2/440/707/j5948.jpg"
PRIOR_PX_PER_FT = 6.021                  # the figure this run must check

# --------------------------------------------------------------------------
# Regions of the sheet, in pixels of the 1280 x 451 scan.  Established by
# inspection; every one is re-checked at run time and the check is printed.
# --------------------------------------------------------------------------
R = {
    "scalebar_x": (312, 1098),
    "scalebar_y": (284, 296),
    "profile_x": (300, 1180),
    "profile_y": (78, 292),
    "halfb_x": (296, 1118),
    "halfb_y": (299, 407),
    "body_x": (52, 296),
    "body_y": (72, 296),
}


# ==========================================================================
# image helpers
# ==========================================================================

def load_scan(path, cache_dir):
    if path and os.path.exists(path):
        src = path
    else:
        os.makedirs(cache_dir, exist_ok=True)
        src = os.path.join(cache_dir, "zaz3067.jpg")
        if not os.path.exists(src):
            sys.stderr.write("downloading %s\n" % SOURCE_URL)
            urllib.request.urlretrieve(SOURCE_URL, src)
    im = Image.open(src).convert("L")
    return src, np.asarray(im).astype(float)


def rolling(a, w, fn):
    """fn over a sliding window of length w along axis 0, edge padded."""
    from numpy.lib.stride_tricks import sliding_window_view
    h = w // 2
    pad = np.pad(a, ((h, h),) + ((0, 0),) * (a.ndim - 1), mode="edge")
    return fn(sliding_window_view(pad, (w,), axis=0), axis=-1)


def darkness(g, y0, y1, win=21):
    """Ink strength, paper-normalised per column.

    The paper tone drifts across the sheet, so the background for a pixel is
    a rolling maximum (= lightest local tone) down its own column.  Returns
    (band, d) where d >= 0 and larger means darker than the local paper.
    """
    band = g[y0:y1]
    bg = rolling(band, win, np.max)
    d = np.clip(bg - band, 0.0, None)
    # mild smoothing along y so a 1-px line gives a clean parabolic peak
    d = np.vstack([d[:1], d[:-1]])[:] * 0.25 + d * 0.5 + np.vstack([d[1:], d[-1:]]) * 0.25
    return d


def col_peaks(d, x, y0, thresh):
    """Sub-pixel darkness peaks in column x of a darkness map based at y0."""
    c = d[:, x]
    out = []
    for i in range(1, len(c) - 1):
        if c[i] >= c[i - 1] and c[i] > c[i + 1] and c[i] >= thresh:
            a, b, e = c[i - 1], c[i], c[i + 1]
            den = a - 2 * b + e
            off = 0.5 * (a - e) / den if den != 0 else 0.0
            if abs(off) <= 1.0:
                out.append((y0 + i + off, float(c[i])))
    return out


def row_peaks(d, y, x0, thresh):
    c = d[y]
    out = []
    for i in range(1, len(c) - 1):
        if c[i] >= c[i - 1] and c[i] > c[i + 1] and c[i] >= thresh:
            a, b, e = c[i - 1], c[i], c[i + 1]
            den = a - 2 * b + e
            off = 0.5 * (a - e) / den if den != 0 else 0.0
            if abs(off) <= 1.0:
                out.append((x0 + i + off, float(c[i])))
    return out


def line_centroid(g, yc, x0, x1, half=3):
    """Sub-pixel y of a near-horizontal rule near yc, averaged over x0..x1."""
    w = g[yc - half:yc + half + 1, x0:x1].mean(axis=1)
    wt = np.clip(np.percentile(g[yc - half - 4:yc + half + 5, x0:x1], 90) - w, 0, None)
    ys = np.arange(yc - half, yc + half + 1)
    return float((ys * wt).sum() / wt.sum())


# ==========================================================================
# 1.  calibration
# ==========================================================================

def calibrate_horizontal(g, report):
    """Pixels per foot from the printed scale bar.

    The bar is a ruled box full of a fine tick comb.  We do not try to count
    ticks (they are ~6 px apart and the scan is soft); we measure the comb's
    fundamental spatial period by DFT, which is far more robust, and confirm
    that the 5x harmonic (the emphasised 5 ft marks) is present.
    """
    xa, xb = R["scalebar_x"]
    ya, yb = R["scalebar_y"]

    # locate the box rules so the region is self-checked, not assumed
    rows = g[ya - 8:yb + 8, xa:xb].mean(axis=1)
    order = np.argsort(rows)
    r_top, r_bot = sorted((ya - 8 + int(order[0]), ya - 8 + int(order[1])))
    report("scale bar box rules found at y = %d and y = %d "
           "(expected %d / %d)" % (r_top, r_bot, ya - 2, yb + 1))

    prof = g[r_top + 3:r_bot - 1, xa:xb].mean(axis=0)
    prof = prof - np.convolve(prof, np.ones(41) / 41, mode="same")
    prof = prof[25:-25]
    n = len(prof)
    prof = (prof - prof.mean()) * np.hanning(n)
    mag = np.abs(np.fft.rfft(prof))

    def refine(period_guess):
        k = n / period_guess
        lo, hi = max(2, int(k * 0.88)), int(k * 1.12) + 2
        kk = lo + int(np.argmax(mag[lo:hi]))
        a, b, c = mag[kk - 1], mag[kk], mag[kk + 1]
        den = a - 2 * b + c
        off = 0.5 * (a - c) / den if den != 0 else 0.0
        return n / (kk + off), float(mag[kk])

    p1, m1 = refine(6.0)          # the 1 ft ticks
    p5, m5 = refine(30.0)         # the emphasised 5 ft marks
    noise = float(np.median(mag[2:]))
    report("scale bar comb: fundamental %.4f px, 5x group %.3f px "
           "(= %.4f px per unit); peak/median magnitude %.0f and %.0f"
           % (p1, p5, p5 / 5.0, m1 / noise, m5 / noise))
    if m1 < 4 * noise:
        raise SystemExit("scale bar comb not detected -- refusing to guess")

    # weight the two estimates; the 5x group is 5x more precise per cycle
    px_per_ft = (p1 * 1.0 + (p5 / 5.0) * 3.0) / 4.0
    report("=> horizontal scale %.4f px per foot of ship "
           "(%.2f%% from the assumed %.3f)"
           % (px_per_ft, 100 * (px_per_ft - PRIOR_PX_PER_FT) / PRIOR_PX_PER_FT,
              PRIOR_PX_PER_FT))
    return px_per_ft, p1, p5 / 5.0


def find_horizontal_lines(g, report):
    """Base line and the drawn water lines of the sheer plan."""
    xa, xb = 420, 980
    prof = g[120:290, xa:xb].mean(axis=1)
    bg = np.percentile(prof, 88)
    d = bg - prof
    cand = []
    for i in range(1, len(d) - 1):
        if d[i] >= d[i - 1] and d[i] > d[i + 1] and d[i] > 9:
            cand.append(120 + i)
    cand = [c for c in cand if c > 165]           # above this is deck/wale work
    cent = [line_centroid(g, c, xa, xb, 2) for c in cand]
    # merge duplicates
    merged = []
    for c in cent:
        if merged and c - merged[-1] < 6:
            merged[-1] = 0.5 * (merged[-1] + c)
        else:
            merged.append(c)
    base = merged[-1]
    wls = merged[:-1]
    report("sheer plan horizontal rules: water lines at y = %s, base line y = %.2f"
           % (", ".join("%.2f" % v for v in wls), base))
    return wls, base


def calibrate_vertical(g, wls, base, hb_cl, px_per_ft, report):
    """Independent vertical check.

    Two handles are available:
      a) the water-line pitch, which must be a round shipwright's figure;
      b) the widest water line of the half-breadth plan, whose full breadth
         is a documented dimension of the ship.
    """
    k = np.arange(len(wls))
    pitch = float(np.polyfit(k, np.array(wls), 1)[0]) * -1.0
    report("water-line pitch %.3f px = %.3f ft at the horizontal scale"
           % (pitch, pitch / px_per_ft))

    band = R["halfb_y"]
    d = darkness(g, band[0], band[1])
    widest = 0.0
    for x in range(560, 900):
        pk = col_peaks(d, x, band[0], 12.0)
        if pk:
            widest = max(widest, hb_cl - min(p[0] for p in pk))
    py_moulded = widest / (SHIP["breadth_moulded_ft"] / 2.0)
    report("widest half-breadth drawn = %.1f px; against the ship's moulded "
           "breadth that is %.4f px per foot vertically" % (widest, py_moulded))
    report("=> vertical / horizontal scale ratio %.4f (1.0 = isotropic scan)"
           % (py_moulded / px_per_ft))
    return pitch


# ==========================================================================
# 2.  curve tracking
# ==========================================================================

class Chain(object):
    __slots__ = ("xs", "ys", "gap")

    def __init__(self, x, y):
        self.xs = [x]
        self.ys = [y]
        self.gap = 0

    def slope(self, n=14):
        if len(self.xs) < 3:
            return 0.0
        xs = np.array(self.xs[-n:])
        ys = np.array(self.ys[-n:])
        return float(np.polyfit(xs, ys, 1)[0])

    def predict(self, x):
        return self.ys[-1] + self.slope() * (x - self.xs[-1])


def link_chains(d, y0, x_from, x_to, thresh, tol, max_gap, min_len):
    """Link column peaks into curves, sweeping in the given x direction."""
    step = 1 if x_to > x_from else -1
    active, done = [], []
    for x in range(x_from, x_to, step):
        peaks = col_peaks(d, x, y0, thresh)
        used = set()
        pairs = []
        for ci, ch in enumerate(active):
            yp = ch.predict(x)
            for pi, (py, ps) in enumerate(peaks):
                dy = abs(py - yp)
                budget = tol + 0.45 * ch.gap
                if dy <= budget:
                    pairs.append((dy, ci, pi, py))
        pairs.sort()
        taken_c, taken_p = set(), set()
        for dy, ci, pi, py in pairs:
            if ci in taken_c or pi in taken_p:
                continue
            taken_c.add(ci)
            taken_p.add(pi)
            used.add(pi)
            ch = active[ci]
            ch.xs.append(x)
            ch.ys.append(py)
            ch.gap = 0
        survivors = []
        for ci, ch in enumerate(active):
            if ci in taken_c:
                survivors.append(ch)
            else:
                ch.gap += 1
                if ch.gap <= max_gap:
                    survivors.append(ch)
                elif len(ch.xs) >= min_len:
                    done.append(ch)
        active = survivors
        for pi, (py, ps) in enumerate(peaks):
            if pi in used:
                continue
            if any(abs(py - c.ys[-1]) < 2.0 and c.xs[-1] == x for c in active):
                continue
            active.append(Chain(x, py))
    done.extend(c for c in active if len(c.xs) >= min_len)
    return done


def follow(d, y0, seed_x, seed_y, x_to, thresh, tol, max_gap, slope0=0.0):
    """Follow one curve from a known seed, both directions handled by caller."""
    step = 1 if x_to > seed_x else -1
    ch = Chain(seed_x, seed_y)
    ch.ys[0] = seed_y
    forced_slope = slope0
    gap = 0
    for x in range(seed_x + step, x_to, step):
        if len(ch.xs) >= 4:
            yp = ch.predict(x)
        else:
            yp = ch.ys[-1] + forced_slope * step
        peaks = col_peaks(d, x, y0, thresh)
        best, bdy = None, 1e9
        for py, ps in peaks:
            dy = abs(py - yp)
            if dy < bdy and dy <= tol + 0.5 * gap:
                best, bdy = py, dy
        if best is None:
            gap += 1
            if gap > max_gap:
                break
            continue
        gap = 0
        ch.xs.append(x)
        ch.ys.append(best)
    return ch


def resample(ch, xs_new):
    """Monotone-x resample of a chain onto a grid; nan outside its span."""
    xs = np.array(ch.xs, dtype=float)
    ys = np.array(ch.ys, dtype=float)
    o = np.argsort(xs)
    xs, ys = xs[o], ys[o]
    xs, idx = np.unique(xs, return_index=True)
    ys = ys[idx]
    out = np.interp(xs_new, xs, ys, left=np.nan, right=np.nan)
    out[(xs_new < xs[0]) | (xs_new > xs[-1])] = np.nan
    return out


def smooth_nan(y, w=5):
    out = y.copy()
    ok = ~np.isnan(y)
    if ok.sum() < w:
        return out
    idx = np.where(ok)[0]
    v = y[idx]
    k = np.ones(w) / w
    sm = np.convolve(np.pad(v, (w // 2, w // 2), mode="edge"), k, mode="valid")
    out[idx] = sm[:len(idx)]
    return out
