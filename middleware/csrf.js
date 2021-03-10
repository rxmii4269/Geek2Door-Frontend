export default async function ({ $axios, context }) {
  const csrf = await $axios.$get('/csrf')
  $axios.setHeader('X-CSRF-Token', csrf)
}
