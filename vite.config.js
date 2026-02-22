import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // تأكد أن هذا المسار يطابق اسم المستودع (Repository) على GitHub تماماً
  base: '/social-page/',
  build: {
    // Vite افتراضياً يضع الملفات في مجلد dist، لا داعي لتكرار ذلك إلا إذا أردت تغييره
    outDir: 'dist',
  }

})