<template>
  <div class="container">
    <div v-if="!profileData.message" class="columns is-8">
      <div class="column is-3">
        <div class="card is-unclipped">
          <div class="card-image">
            <figure
              v-if="profileData && !loadingProfileCard"
              class="image is-4by4"
            >
              <img
                :src="`${$config.axios.browserBaseURL}/api/images/${profileData.profile_picture}`"
                alt="Profile Picture"
              />
            </figure>
            <b-skeleton height="80px" :active="loadingProfileCard"></b-skeleton>
          </div>
          <div class="card-content">
            <template v-if="!loadingProfileCard">
              <div
                v-if="$auth.user.username === profileData.username"
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
                <div class="media-content">
                  <p class="title is-4">{{ profileData.name }}</p>
                  <p class="subtitle is-6">@{{ profileData.username }}</p>
                </div>
              </div>
              <p class="subtitle is-6">{{ profileData.email }}</p>
              <div class="content">
                {{ profileData.bio }}
              </div>
              <div class="content">
                <b-field grouped group-multiline>
                  <div class="control">
                    <b-taglist v-if="profileData.parish" attached>
                      <b-tag type="is-dark"
                        ><b-icon pack="bx" icon="bx-map"></b-icon
                      ></b-tag>
                      <b-tag type="is-primary">{{ profileData.parish }}</b-tag>
                    </b-taglist>
                  </div>
                  <div class="control">
                    <b-taglist v-if="profileData.gpa" attached>
                      <b-tag type="is-dark">GPA</b-tag>
                      <b-tag type="is-primary">{{ profileData.gpa }}</b-tag>
                    </b-taglist>
                  </div>
                </b-field>
              </div>
              <div class="content">
                <b-taglist>
                  <b-tag
                    v-for="skill in profileData.skills"
                    :key="skill.id"
                    type="is-primary"
                    >{{ skill.name }}</b-tag
                  >
                </b-taglist>

                <b-button
                  v-if="profileData.username != $auth.user.username"
                  expanded
                  type="is-pink"
                  @click="messageUser()"
                  >Message</b-button
                >
              </div>
            </template>
            <div v-if="loadingProfileCard" class="media">
              <figure class="media-left">
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
      <div
        v-if="$auth.user.username === profileData.username"
        class="column is-9"
      >
        <h1 class="title has-text-centered">Latest Internships Applied For</h1>
        <section v-if="appliedInternships.length === 0" class="hero is-primary">
          <div class="hero-body has-text-centered">
            <h1 class="title">You haven't applied to any Internships.</h1>
            <h2 class="subtitle has-text-centered mt-2">
              <b-button tag="nuxt-link" to="/home" type="is-dark" inverted
                >Apply now</b-button
              >
            </h2>
          </div>
        </section>
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
            :has-applied="internship.has_applied"
          />
        </div>
      </div>
    </div>
    <div v-if="profileData.message" class="hero is-warning is-medium">
      <div class="hero-body">
        <p class="title">{{ profileData.message }}</p>
      </div>
    </div>
    <Chat v-if="$auth.loggedIn" ref="Chat" />
    <b-modal :active="edit" has-modal-card :can-cancel="false">
      <div class="modal-card">
        <header class="modal-card-head">
          <h1 class="modal-card-title">Edit Profile</h1>
          <button type="button" class="delete" @click="closeEditProfileModal" />
        </header>
        <div class="modal-card-body">
          <ValidationObserver ref="editProfileObserver">
            <ValidationProvider
              v-slot="{ errors, valid }"
              rules="required"
              name="Full Name"
              slim
            >
              <b-field
                label="Full Name"
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
              name="Bio"
              slim
            >
              <b-field
                label="Bio"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-input
                  v-model="updatedProfileData.bio"
                  type="textarea"
                  placeholder="Short description"
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
                  field="name"
                  :create-tag="addSkill"
                >
                </b-taginput>
              </b-field>
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors, valid }"
              rules="required"
              name="GPA"
              slim
            >
              <b-field
                label="GPA"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-numberinput
                  v-model.number="updatedProfileData.gpa"
                  expanded
                  controls-position="compact"
                  :step="0.01"
                  :max="4.0"
                ></b-numberinput>
              </b-field>
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors, valid }"
              rules="required"
              name="School Attending"
              slim
            >
              <b-field
                label="School Attending"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-input v-model="updatedProfileData.school"></b-input>
              </b-field>
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors, valid }"
              rules="required"
              name="Major"
              slim
            >
              <b-field
                label="Major"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-input v-model="updatedProfileData.major"></b-input>
              </b-field>
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors, valid }"
              rules="required"
              name="Minor"
              slim
            >
              <b-field
                label="Minor"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-input v-model="updatedProfileData.minor"></b-input>
              </b-field>
            </ValidationProvider>
            <b-field grouped group-multiline expanded>
              <ValidationProvider
                v-slot="{ errors, valid }"
                rules="required"
                name="Parish"
                slim
              >
                <b-field
                  label="Parish"
                  :type="{ 'is-danger': errors[0], 'is-success': valid }"
                  :message="errors"
                  expanded
                >
                  <b-select
                    v-model="updatedProfileData.parish"
                    placeholder="Select your Parish"
                    icon-pack="bx"
                    icon="bx-globe"
                  >
                    <option
                      v-for="parish in parishes"
                      :key="parish.index"
                      :value="parish"
                    >
                      {{ parish }}
                    </option>
                  </b-select>
                </b-field>
              </ValidationProvider>
              <ValidationProvider
                v-slot="{ errors, valid }"
                :rules="{
                  required: true,
                  regex:
                    '^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$',
                }"
                name="Phone Number"
                slim
              >
                <b-field
                  label="Phone Number"
                  :type="{ 'is-danger': errors[0], 'is-success': valid }"
                  :message="errors"
                  expanded
                >
                  <b-input v-model="updatedProfileData.number"></b-input>
                </b-field>
              </ValidationProvider>
            </b-field>
          </ValidationObserver>
        </div>
        <footer class="modal-card-foot">
          <b-button
            label="Cancel"
            icon-pack="bx"
            icon-left="bx-x"
            outlined
            type="is-danger"
            @click="closeEditProfileModal"
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
      chatWith: '',
      count: 3,
      loadingProfileCard: true,
      edit: false,
      updatedProfileData: '',
      parishes: [
        'St. Andrew',
        'Kingston',
        'St. Thomas',
        'Portland',
        'St. Catherine',
        'Clarendon',
        'Mandeville',
        'St. Elizabeth',
        'Hanover',
        'Westmoreland',
        'St. James',
        'Trelawny',
        'St. Ann',
        'St. Mary',
      ],
    }
  },
  computed: {
    ...mapState(['appliedInternships', 'isSavingProfile', 'profileData']),
  },
  created() {
    this.$store.dispatch('getAppliedInternships')
  },
  async mounted() {
    await this.$store.dispatch('getProfile', this.$route.params.slug)
    this.loadingProfileCard = false
  },

  methods: {
    async messageUser() {
      await Talk.ready.then(() => {
        const me = new Talk.User({
          id: this.$auth.user.id,
          name: this.$auth.user.name,
          email: this.$auth.user.email,
          role: this.$auth.user.role,
        })
        const other = new Talk.User({
          id: this.profileData.id,
          name: this.profileData.name,
          email: this.profileData.email,
          role: this.profileData.role,
          photoUrl: `${this.$config.axios.browserBaseURL}/api/images/${this.profileData.profile_picture}`,
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
      this.parishes = this.parishes.sort()
      this.updatedProfileData = clonedeep(this.profileData)
      this.edit = !this.edit
    },
    async saveProfile() {
      const isValid = await this.$refs.editProfileObserver.validate()
      if (isValid) {
        await this.$store.dispatch('saveProfile', this.updatedProfileData)
        this.edit = !this.edit
      }
    },
    closeEditProfileModal() {
      this.edit = !this.edit
      this.$refs.editProfileObserver.reset()
    },
    addSkill(tag) {
      const newTag = { name: tag }
      return newTag
    },
  },
}
</script>
<style scoped>
.is-unclipped {
  overflow: visible;
}
</style>
