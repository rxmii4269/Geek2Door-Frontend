<template>
  <div id="talkjs-container" style="width: 90%; margin: 30px; height: 500px">
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
  data() {
    return {
      user: {},
    }
  },
  mounted() {
    this.$axios.$get('/users/1').then((response) => {
      return (
        (this.user.id = response.id),
        ((this.user.name = response.username),
        (this.user.email = response.email))
      )
    })
    Talk.ready.then(() => {
      const me = new Talk.User({
        id: this.currentUser.id,
        name: this.currentUser.name,
        email: this.currentUser.email,
        photoUrl: this.currentUser.photo,
        welcomeMessage: 'Hey there! How are you? :-)',
        role: 'buyer',
      })
      const talkSession = new Talk.Session({
        appId: 'tR1gNHsD',
        me,
      })
      const other = new Talk.User({
        id: this.user.id,
        name: this.user.name,
        email: this.user.name,
        photoUrl: 'https://demo.talkjs.com/img/john.jpg',
        welcomeMessage: 'Hey, how can I help?',
        role: 'seller',
      })
      const conversation = talkSession.getOrCreateConversation(
        Talk.oneOnOneId(me, other)
      )
      conversation.setParticipant(me)
      conversation.setParticipant(other)
      const inbox = talkSession.createInbox({ selected: conversation })
      inbox.mount(document.getElementById('talkjs-container'))
    })
  },
  created() {},
}
</script>
