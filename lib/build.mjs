import { build, } from 'esbuild';

const opts = {
  bundle: true,
  format: 'esm',
  target: 'es2020',
  minify: false,
  platform: 'browser'
}

await build({
  entryPoints: ['src/vosk.worker.ts'],
  outfile: 'dist/vosk.worker.js',
  ...opts,
});

await build({
  entryPoints: ['src/vosk.wasm.ts'],
  outfile: 'dist/vosk.wasm.js',
  ...opts,
});
