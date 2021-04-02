<template>
  <div class="container">
    <div v-if="!userData.message" class="columns is-8">
      <div class="column is-3">
        <div class="card is-unclipped">
          <div class="card-image">
            <figure class="image is-4by3">
              <img
                src="https://bulma.io/images/placeholders/1280x960.png"
                alt="Placeholder image"
              />
            </figure>
          </div>
          <div class="card-content">
            <template v-if="!loadingProfileCard">
              <div
                v-if="$auth.user.username === userData.username"
                class="is-clearfix"
              >
                <b-tooltip
                  label="Edit Profile"
                  size="is-small"
                  type="is-primary is-light"
                  class="is-pulled-right"
                >
                  <i
                    class="bx bx-edit is-clickable is-size-5"
                    @click="editProfile"
                  ></i>
                </b-tooltip>
              </div>
              <div class="media">
                <div class="media-left">
                  <figure v-if="userData" class="image is-48x48">
                    <img
                      :src="`/api/images/${userData.profile_picture}`"
                      alt="Profile Picture"
                    />
                  </figure>
                </div>
                <div class="media-content is-unclipped">
                  <p class="title is-4">{{ userData.name }}</p>
                  <p class="subtitle is-6">@{{ userData.username }}</p>
                </div>
              </div>
              <div class="content">
                <b-button
                  v-if="userData.username != $auth.user.username"
                  expanded
                  type="is-pink"
                  @click="messageUser()"
                  >Message</b-button
                >
              </div>
            </template>
            <div class="media">
              <figure v-if="loadingProfileCard" class="media-left">
                <p class="image is-64x64">
                  <b-skeleton
                    :active="loadingProfileCard"
                    circle
                    width="64px"
                    height="64px"
                  ></b-skeleton>
                </p>
              </figure>
              <div class="media-content">
                <b-skeleton
                  size="is-large"
                  :active="loadingProfileCard"
                  :count="count"
                ></b-skeleton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-9">
        <h1 class="title has-text-centered">Latest Job Applied For</h1>
        <div class="columns is-multiline">
          <InternshipPost
            v-for="internship in appliedInternships"
            :id="internship.id"
            :key="internship.id"
            :gpa="internship.gpa"
            :skills="internship.skills"
            :position="internship.position"
            :start-time="internship.start_date"
            :end-time="internship.end_date"
            :short-description="internship.shortDescription"
            :description="internship.description"
            :profile-picture="internship.profile_picture"
            :qualifications="internship.qualifications"
            :is-active="internship.is_active"
            :company-id="internship.company_id"
          />
        </div>
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
    <b-modal :active="edit" has-modal-card>
      <div class="modal-card">
        <header class="modal-card-head">
          <h1 class="modal-card-title">Edit Profile</h1>
          <button type="button" class="delete" @click="closeJobModal" />
        </header>
        <div class="modal-card-body">
          <ValidationObserver>
            <ValidationProvider
              v-slot="{ errors, valid }"
              rules="required"
              name="Name"
              slim
            >
              <b-field
                label="Name"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-input v-model="updatedProfileData.name"></b-input>
              </b-field>
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors, valid }"
              rules="required"
              name="Username"
              slim
            >
              <b-field
                label="Username"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-input v-model="updatedProfileData.username"></b-input>
              </b-field>
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors, valid }"
              rules="required|email"
              name="Email"
              slim
            >
              <b-field
                label="Email"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-input
                  v-model="updatedProfileData.email"
                  type="email"
                ></b-input>
              </b-field>
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors, valid }"
              rules="required"
              name="Skills"
              slim
            >
              <b-field
                label="Skills"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-taginput
                  v-model="updatedProfileData.skills"
                  ellipsis
                  icon="label"
                ></b-taginput>
              </b-field>
            </ValidationProvider>
          </ValidationObserver>
        </div>
        <footer class="modal-card-foot">
          <b-button
            label="Cancel"
            icon-pack="bx"
            icon-left="bx-x"
            outlined
            type="is-danger"
            @click="closeJobModal"
          ></b-button>
          <b-button
            label="Save"
            type="is-primary"
            icon-pack="bx"
            icon-left="bx-check"
            :loading="isSavingProfile"
            @click="saveProfile"
          ></b-button>
        </footer>
      </div>
    </b-modal>
  </div>
</template>
<script>
import Talk from 'talkjs'
import { mapState } from 'vuex'
import clonedeep from 'lodash/cloneDeep'
import { ValidationObserver, ValidationProvider } from 'vee-validate'

export default {
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      userData: '',
      chatWith: '',
      count: 3,
      loadingProfileCard: true,
      edit: false,
      updatedProfileData: '',
    }
  },
  computed: {
    ...mapState(['appliedInternships', 'isSavingProfile']),
  },
  created() {
    this.$store.dispatch('getAppliedInternships')
  },
  async mounted() {
    const user = await this.$axios.$get(`/api/users/${this.$route.params.slug}`)
    this.userData = user
    this.loadingProfileCard = false
  },

  methods: {
    async messageUser() {
      await Talk.ready.then(() => {
        const me = new Talk.User({
          id: this.$auth.user.id,
          name: this.$auth.user.name,
          email: this.$auth.user.email,
          role: this.$$auth.user.role,
        })
        const other = new Talk.User({
          id: this.userData.id,
          name: this.userData.fullname,
          email: this.userData.email,
          role: this.userData.role,
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
      this.updatedProfileData = clonedeep(this.userData)
      this.edit = !this.edit
    },
    saveProfile() {
      this.$store.dispatch('saveProfile', this.updatedProfileData)
    },
    closeJobModal() {
      this.edit = !this.edit
    },
  },
}
</script>
<style scoped>
.is-unclipped {
  overflow: visible;
}
</style>
