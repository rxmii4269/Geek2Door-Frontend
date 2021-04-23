import { NotificationProgrammatic as Notification } from 'buefy'
export default function ({ $axios, redirect, $auth }) {
  $axios.onRequest((config) => {
    if (config.url.includes('refresh')) {
      const refreshToken = $auth.strategy.refreshToken.get()
      $axios.setToken(refreshToken, 'Bearer')
    }
  })
  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    if (code === 401) {
      Notification.open({
        duration: 4000,
        type: 'is-danger',
        hasIcon: true,
        message: error.response,
      })
    }
  })
}
