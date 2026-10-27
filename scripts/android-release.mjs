import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const gradle = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';

function run(command, args, cwd = root) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit', shell: true });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run(npm, ['run', 'cap:sync']);
run(gradle, ['assembleRelease'], path.join(root, 'android'));

const copy = spawnSync(process.execPath, [path.join(root, 'scripts', 'copy-apk.mjs')], {
  cwd: root,
  stdio: 'inherit'
});
if (copy.status !== 0) process.exit(copy.status ?? 1);
if (!fs.existsSync(path.join(root, 'dist', 'Campy.apk'))) {
  console.error('No se encontró dist/Campy.apk después del build.');
  process.exit(1);
}
