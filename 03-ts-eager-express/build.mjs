// const { build } = require('esbuild')
import esbuild from 'esbuild';

const {build} = esbuild;
// console.log(build);

const options = {
  entryPoints: ['./src/server/api.ts'],
  minify: process.env.NODE_ENV === 'production',
  bundle: true,
  // outdir: './dist',
  outfile: './dist/index.js',
  platform: 'node',
  target: 'esnext'
}

build(options).catch(err => {
  process.stderr.write(err.stderr)
  process.exit(1)
})

// esbuild \
//   --outdir=dist/src \
//   --platform=node \
//   --target=es2019 \
//   --format=cjs \
//   src/**/*.ts