// import { hmrPlugin, presets } from '@open-wc/dev-server-hmr';

import copy from 'rollup-plugin-copy';
import proxy from 'koa-proxies';
/** Use Hot Module replacement by adding --hmr to the start command */
const hmr = process.argv.includes('--hmr');

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  open: '/',
  watch: !hmr,
  /** Resolve bare module imports */
  nodeResolve: {
    exportConditions: ['browser', 'development'],
  },
  mimeTypes: {
    '**/*.cjs': 'js',
  },
  port: 9905,
  middleware: [
    /*proxy('/api/', {
      target: 'http://localhost:4242/',
    }),*/
    proxy('/api/', {
      target: 'http://localhost:3000/',
      changeOrigin: true
    }),
  ],
});
