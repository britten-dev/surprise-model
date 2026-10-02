// Export the highest-detail source, with hierarchy and named parts preserved.
import { openHarness } from './harness.js';
import { mkdir, writeFile } from 'node:fs/promises';

const h = await openHarness();
try {
  const options = { lod: 'cinematic', sails: 'topsails', weather: 'fair' };
  const data = await h.page.evaluate(o => window.exportGLB(o), options);
  await mkdir('build', { recursive: true });
  await writeFile('build/surprise-blender-source.glb', Buffer.from(data, 'base64'));
  console.log('Exported build/surprise-blender-source.glb');
  console.log(JSON.stringify(await h.page.evaluate(o => window.stats(o), options)));
  if (h.problems.length) console.log(h.problems.join('\n'));
} finally {
  await h.close();
}
