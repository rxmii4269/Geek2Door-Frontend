export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',
  loadingIndicator: {
    name: 'cube-grid',
    color: '#fb8a8a',
    background: 'white',
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Geek2Door',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/custom.css',
    'boxicons/css/boxicons.min.css',
    '@creativebulma/bulma-divider/dist/bulma-divider.min.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['@/plugins/vee-validate.js'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/google-fonts',
  ],

  router: {
    middleware: ['talkjs', 'csrf', 'auth'],
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    'nuxt-buefy',
    '@nuxtjs/auth-next',
  ],

  pageTransition: {
    mode: 'out-in',
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.API_URL,
    credentials: true,
    common: {
      Accept: 'application/json, text/plain, */*',
    },
  },

  publicRuntimeConfig: {
    axios: {
      browserBaseURL: process.env.API_URL,
      credentials: true,
    },
  },

  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.API_URL,
      credentials: true,
    },
  },

  auth: {
    plugins: [{ src: '@/plugins/axios' }],
    resetOnError: true,
    fullPathRedirect: true,
    localStorage: false,
    redirect: {
      login: '/accounts/login',
      logout: '/',
      callback: '/accounts/login',
      home: '/home',
    },
    strategies: {
      local: {
        scheme: 'refresh',
        token: {
          property: 'access_token',
        },
        refreshToken: {
          property: 'refresh_token',
          data: 'refresh_token',
          tokenRequired: true,
        },
        user: {
          property: 'user',
        },
        endpoints: {
          login: { url: '/api/auth/login', method: 'post' },
          refresh: { url: '/api/auth/refresh', method: 'post' },
          logout: { url: '/api/auth/logout', method: 'delete' },
          user: { url: '/api/auth/user', method: 'get' },
        },
      },
    },
  },

  googleFonts: {
    families: {
      Poppins: [100, 200, 300, 400, 500, 700, 800, 900],
      Lato: [100, 300, 400],
    },
    display: 'auto',
    prefetch: true,
    preload: true,
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [
      'vee-validate/dist/rules',
      'lodash.debounce',
      'lodash.cloneDeep',
    ],
  },
}
