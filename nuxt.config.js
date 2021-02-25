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
    middleware: ['auth', 'talkjs'],
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
    prefix: process.env.API_URL,
    credentials: false,
    common: {
      Accept: 'application/json, text/plain, */*',
    },
  },

  auth: {
    resetOnError: true,
    redirect: {
      login: '/accounts/login',
      logout: '/accounts/login',
      callback: '/accounts/login',
      home: '/home',
    },
    strategies: {
      local: {
        token: {
          property: 'token',
        },
        user: {
          property: 'user',
        },
        endpoints: {
          login: { url: 'users/auth/login', method: 'post' },
          logout: { url: 'users/auth/logout', method: 'post' },
          user: { url: '/auth/user', method: 'get' },
        },
      },
      facebook: {
        endpoints: {
          userInfo:
            'https://graph.facebook.com/v6.0/me?fields=id,name,picture{url}',
        },
        clientId: '212618690600130',
        scope: ['public_profile', 'email'],
      },
      github: {
        clientId: 'd936b752248cd694ef7a',
        clientSecret: '3e7718cd7f969b115256820f418f22a2de0c8cde',
      },
      google: {
        clientId:
          '1086921459591-27e69g8joj6diu1osbap27pcjquu1ffr.apps.googleusercontent.com',
        scope: ['profile', 'email'],
        codeChallengeMethod: '',
        responseType: 'token id_token',
        nonce: null,
        refreshToken: {
          property: 'refresh_token',
          maxAge: 60 * 60 * 20 * 30,
        },
      },
    },
  },

  googleFonts: {
    families: {
      Poppins: [300, 400, 500, 700],
      Lato: [100, 300, 400],
    },
    display: 'swap',
    text: 'Geek2Door',
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
    transpile: ['vee-validate/dist/rules'],
  },
}
