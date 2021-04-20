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
                v-if="profileData.company_name == $auth.user.name"
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
              <div class="media mt-5">
                <!-- <div class="media-left">
                  <figure v-if="profileData" class="image is-48x48">
                    <img
                      :src="`${$config.axios.browserBaseURL}/api/images/${profileData.profile_picture}`"
                      alt="Profile Picture"
                    />
                  </figure>
                </div> -->
                <div class="media-content mt-2 is-unclipped">
                  <p class="title is-4">{{ profileData.company_name }}</p>
                </div>
              </div>
              <div class="content">
                <p class="subtitle is-6">{{ profileData.email }}</p>
              </div>
              <div class="content">
                <p>{{ profileData.company_desc }}</p>
                <b-button
                  v-if="profileData.company_name != $auth.user.name"
                  expanded
                  type="is-pink"
                  @click="messageUser()"
                  >Message</b-button
                >
              </div>
            </template>
            <b-skeleton
              size="is-large"
              :active="loadingProfileCard"
              :count="count"
            ></b-skeleton>
          </div>
        </div>
      </div>
      <div class="column is-9">
        <b-button
          v-if="$auth.user.id === profileData.id"
          type="is-primary"
          outlined
          @click="nojobs = true"
          >Add Internship</b-button
        >
        <h1 class="title has-text-centered">Internships</h1>
        <b-tabs>
          <b-tab-item label="Recent" icon="history">
            <div v-if="unarchivedJobs" class="columns is-multiline">
              <InternshipPost
                v-for="internship in unarchivedJobs"
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
          </b-tab-item>
          <b-tab-item
            v-if="$auth.user.id === profileData.id"
            label="Archived"
            icon="package-down"
          >
            <div v-if="archivedJobs.length != 0" class="columns is-multiline">
              <InternshipPost
                v-for="internship in archivedJobs"
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
            <section v-else class="hero is-primary">
              <div class="hero-body has-text-centered">
                <p class="title">No Archived Jobs Available</p>
              </div>
            </section>
          </b-tab-item>
        </b-tabs>
      </div>
    </div>
    <div v-if="profileData.message" class="hero is-warning is-medium">
      <div class="hero-body">
        <p class="title">{{ profileData.message }}</p>
      </div>
    </div>
    <Chat v-if="$auth.loggedIn" ref="Chat" />
    <b-modal v-model="edit" has-modal-card :can-cancel="false">
      <div class="modal-card">
        <header class="modal-card-head">
          <h1 class="modal-card-title">Edit Profile</h1>
          <button type="button" class="delete" @click="cancel" />
        </header>
        <div class="modal-card-body">
          <b-field label="Name" label-position="on-border">
            <b-input
              v-model.trim="updatedProfileData.company_name"
              lazy
            ></b-input>
          </b-field>
          <b-field label="Email" label-position="on-border">
            <b-input
              v-model.trim="updatedProfileData.email"
              type="email"
              lazy
            ></b-input>
          </b-field>
          <b-field label="Description" label-position="on-border" class="mt-3">
            <b-input
              v-model.trim="updatedProfileData.company_desc"
              maxlength="200"
              type="textarea"
              lazy
            ></b-input>
          </b-field>
          <h1 class="has-text-centered is-size-5">Address Information</h1>
          <b-field grouped group-multiline class="mt-3">
            <b-field label="Street" label-position="on-border" expanded>
              <b-input
                v-model.trim="updatedProfileData.street"
                lazy
                expanded
              ></b-input>
            </b-field>
            <b-field label="Parish" label-position="on-border" expanded>
              <b-select
                v-model.trim="updatedProfileData.parish"
                placeholder="Select your Parish"
                icon-pack="bx"
                icon="bx-globe"
                expanded
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
            <b-field
              label="City"
              label-position="on-border"
              custom-class="mt-3"
              expanded
            >
              <b-input
                v-model.trim="updatedProfileData.city"
                custom-class="mt-3"
                lazy
              ></b-input>
            </b-field>
          </b-field>
        </div>
        <div class="modal-card-foot">
          <div class="buttons">
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
    <b-modal
      :active.sync="nojobs"
      trap-focus
      has-modal-card
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-modal
      :can-cancel="false"
      :width="1366"
    >
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Create an Internship</p>
          <button type="button" class="delete" @click="closeJobModal" />
        </header>
        <section class="modal-card-body">
          <InternshipConfirmForm />
        </section>
        <!-- <footer class="modal-card-foot">
          <b-button
            label="Close"
            icon-pack="bx"
            icon-left="bx-x"
            type="is-danger is-outlined"
            @click="closeJobModal"
          ></b-button>
          <b-button
            label="Save"
            type="is-primary"
            icon-pack="bx"
            icon-left="bx-check"
            :loading.sync="isSubmittingJob"
            @click="submitJob"
          ></b-button>
        </footer> -->
      </div>
    </b-modal>
  </div>
</template>
<script>
import Talk from 'talkjs'
import debounce from 'lodash.debounce'
import { mapState, mapGetters } from 'vuex'
export default {
  data() {
    return {
      chatWith: '',
      edit: false,
      nojobs: false,
      jobForm: {
        company_id: '',
        profile_picture: '',
        file: null,
      },
      degrees: [
        'BSc. Computer Science',
        'BSc. Information Technology',
        'BSc. Software Engineering',
        'BSc. Computer Studies',
        'BSc. Information Systems',
      ],
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
      option: '',
      skillsData: [],
      isFetching: false,
      loadingProfileCard: true,
      degreeName: '',
      count: 3,
      minDate: '',
      inputs: [],
    }
  },
  computed: {
    filteredDegrees() {
      return this.degrees.filter((option) => {
        return option
          .toString()
          .toLowerCase()
          .includes(this.degreeName.toLowerCase())
      })
    },
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
        this.$store.commit('SET_PROFILE_DATA', value)
      },
    },
    // qualifications: {
    //   get() {
    //     if (this.$store.state.newInternship) {
    //       return this.$store.state.newInternship.qualifications.join('\n')
    //     } else {
    //       return ''
    //     }
    //   },
    //   set(newValue) {},
    // },
    ...mapState(['internships', 'isSubmittingJob']),
    ...mapGetters(['unarchivedJobs', 'archivedJobs', 'qualifications2']),
  },
  created() {},

  async mounted() {
    await this.$store.dispatch('getProfile', this.$route.params.slug)
    this.loadingProfileCard = false
    await this.$store.dispatch('getInternships', this.profileData.id)
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
          name: this.profileData.company_name,
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
    async editProfile() {
      this.parishes = this.parishes.sort()
      await this.$store.dispatch('editProfile', this.profileData)
      this.edit = !this.edit
    },
    cancel() {
      this.$store.dispatch('getProfile', this.$route.params.slug)
      this.edit = !this.edit
    },
    saveProfile() {
      this.$store.dispatch('saveProfile', this.updatedProfileData)
      this.edit = !this.edit
      this.loadingProfileCard = false
    },
    getAsyncData: debounce(function (name) {
      if (!name.length) {
        this.data = []
        return
      }
      this.isFetching = true
      this.$axios.setHeader('apikey', '0Sugakz7qs9ge2tBcL5tIWWv6iOwT346')
      this.$axios
        .get(`/api2/?q=${name}`)
        .then(({ data }) => {
          this.skillsData = []
          data.forEach((item) => this.skillsData.push(item))
        })
        .catch((error) => {
          this.skillsData = []
          throw error
        })
        .finally(() => {
          this.isFetching = false
        })
    }),
    addToSkills(option) {
      const skill = {
        name: option,
        experience: 'Beginner',
      }
      this.jobForm.skills.push(skill)
    },
    showAddDegrees() {
      this.$buefy.dialog.prompt({
        message: `Qualifications`,
        inputAttrs: {
          placeholder: 'eg. Web Design',
          maxlength: 50,
          value: this.degreeName,
        },
        confrimText: 'Add',
        onConfirm: (value) => {
          this.degrees.push(value)
          this.$refs.autocomplete.setSelected(value)
        },
      })
    },
    closeJobModal() {
      Object.keys(this.jobForm).forEach((key, index) => {
        if (typeof this.jobForm[key] === 'object') {
          this.jobForm[key] = []
        } else if (typeof this.jobForm[key] === 'number') {
          this.jobForm[key] = 2
        } else {
          this.jobForm[key] = ''
        }
      })
      this.degreeName = ''
      this.nojobs = !this.nojobs
      // this.$refs.createJobObserver.reset()
    },
  },
}
</script>
<style scoped>
.is-unclipped {
  overflow: visible;
}
</style>
