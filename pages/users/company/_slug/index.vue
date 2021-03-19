<template>
  <div class="container">
    <div v-if="!profileData.message" class="columns is-8">
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
              v-if="profileData.username == $auth.user.username"
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
                <figure v-if="profileData" class="image is-48x48">
                  <img
                    :src="`${$axios.defaults.baseURL}/images/${profileData.profile_picture}`"
                    alt="Profile Picture"
                  />
                </figure>
              </div>
              <div class="media-content mt-2">
                <p class="title is-4">{{ profileData.company_name }}</p>
              </div>
            </div>

            <p class="subtitle is-6">{{ profileData.email }}</p>

            <div class="content">
              <p>{{ profileData.company_desc }}</p>
              <b-button
                v-if="profileData.username != $auth.user.username"
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
        <div class="box"></div>
      </div>
    </div>
    <div v-if="profileData.message" class="hero is-warning is-medium">
      <div class="hero-body">
        <p class="title">{{ profileData.message }}</p>
      </div>
    </div>
    <Chat v-if="$auth.loggedIn" ref="Chat" />
    <b-modal v-model="edit" has-modal-card>
      <div class="modal-card">
        <div class="modal-card-head">
          <h1>Edit Profile</h1>
        </div>
        <div class="modal-card-body">
          <b-field label="Name" label-position="on-border">
            <b-input
              v-model.trim.lazy="updatedProfileData.company_name"
            ></b-input>
          </b-field>
          <b-field label="Email" label-position="on-border">
            <b-input v-model.trim.lazy="updatedProfileData.email"></b-input>
          </b-field>
          <b-field label="Description" label-position="on-border" class="mt-3">
            <b-input
              v-model.trim.lazy="updatedProfileData.company_desc"
              maxlength="200"
              type="textarea"
            ></b-input>
          </b-field>
          <h1>Address Information</h1>
          <b-field grouped group-multiline class="mt-3">
            <p class="control">
              <b-field label="Street" label-position="on-border">
                <b-input
                  v-model.trim.lazy="updatedProfileData.street"
                  expanded
                ></b-input>
              </b-field>
            </p>
            <p class="control">
              <b-field label="Parish" label-position="on-border">
                <b-input
                  v-model.trim.lazy="updatedProfileData.parish"
                  expanded
                ></b-input>
              </b-field>
            </p>
            <p class="control">
              <b-field label="City" label-position="on-border">
                <b-input
                  v-model.trim.lazy="updatedProfileData.city"
                  expanded
                ></b-input>
              </b-field>
            </p>
          </b-field>
        </div>
        <div class="modal-card-foot is-centered">
          <div class="buttons is-centered">
            <b-button
              type="is-danger is-outlined card-footer-item"
              @click="cancel"
              >Cancel</b-button
            >
            <b-button type="is-primary card-footer-item" @click="saveProfile"
              >Save</b-button
            >
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script>
import Talk from 'talkjs'
export default {
  data() {
    return {
      chatWith: '',
      edit: false,
    }
  },
  computed: {
    profileData: {
      get() {
        return this.$store.state.profileData
      },
    },
    updatedProfileData: {
      get() {
        return this.$store.state.updatedProfileData
      },
      set(value) {
        this.$store.commit('', value)
      },
    },
  },
  async mounted() {
    await this.$store.dispatch('getProfile', this.$route.params.slug)
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
          id: this.profileData.id,
          name: this.profileData.fullname,
          email: this.profileData.email,
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
      this.$store.dispatch('editProfile', this.profileData)
    },
    cancel() {
      this.$store.dispatch('getProfile', this.$route.params.slug)
      this.edit = !this.edit
    },
    saveProfile() {
      this.$store.dispatch('saveProfile', this.updatedProfileData)
      this.edit = !this.edit
    },
  },
}
</script>
