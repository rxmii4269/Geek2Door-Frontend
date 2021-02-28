export default async function ({ $auth, $axios }) {
  if (!$auth.loggedIn) {
    return
  }

  const auth = $auth
  const authStrategy = auth.strategy.name
  if (authStrategy === 'facebook' || authStrategy === 'google') {
    const token = auth.strategy.token.get().substr(7)
    const authStrategyConverted = authStrategy === 'facebook' ? 'fb' : 'google'
    const url = `/user/signup/${authStrategyConverted}?token=${token}`

    try {
      const { data } = await $axios.$post(url, { email: auth.user.email })
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }
}
