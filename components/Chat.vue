<template>
  <div
    id="talkjs-container"
    class="chatbox-container"
    :class="{ 'is-hidden': this.hidden }"
  ></div>
</template>
<script>
import Talk from 'talkjs'
export default {
  data() {
    return {
      hidden: true,
    }
  },
  methods: {
    async loadChat(userId) {
      const user = await this.$axios.$get(`/users/${userId}`)
      Talk.ready.then(() => {
        const me = new Talk.User({
          id: this.$auth.user.id,
          name: this.$auth.user.name,
          email: this.$auth.user.email,
          role: 'buyer',
        })
        const other = new Talk.User({
          id: user.id,
          name: user.fullname,
          email: user.email,
          role: 'seller',
        })

        if (!window.talkSession) {
          window.talkSession = new Talk.Session({
            appId: 'tR1gNHsD',
            me,
          })
        }

        const conversationId = Talk.oneOnOneId(me, other)
        const conversation = window.talkSession.getOrCreateConversation(
          conversationId
        )
        conversation.setParticipant(me)
        conversation.setParticipant(other)

        const chatbox = window.talkSession.createChatbox(conversation)
        chatbox.mount(document.getElementById('talkjs-container'))
      })
      this.hidden = false
    },
  },
}
</script>
<style>
.chatbox-container {
  position: fixed;
  bottom: 0;
  height: 400px;
  right: 5%;
  width: 300px;
}
</style>
