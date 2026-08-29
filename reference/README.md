# The reference photograph

This folder is deliberately empty in the repository.

The model was matched against a photograph of a hand-crafted museum model of *Surprise*
by **The Model Shipyard** — a port-bow view under a full suit of canvas. That photograph
is their work, not ours, so it is not redistributed here. It is published on their own
site:

<https://www.stephensandkenau.com/ship/hms-surprise/>

What this project keeps instead is the *reading* of it: `docs/PHOTO-ANALYSIS.md` records
the paint bands with their sampled hex values, the details visible on the model, and —
importantly — where the model is an interpretation rather than evidence. Everything the
photograph decided is written down there and in the `source` field of the relevant rows
of `SPECS.md`, so the work is reproducible without the image.

## If you want the comparison tools to run

Put your own copy here as `surprise-reference.jpg`. The folder is git-ignored, so it will
not be committed:

```
reference/surprise-reference.jpg
```

With it in place:

* `python3 tools/compare.py` lays the verification render beside it with matched guides.
* the viewer's **photo** button overlays it on the live model.

Without it, both simply say so and carry on.
