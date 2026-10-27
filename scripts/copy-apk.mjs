import fs from 'fs';
import path from 'path';

const candidates = [
  path.join(process.env.LOCALAPPDATA || '', 'CampyAndroidBuild', 'app', 'outputs', 'apk', 'release', 'app-release.apk'),
  path.join('android', 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk')
];

const source = candidates.find(file => file && fs.existsSync(file));
if (!source) {
  console.log('No hay APK de release todavía. Corre npm run apk primero.');
  process.exit(0);
}

const destDir = path.resolve('dist');
fs.mkdirSync(destDir, { recursive: true });
const dest = path.join(destDir, 'Campy.apk');
fs.copyFileSync(source, dest);
const mb = (fs.statSync(dest).size / (1024 * 1024)).toFixed(1);
console.log(`APK copiada a dist/Campy.apk (${mb} MB)`);
