import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import polyfillNode from "rollup-plugin-polyfill-node";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), polyfillNode()],
  optimizeDeps: {
    exclude: ["web3"], // <= The libraries that need shimming should be excluded from dependency optimization.
  },
});
