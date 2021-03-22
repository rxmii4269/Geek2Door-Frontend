<template>
  <div class="container">
    <div v-if="!userData.message" class="columns is-8">
      <div class="column is-3">
        <div class="card">
          <div class="card-image">
            <figure class="image is-4by3">
              <img
                src="https://bulma.io/images/placeholders/1280x960.png"
                alt="Placeholder image"
              />
            </figure>
          </div>
          <div class="card-content">
            <div class="media">
              <div class="media-left">
                <figure v-if="userData" class="image is-48x48">
                  <img
                    :src="`${$axios.defaults.baseURL}/images/${userData.profile_picture}`"
                    alt="Profile Picture"
                  />
                </figure>
              </div>
              <div class="media-content">
                <p class="title is-4">{{ userData.name }}</p>
                <p class="subtitle is-6">@{{ userData.username }}</p>
              </div>
            </div>

            <div class="content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
              nec iaculis mauris. <a>@bulmaio</a>. <a href="#">#css</a>
              <a href="#">#responsive</a>
              <br />
              <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
              <b-button
                v-if="userData.username != $auth.user.username"
                expanded
                type="is-pink"
                @click="messageUser()"
                >Message</b-button
              >
            </div>
          </div>
        </div>
      </div>
      <div class="column is-9">
        <b-button type="is-primary">Create Blog </b-button>

        <div class="card column is-4">
          <div class="card-image">
            <figure class="image is-4by3">
              <img
                src="https://bulma.io/images/placeholders/1280x960.png"
                alt="Placeholder image"
              />
            </figure>
          </div>
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <p class="title is-4">Some Blog Title</p>
                <p class="subtitle is-6">by: {{ userData.username }}</p>
              </div>
            </div>
            <div class="content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
              nec iaculis mauris. <a>@thingsStressingYou</a>.
              <a href="#">#LifeonlyGetsWorse</a>
              <a href="#">#responsive</a>
              <br />

              <b-button slim type="is-pink" class="is-pulled-left"
                >Comment</b-button
              >
              <b-button slim type="is-pink" class="is-pulled-left"
                >Edit</b-button
              >
              <br />
              <br />
              <time datetime="2016-1-1">11:09 PM - 1 Jan 2021</time>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="userData.message" class="hero is-warning is-medium">
      <div class="hero-body">
        <p class="title">{{ userData.message }}</p>
      </div>
    </div>
    <Chat v-if="$auth.loggedIn" ref="Chat" />
  </div>
</template>
<script>
import Talk from 'talkjs'
export default {
  data() {
    return {
      userData: '',
      chatWith: '',
    }
  },
  async mounted() {
    const user = await this.$axios.$get(`/users/${this.$route.params.slug}`)
    this.userData = user
  },
  methods: {
    async messageUser() {
      await Talk.ready.then(() => {
        const me = new Talk.User({
          id: this.$auth.user.id,
          name: this.$auth.user.name,
          email: this.$auth.user.email,
          role: 'buyer',
        })
        const other = new Talk.User({
          id: this.userData.id,
          name: this.userData.fullname,
          email: this.userData.email,
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

        const popup = window.talkSession.createPopup(conversation)
        popup.mount({ show: false })
        popup.show()
      })
    },
  },
}
</script>
