<template>
  <div id="inbox-container">
    <i>Loading chat...</i>
  </div>
</template>
<script>
import Talk from 'talkjs'
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
        role: 'buyer',
      })
      window.talkSession = new Talk.Session({
        appId: 'tR1gNHsD',
        me,
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
  height: 100%;
}
</style>
