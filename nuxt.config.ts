export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    'bootstrap-icons/font/bootstrap-icons.css',
    '~/assets/css/main.css',
    'animate.css'
  ],
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/image'
  ],
  pinia: {
    storesDirs: ['./stores/**'],
  },
  i18n: {
    langDir: 'locales',
    defaultLocale: 'en',
    locales: [
      { code: 'en', file: 'en.json' },
      { code: 'uk', file: 'uk.json' }
    ],
    strategy: 'prefix_except_default',
    vueI18n: './config/i18n.config.ts'
  },
  app: {
    head: {
      title: 'Inventory System',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
          defer: true
        }
      ]
    },
    baseURL: '/',
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },
  nitro: {
    devProxy: {
      '/ws': {
        target: 'http://localhost:8080',
        ws: true
      }
    }
  },
  vite: {
    worker: {
      format: 'es'
    }
  },
  vue: {
    compilerOptions: {
      isCustomElement: tag => tag.startsWith('gmp-') || tag.startsWith('gmpx-')
    }
  }
})