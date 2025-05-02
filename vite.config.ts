import { remixPWA } from '@remix-pwa/dev'
import { vitePlugin as remix } from '@remix-run/dev'
import esbuild from 'esbuild'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import tsconfigPaths from 'vite-tsconfig-paths'

const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
      },
    },
  },
  plugins: [
    // Add the nodePolyfills plugin BEFORE the remix plugin
    nodePolyfills({
      // Add the polyfills for the Node.js modules
      include: ['fs', 'buffer', 'stream', 'zlib', 'url', 'path']
    }),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
        unstable_optimizeDeps: true,
      },
      // Remove the browserNodeBuiltinsPolyfill property
      serverBuildFile: 'remix.js',
      buildEnd: async () => {
        await esbuild
          .build({
            alias: { '~': './app', '@': './app', '@core': './core' },
            outfile: 'build/server/index.js',
            entryPoints: ['server/index.ts'],
            external: ['./build/server/*'],
            platform: 'node',
            format: 'esm',
            packages: 'external',
            bundle: true,
            logLevel: 'info',
          })
          .catch((error: unknown) => {
            console.error('Error building server:', error)
            process.exit(1)
          })
      },
    }),
    tsconfigPaths(),
    
    ...(isProduction ? [remixPWA()] : []),
  ],
})