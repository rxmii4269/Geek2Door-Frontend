import Talk from 'talkjs'
export default function (context) {
  if (context.$auth.loggedIn && process.browser) {
    Talk.ready.then(() => {
      const me = new Talk.User({
        id: context.$auth.user.id,
        name: context.$auth.user.name,
        email: context.$auth.user.email,
        role: context.$auth.user.role,
        photoUrl:
          context.$config.axios.browserBaseURL +
          '/api/images/' +
          context.$auth.user.profile_picture,
      })

      if (!window.talkSession) {
        window.talkSession = new Talk.Session({
          appId: 'tR1gNHsD',
          me,
        })
      }
      window.talkSession.unreads.on('change', (unreadConversations) => {
        const amountOfUnreads = unreadConversations.length
        const count = document.getElementById('notification-badge--count')
        if (amountOfUnreads > 0) {
          count.textContent = amountOfUnreads
          document
            .getElementById('notification-badge')
            .classList.remove('is-hidden')
          document.title = `(${amountOfUnreads}) Geek2Door`
        }
        if (amountOfUnreads === 0) {
          document
            .getElementById('notification-badge')
            .classList.add('is-hidden')
          document.title = 'Geek2Door'
        }
      })
    })
  }
}
