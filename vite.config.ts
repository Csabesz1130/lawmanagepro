import { remixPWA } from '@remix-pwa/dev'
import { vitePlugin as remix } from '@remix-run/dev'
import esbuild from 'esbuild'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const isProduction = process.env.NODE_ENV === 'production'

// Define a config with the polyfills
const remixConfig = {
  future: {
    v3_fetcherPersist: true,
    v3_relativeSplatPath: true,
    v3_throwAbortReason: true,
    v3_singleFetch: true,
    v3_lazyRouteDiscovery: true,
    unstable_optimizeDeps: true,
  },
  browserNodeBuiltinsPolyfill: {
    modules: {
      fs: true,
      buffer: true,
      stream: true,
      zlib: true,
      url: true,
      path: true
    }
  },
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
  }
}

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
      },
    },
  },
  plugins: [
    // Cast the config to any to bypass TypeScript errors
    remix(remixConfig as any),
    tsconfigPaths(),
    ...(isProduction ? [remixPWA()] : []),
  ],
})