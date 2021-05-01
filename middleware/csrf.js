import { NotificationProgrammatic as Notification } from 'buefy'

export default async function ({ $axios, $auth }) {
  try {
    if (!$auth.loggedIn) {
      const csrf = await $axios.$get('/api/csrf')
      $axios.setHeader('X-CSRF-Token', csrf)
    }
  } catch (error) {
    Notification.open({
      duration: 3000,
      type: 'is-danger',
      message: error.response,
      hasIcon: true,
      position: 'is-top-right',
    })
  }
}
