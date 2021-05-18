import Pusher from 'pusher-js'

export default function ({ $auth, context, store }) {
  Pusher.logToConsole = true
  const pusher = new Pusher('68433ae317f2e9c0905e', {
    cluster: 'us2',
  })

  pusher.config.authEndpoint = `${process.env.API_URL}/api/pusher/auth`

  if (typeof $auth !== 'undefined') {
    if ($auth.loggedIn) {
      if ($auth.user.role === 'student') {
        const channel = pusher.subscribe(
          `private-InternshipInvitations-${$auth.user.id}`
        )
        channel.bind('Invitations', (data) => {
          if (process.browser) {
            console.log(data)
            store.dispatch('getNotifications', data)
          }
        })
      }
    }
  }
}
