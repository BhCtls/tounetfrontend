import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 监听所有网络接口
    port: 5174,      // 明确指定端口
    strictPort: true, // 如果端口被占用则失败而不是尝试其他端口
    allowedHosts: ['.nyat.app', 'localhost', '192.168.1.6', '127.0.0.1', '[::1]'],
  },
})