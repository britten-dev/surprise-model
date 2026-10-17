// Meshy, driven from here rather than from its website.
//
// The photographed crew, boats and carvings were all made by clicking through meshy.ai.
// This does the same steps through Meshy's API, with the settings written down: a picture
// (from a prompt, or from a prompt and reference pictures), the picture to a textured 3D
// model, a rig for a figure, and a remesh to fewer triangles. Every task's id goes into
// build/crew-prototype/meshy/tasks/<name>.json and every download into a folder beside it, so
// a step can be picked up again and a later step can start from an earlier one by name.
//
// It needs MESHY_API_KEY in the environment (Meshy -> API; on Pro the API spends the
// same credits as the website). The key is read from there and nowhere else, and is
// never printed or written down.
//
//   node tools/meshy.mjs balance
//   node tools/meshy.mjs picture <name> --prompt "..." [--ref a.png --ref b.jpg] [--aspect 3:4] [--pose a-pose]
//   node tools/meshy.mjs model <name> --from <picture name> [--polycount 10000] [--pose a-pose]
//   node tools/meshy.mjs rig <name> --from <model name> [--height 1.7]
//   node tools/meshy.mjs remesh <name> --glb <file> --polycount 800
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const API = 'https://api.meshy.ai/openapi';
const KEY = process.env.MESHY_API_KEY;
if (!KEY) { console.error('MESHY_API_KEY is not set.'); process.exit(1); }
const OUT = new URL('../build/crew-prototype/meshy/', import.meta.url);
await mkdir(OUT, { recursive: true });
// One small file per task, so several of these running at once never write over each
// other: build/crew-prototype/meshy/tasks/<name>.json.
const TASKS = new URL('tasks/', OUT);
await mkdir(TASKS, { recursive: true });
const tasks = {};
const save = () => writeFile(new URL(`${name}.json`, TASKS), JSON.stringify(tasks[name], null, 2) + '\n');
const load = async (from) => {
  const file = new URL(`${from}.json`, TASKS);
  if (existsSync(file)) return JSON.parse(await readFile(file, 'utf8'));
  // The single log the tool kept before.
  const old = new URL('tasks.json', OUT);
  if (existsSync(old)) { try { return JSON.parse(await readFile(old, 'utf8'))[from]; } catch { return undefined; } }
  return undefined;
};

const [command, name, ...rest] = process.argv.slice(2);
const option = (flag, fallback) => { const i = rest.indexOf(flag); return i < 0 ? fallback : rest[i + 1]; };
const options = (flag) => rest.flatMap((v, i) => (v === flag ? [rest[i + 1]] : []));

async function call(method, route, body) {
  const response = await fetch(`${API}${route}`, {
    method, headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: body && JSON.stringify(body),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`${method} ${route}: HTTP ${response.status} ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : {};
}

const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.glb': 'model/gltf-binary' };
const dataURI = async (file) => `data:${MIME[path.extname(file).toLowerCase()] ?? 'application/octet-stream'};base64,${(await readFile(file)).toString('base64')}`;

/** Wait for a task to finish, printing its progress now and then. */
async function settle(route, id) {
  const started = Date.now();
  let last = -1;
  for (;;) {
    const task = await call('GET', `${route}/${id}`);
    if (task.status === 'SUCCEEDED') return task;
    if (task.status === 'FAILED' || task.status === 'CANCELED') {
      throw new Error(`${route}/${id}: ${task.status} ${JSON.stringify(task.task_error ?? {}).slice(0, 300)}`);
    }
    if (task.progress !== last && (task.progress ?? 0) % 20 === 0) { console.log(`  ${task.status.toLowerCase()} ${task.progress ?? 0}%`); last = task.progress; }
    if (Date.now() - started > 20 * 60e3) throw new Error(`${route}/${id}: still ${task.status} after 20 minutes`);
    await new Promise((r) => setTimeout(r, 5000));
  }
}

/** The first value anywhere in the task object stored under one of these keys. */
function find(object, keys) {
  if (!object || typeof object !== 'object') return undefined;
  for (const key of keys) if (typeof object[key] === 'string') return object[key];
  for (const value of Object.values(object)) { const hit = find(value, keys); if (hit) return hit; }
  return undefined;
}

async function download(url, file) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`download ${file}: HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const target = new URL(file, OUT);
  await mkdir(new URL('.', target), { recursive: true });
  await writeFile(target, bytes);
  console.log(`  saved build/crew-prototype/meshy/${file} (${(bytes.length / 1e6).toFixed(1)} MB)`);
  return target;
}

async function run(kind, route, body, outputs) {
  const before = (await call('GET', '/v1/balance')).balance;
  const { result: id } = await call('POST', route, body);
  tasks[name] = { kind, id, route, at: new Date().toISOString() };
  await save();
  console.log(`${name}: ${kind} task ${id}`);
  const task = await settle(route, id);
  const files = [];
  for (const [file, url] of outputs(task)) if (url) files.push(String(await download(url, file)));
  const after = (await call('GET', '/v1/balance')).balance;
  Object.assign(tasks[name], { status: 'SUCCEEDED', files: files.map((f) => path.basename(f)), credits: before - after });
  await save();
  console.log(`${name}: done, ${before - after} credits (${after} left)`);
}

const need = async (from) => {
  const t = await load(from);
  if (!t?.id) throw new Error(`no task called "${from}" in build/crew-prototype/meshy/tasks/`);
  return t;
};

switch (command) {
  case 'balance': {
    const b = await call('GET', '/v1/balance');
    console.log(`${b.balance} credits (${b.monthly_credits} this month, ${b.permanent_credits} permanent)`);
    break;
  }
  case 'picture': {
    const refs = options('--ref');
    const body = { ai_model: 'nano-banana-pro', prompt: option('--prompt'), aspect_ratio: option('--aspect', '1:1') };
    if (option('--pose')) body.pose_mode = option('--pose');
    if (refs.length) body.reference_image_urls = await Promise.all(refs.map(dataURI));
    const route = refs.length ? '/v1/image-to-image' : '/v1/text-to-image';
    await run('picture', route, body, (t) => [[`${name}/${name}.png`, t.image_urls?.[0]]]);
    break;
  }
  case 'model': {
    const from = await need(option('--from'));
    await run('model', '/v1/image-to-3d', {
      input_task_id: from.id, ai_model: 'latest', should_remesh: true,
      target_polycount: Number(option('--polycount', 10000)), topology: 'triangle',
      should_texture: true, enable_pbr: true, texture_resolution: '2k',
      ...(option('--pose') ? { pose_mode: option('--pose') } : {}),
    }, (t) => [[`${name}/${name}.glb`, t.model_urls?.glb], [`${name}/${name}-front.png`, t.thumbnail_url]]);
    break;
  }
  case 'rig': {
    const from = await need(option('--from'));
    await run('rig', '/v1/rigging', { input_task_id: from.id, height_meters: Number(option('--height', 1.7)) },
      (t) => [[`${name}/${name}-rigged.glb`, find(t, ['rigged_character_glb_url'])]]);
    break;
  }
  case 'remesh': {
    await run('remesh', '/v1/remesh', {
      model_url: await dataURI(option('--glb')), target_polycount: Number(option('--polycount', 3000)),
      topology: 'triangle', target_formats: ['glb'],
    }, (t) => [[`${name}/${name}.glb`, t.model_urls?.glb]]);
    break;
  }
  default:
    console.error('usage: node tools/meshy.mjs balance | picture | model | rig | remesh  (see the head of the file)');
    process.exit(1);
}
