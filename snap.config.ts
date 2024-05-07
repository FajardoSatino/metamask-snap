import type { SnapConfig } from '@metamask/snaps-cli';

const config: SnapConfig = {
  manifest: { path: './packages/snap/snap.manifest.json' },
  input: 'src/index.js',
  output: {
    path: 'dist',
  },
  server: {
    port: 9000,
  },
};

export default config;
