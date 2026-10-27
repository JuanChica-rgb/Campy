import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';

function campyLegal(): Plugin {
  const send = (file: string, res: { setHeader: (k: string, v: string) => void; end: (b: Buffer) => void }) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(fs.readFileSync(file));
  };

  return {
    name: 'campy-legal',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/legal')) return next();
        const url = req.url.split('?')[0];
        const rel = url.replace(/^\/legal\/?/, '') || 'index.html';
        const file = path.resolve('legal', rel.endsWith('.html') ? rel : path.join(rel, 'index.html'));
        if (!fs.existsSync(file)) return next();
        send(file, res);
      });
    },
    closeBundle() {
      const dest = path.join(path.resolve('dist'), 'legal');
      fs.mkdirSync(dest, { recursive: true });
      fs.cpSync(path.resolve('legal'), dest, { recursive: true });
    }
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), campyLegal()]
});
