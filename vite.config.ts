import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    // Используем корень '/' для локальной разработки (mode === 'development')
    // и имя репозитория для продакшен-сборки (mode === 'production')
    base: mode === 'production' ? '/fullstack-test-task/' : '/',
    plugins: [react()],
  }
})
