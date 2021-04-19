export default async function ({ $axios, $auth }) {
  try {
    if (!$auth.loggedIn) {
      const csrf = await $axios.$get('/api/csrf')
      $axios.setHeader('X-CSRF-Token', csrf)
    }
  } catch (error) {
    console.error(error.response)
  }
}
