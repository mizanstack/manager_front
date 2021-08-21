export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'File Manger',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '/style.css' },
      { rel: 'stylesheet', href: '//cdnjs.cloudflare.com/ajax/libs/font-awesome/3.2.1/css/font-awesome.min.css' },
      { rel: 'stylesheet', href: '//cdnjs.cloudflare.com/ajax/libs/font-awesome/3.2.1/font/fontawesome-webfont.ttf' },
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/global.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],
  auth: { 
    redirect: {
      login: '/auth/login',
      logout: '/auth/login',
      callback: '/login',
      home: '/'
    },
    strategies: {
      local: {
        token: {
          property: 'token',
          required: true,
          type: 'Bearer'
        },
        user: {
          property: 'data',
          // autoFetch: true
        },
        endpoints: {
          login: { url: '/login', method: 'post', propertyName: 'token' },
          logout: { url: '/logout', method: 'get' },
          user: { url: '/me', method: 'get', propertyName: 'data' }
        }
      }
    }
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // extra config e.g
    // BaseURL: 'https://link-to-API'
    // baseURL: 'http://localhost:3001/api', // Used as fallback if no runtime config is provided

    baseURL: process.env.NODE_ENV == 'production' ? 'https://manager.azizbazar.xyz/api' : 'http://localhost:350/api',

  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
