import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [vue(), cssInjectedByJsPlugin()],
    define: {
      'process.env': env
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined,
        }
      }
    }
  }
})
