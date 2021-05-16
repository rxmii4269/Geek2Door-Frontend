<template>
  <div id="inbox-container">
    <i>Loading chat...</i>
  </div>
</template>
<script>
import Talk from 'talkjs'
import { sha256 } from 'js-sha256'
export default {
  name: 'Inbox',
  props: {
    currentUser: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    const self = this
    Talk.ready.then(function () {
      const me = new Talk.User({
        id: self.currentUser.id,
        name: self.currentUser.name,
        email: self.currentUser.email,
        role: self.currentUser.role,
      })
      window.talkSession = new Talk.Session({
        appId: process.env.APP_ID,
        me,
        signature: sha256
          .hmac(process.env.SECRET_KEY, self.$auth.user.id.toString())
          .toString(),
      })
      const inbox = window.talkSession.createInbox()
      inbox.mount(document.getElementById('inbox-container'))
    })
  },
}
</script>
<style scoped>
#inbox-container {
  width: 100%;
  margin: 0px;
  height: 80vh;
}
</style>
