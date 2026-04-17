// import { fileURLToPath, URL } from 'node:url'

// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
// import vueDevTools from 'vite-plugin-vue-devtools'
// import tailwindcss from '@tailwindcss/vite'


// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     vue(),
//     tailwindcss(),
//     vueDevTools(),
//   ],
//   resolve: {
//     alias: {
//       '@': fileURLToPath(new URL('./src', import.meta.url))
//     },
//   },
// })


// vite.config.js
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import vueDevTools from 'vite-plugin-vue-devtools'

const isWidget = process.env.BUILD_TARGET === 'widget'

export default defineConfig({
  // ✅ Only define process.env safely, don't replace entire process object
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },

  plugins: [vue(), tailwindcss(),vueDevTools(),],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },

  build: isWidget
  ? {
      assetsInlineLimit: 1000000, // ✅ inline ALL assets under ~1MB as base64
      lib: {
        entry: fileURLToPath(new URL('./src/widget.js', import.meta.url)),
        name: 'MyWidget',
        fileName: () => 'widget.umd.js',
        formats: ['umd'],
      },
      rollupOptions: {
        external: [],
        output: {
          format: 'umd',
          name: 'MyWidget',
          entryFileNames: 'widget.umd.js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) return 'widget.css'
            return assetInfo.name
          },
        },
      },
      outDir: 'dist-widget',
      cssCodeSplit: false,
    }
    : {
        outDir: 'dist',
      },
})