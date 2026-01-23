import { resolve } from 'node:path';
import { defineConfig, type PluginOption, loadEnv } from 'vite';
import libAssetsPlugin from '@laynezh/vite-plugin-lib-assets';
import makeManifestPlugin from './utils/plugins/make-manifest-plugin';
import { watchPublicPlugin, watchRebuildPlugin } from '@extension/hmr';
import { isDev, isProduction, watchOption } from '@extension/vite-config';

const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, 'src');

const outDir = resolve(rootDir, '..', 'dist');

export default defineConfig(({ mode }) => {
  // Load environment variables from the parent directory
  const env = loadEnv(mode, resolve(rootDir, '..'), 'VITE_');

  return {
    resolve: {
      alias: {
        '@root': rootDir,
        '@src': srcDir,
        '@assets': resolve(srcDir, 'assets'),
        // Stub out Node.js-only modules that puppeteer-core transitively imports
        '@puppeteer/browsers': resolve(rootDir, 'src/stubs/empty.ts'),
        'proxy-agent': resolve(rootDir, 'src/stubs/empty.ts'),
      },
      conditions: ['browser', 'module', 'import', 'default'],
      mainFields: ['browser', 'module', 'main'],
    },
    optimizeDeps: {
      exclude: [
        '@puppeteer/browsers',
        'chromium-bidi',
        'proxy-agent',
        'basic-ftp',
      ],
    },
    server: {
      // Restrict CORS to only allow localhost
      cors: {
        origin: ['http://localhost:5173', 'http://localhost:3000'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
      },
      host: 'localhost',
      sourcemapIgnoreList: false,
    },
    plugins: [
      libAssetsPlugin({
        outputPath: outDir,
      }) as PluginOption,
      watchPublicPlugin(),
      makeManifestPlugin({ outDir }),
      isDev && watchRebuildPlugin({ reload: true, id: 'chrome-extension-hmr' }),
    ],
    publicDir: resolve(rootDir, 'public'),
    build: {
      lib: {
        formats: ['iife'],
        entry: resolve(__dirname, 'src/background/index.ts'),
        name: 'BackgroundScript',
        fileName: 'background',
      },
      outDir,
      emptyOutDir: false,
      sourcemap: isDev,
      minify: isProduction,
      reportCompressedSize: isProduction,
      watch: watchOption,
      rollupOptions: {
        external: [
          'chrome',
          // Exclude chromium-bidi - extension uses CDP protocol, not BiDi
          /^chromium-bidi/,
          // Exclude @puppeteer/browsers - uses Node.js modules not available in browser
          /^@puppeteer\/browsers/,
          // Exclude Node.js-only dependencies that get pulled in transitively
          /^basic-ftp/,
          /^proxy-agent/,
        ],
        output: {
          globals: {
            chrome: 'chrome',
          },
        },
      },
    },

    define: {
      'import.meta.env.DEV': isDev,
      'import.meta.env.VITE_POSTHOG_API_KEY': JSON.stringify(
        env.VITE_POSTHOG_API_KEY || process.env.VITE_POSTHOG_API_KEY || '',
      ),
    },

    envDir: '../',
    envPrefix: 'VITE_',
  };
});
