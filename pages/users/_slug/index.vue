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
                <figure class="image is-48x48">
                  <img
                    src="https://bulma.io/images/placeholders/96x96.png"
                    alt="Placeholder image"
                  />
                </figure>
              </div>
              <div class="media-content">
                <p class="title is-4">{{ userData.fullname }}</p>
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
                @click="messageUser(userData.id)"
                >Message</b-button
              >
            </div>
          </div>
        </div>
      </div>
      <div class="column is-9">
        <div class="box"></div>
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
    messageUser(userId) {
      this.$refs.Chat.loadChat(userId)
    },
  },
}
</script>
