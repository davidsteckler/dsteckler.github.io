import {build} from 'esbuild';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

const directory = fileURLToPath(new URL('.', import.meta.url));
await mkdir(new URL('../vendor/', import.meta.url), {recursive: true});
await build({
  entryPoints: [directory + 'engine.js'],
  outfile: directory + '../vendor/engine.js',
  bundle: true,
  format: 'esm',
  target: 'es2022',
  minify: true,
  legalComments: 'linked',
});
const packages = ['three', 'three-bvh-csg', 'three-mesh-bvh'];
const licenses = await Promise.all(packages.map(async name => {
  const json = JSON.parse(await readFile(directory + 'node_modules/' + name + '/package.json', 'utf8'));
  const license = await readFile(directory + 'node_modules/' + name + '/LICENSE', 'utf8');
  return `${name} ${json.version}\n${license}`;
}));
const fontLicense = await readFile(directory + '../fonts/LICENSE.txt', 'utf8');
await writeFile(directory + '../vendor/LICENSES.txt', [...licenses, fontLicense].join('\n\n--------------------\n\n'));
