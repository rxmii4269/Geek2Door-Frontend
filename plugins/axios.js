export default function ({ $axios, redirect, $auth }) {
  $axios.onRequest((config) => {
    if (config.url.includes('refresh')) {
      const refreshToken = $auth.strategy.refreshToken.get()
      $axios.setToken(refreshToken, 'Bearer')
    }
  })
}
