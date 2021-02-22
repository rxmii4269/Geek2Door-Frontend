<template>
  <div class="chatbox-container is-hidden">
    <div id="talkjs-container"></div>
  </div>
</template>
<script>
import Talk from 'talkjs'
export default {
  methods: {
    async loadChat(userId) {
      const user = await this.$auth.$get(`/users/${userId}`)
      Talk.ready.then(() => {
        const me = new Talk.User({
          id: this.$auth.user.id,
          name: this.$auth.user.name,
          email: this.$auth.user.email,
        })
        const other = new Talk.User({
          id: user.id,
          name: user.name,
          email: user.name,
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
    },
  },
}
</script>
<style>
.chatbox-container {
  position: absolute;
  bottom: 0;
  height: 400px;
  right: 0;
  width: 300px;
}
</style>
