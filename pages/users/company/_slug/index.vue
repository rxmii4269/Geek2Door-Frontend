<template>
  <div class="container">
    <div v-if="!profileData.message" class="columns is-8">
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
                <div class="media-left">
                  <figure v-if="profileData" class="image is-48x48">
                    <img
                      :src="`${$config.axios.browserBaseURL}/api/images/${profileData.profile_picture}`"
                      alt="Profile Picture"
                    />
                  </figure>
                </div>
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
          type="is-pink"
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
    <b-modal v-model="edit" has-modal-card>
      <div class="modal-card">
        <div class="modal-card-head">
          <h1>Edit Profile</h1>
        </div>
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
              <b-input
                v-model.trim="updatedProfileData.parish"
                lazy
                expanded
              ></b-input>
            </b-field>
            <b-field label="City" label-position="on-border" expanded>
              <b-input v-model.trim="updatedProfileData.city" lazy></b-input>
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
    >
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Create an Internship</p>
          <button type="button" class="delete" @click="closeJobModal" />
        </header>
        <section class="modal-card-body">
          <ValidationObserver ref="createJobObserver">
            <ValidationProvider
              v-slot="{ errors, valid }"
              rules="required"
              name="Internship Title"
              slim
            >
              <b-field
                label="Title"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-input v-model="jobForm.position"></b-input>
              </b-field>
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors, validate, valid }"
              rules="required"
              slim
            >
              <b-field
                class="file"
                label=""
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-upload
                  v-model="jobForm.file"
                  drag-drop
                  expanded
                  accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  required
                  @change="validate"
                >
                  <section class="section">
                    <div class="content has-text-centered">
                      <p>
                        <b-icon icon="upload" size="is-large"></b-icon>
                      </p>
                      <p>Drop your internship file here or click to upload</p>
                    </div>
                  </section>
                </b-upload>
              </b-field>
              <b-tag
                v-if="jobForm.file"
                type="is-primary"
                closable
                aria-close-label="Delete file upload"
                @close="deleteDropFile"
              >
                {{ jobForm.file.name }}
              </b-tag>
            </ValidationProvider>
            <!-- <b-field grouped group-multiline>
              <ValidationProvider
                v-slot="{ errors, valid }"
                rules="required"
                name="GPA"
                slim
              >
                <b-field
                  label="Minimum GPA"
                  :type="{ 'is-danger': errors[0], 'is-success': valid }"
                  :message="errors"
                  expanded
                >
                  <b-input
                    v-model.number="jobForm.GPA"
                    type="number"
                    min="1.75"
                    step="0.01"
                    max="4.0"
                    expanded
                    lazy
                  ></b-input>
                </b-field>
              </ValidationProvider>
              <ValidationProvider
                v-slot="{ errors, valid }"
                rules="required"
                name="Qualifications"
                slim
              >
                <b-field
                  label="Qualifications"
                  :type="{ 'is-danger': errors[0], 'is-success': valid }"
                  :message="errors"
                  expanded
                >
                  <b-autocomplete
                    ref="autocomplete"
                    v-model="degreeName"
                    open-on-focus
                    clearable
                    :data="filteredDegrees"
                    expanded
                    @select="(option) => (jobForm.qualifications = option)"
                  >
                    <template #footer>
                      <a @click="showAddDegrees">
                        <span>Add new...</span>
                      </a>
                    </template>
                    <template #empty>No results for {{ degreeName }}</template>
                  </b-autocomplete>
                </b-field>
              </ValidationProvider>
            </b-field>
            <b-field label="Location">
              <b-input v-model="jobForm.location"></b-input>
            </b-field>
            <ValidationProvider
              v-slot="{ errors, valid }"
              slim
              rules="required"
              name="Tenure/Duration"
            >
              <b-field
                label="Tenure/Duration"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
                expanded
              >
                <b-datepicker
                  v-model="jobForm.duration"
                  editable
                  range
                  icon-pack="bx"
                  icon="bxs-calendar-event"
                  icon-next="bxs-right-arrow"
                  icon-prev="bxs-left-arrow"
                ></b-datepicker>
              </b-field>
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors, valid }"
              slim
              rules="required"
              name="Skills"
            >
              <b-field
                label="Skills"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
              >
                <template #message>
                  <span
                    >Enter each skill in the format <b>Skill name</b> -
                    <b>weight</b> separating each skill weight pair with a
                    comma. e.g. PHP-5, Javascript-2.</span
                  >
                </template>
                <b-input
                  v-model.trim="jobForm.skills"
                  type="textarea"
                ></b-input>
              </b-field>
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors, valid }"
              slim
              rules="required"
              name="Description"
            >
              <b-field
                label="Description"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-input
                  v-model="jobForm.description"
                  type="textarea"
                  maxlength="350"
                ></b-input>
              </b-field>
            </ValidationProvider> -->
          </ValidationObserver>
        </section>
        <footer class="modal-card-foot">
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
        </footer>
      </div>
    </b-modal>
  </div>
</template>
<script>
import Talk from 'talkjs'
import debounce from 'lodash.debounce'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { mapState, mapGetters } from 'vuex'
export default {
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      chatWith: '',
      edit: false,
      nojobs: false,
      jobForm: {
        position: '',
        GPA: 2.0,
        qualifications: '',
        skills: '',
        location: '',
        description: '',
        duration: [],
        file: null,
      },
      degrees: [
        'BSc. Computer Science',
        'BSc. Information Technology',
        'BSc. Software Engineering',
        'BSc. Computer Studies',
        'BSc. Information Systems',
      ],
      option: '',
      skillsData: [],
      isFetching: false,
      loadingProfileCard: true,
      degreeName: '',
      count: 3,
      minDate: '',
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
    ...mapState(['internships', 'isSubmittingJob']),
    ...mapGetters(['unarchivedJobs', 'archivedJobs']),
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
    add(index) {
      this.inputs.push({ name: '' })
    },
    remove(index) {
      this.inputs.splice(index, 1)
    },
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
    async submitJob() {
      const isValid = await this.$refs.createJobObserver.validate()
      if (isValid) {
        this.jobForm.company_id = this.profileData.id
        this.jobForm.profile_picture = this.profileData.profile_picture
        const formData = new FormData()
        const keys = Object.keys(this.jobForm)

        keys.forEach((key, index) => {
          formData.append(key, this.jobForm[key])
        })

        await this.$store.dispatch('submitInternship', formData)
        this.closeJobModal()
        this.deleteDropFile()
      }
    },
    deleteDropFile() {
      this.jobForm.file = null
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
      this.deleteDropFile()
      this.nojobs = !this.nojobs
      this.$refs.createJobObserver.reset()
    },
  },
}
</script>
<style scoped>
.is-unclipped {
  overflow: visible;
}
</style>
