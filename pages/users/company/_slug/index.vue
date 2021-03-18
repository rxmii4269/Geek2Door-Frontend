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
            <div
              v-if="userData.username == $auth.user.username"
              class="test is-clearfix"
            >
              <b-tooltip
                label="Edit Profile"
                position="is-left"
                size="is-small"
                type="is-primary is-light"
                class="is-pulled-right"
              >
                <figure
                  class="image is-16x16 is-pulled-right is-clickable"
                  @click="editProfile"
                >
                  <img src="~assets/img/pencil.svg" alt="" />
                </figure>
              </b-tooltip>
            </div>
            <div class="media mt-5">
              <div class="media-left">
                <figure v-if="userData" class="image is-48x48">
                  <img
                    :src="`${$axios.defaults.baseURL}/images/${userData.profile_picture}`"
                    alt="Profile Picture"
                  />
                </figure>
              </div>
              <div class="media-content mt-2">
                <b-field v-if="edit" label="Name" label-position="on-border">
                  <b-input
                    v-model.trim.lazy="updatedData.company_name"
                  ></b-input>
                </b-field>
                <p v-else class="title is-4">{{ userData.company_name }}</p>
              </div>
            </div>
            <b-field v-if="edit" label="Email" label-position="on-border">
              <b-input v-model.trim.lazy="updatedData.email"></b-input>
            </b-field>

            <p v-else class="subtitle is-6">{{ userData.email }}</p>

            <div class="content">
              <b-field
                v-if="edit"
                label="Description"
                label-position="on-border"
                class="mt-3"
              >
                <b-input
                  v-model.trim.lazy="updatedData.company_desc"
                  maxlength="200"
                  type="textarea"
                ></b-input>
              </b-field>
              <p v-else>{{ userData.company_desc }}</p>
              <b-button
                v-if="userData.username != $auth.user.username"
                expanded
                type="is-pink"
                @click="messageUser()"
                >Message</b-button
              >
            </div>
            <div v-if="edit" class="buttons is-centered">
              <b-button
                type="is-danger is-outlined card-footer-item"
                @click="editProfile"
                >Cancel</b-button
              >
              <b-button type="is-primary card-footer-item" @click="saveProfile"
                >Save</b-button
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
import Talk from 'talkjs'
export default {
  data() {
    return {
      userData: '',
      chatWith: '',
      edit: false,
      updatedData: '',
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
    editProfile() {
      this.edit = !this.edit
      this.updatedData = this.userData
    },
    async saveProfile() {
      const self = this
      await this.$axios
        .$post(`/users/company/${this.$auth.user.id}`, this.updatedData)
        .then(async function (response) {
          const updatedUser = await self.$axios.$get('/auth/user')
          await self.$auth.setUser(updatedUser.user)
          self.$router.push(`/users/company/${self.$auth.user.name}`)
          self.$store.dispatch('generateProfileUrl')
        })
    },
  },
}
</script>
