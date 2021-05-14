<template>
  <div class="container">
    <div v-if="!profileData.message" class="columns is-desktop">
      <div class="column is-one-third-desktop">
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
              <div
                v-if="$auth.user.name === $route.params.slug"
                class="is-overlay"
              >
                <b-upload
                  v-model="profile_Picture"
                  class="is-clickable w-100 h-100"
                  :multiple="true"
                  @input="editProfilePicture($event)"
                >
                  <span class="file-cta">
                    <b-icon
                      class="file-icon mx-auto is-size-1"
                      pack="bx"
                      icon="bx-edit"
                    >
                      Edit Profile
                    </b-icon>
                  </span>
                </b-upload>
              </div>
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
      <div class="column">
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
              <client-only>
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
                  :company-name="internship.company_name"
                  :has-applied="internship.has_applied"
                  :applied="internship.applied_count"
                  :views="internship.view_count"
                />
              </client-only>
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
                :company-name="internship.company_name"
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
          <InternshipConfirmForm
            :clear="clear"
            @closeJobModal="closeJobModal"
          />
        </section>
      </div>
    </b-modal>
    <b-modal v-model="is_PP_Active" has-modal-card>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Crop Image</p>
        </header>
        <section class="modal-card-body">
          <VueCropper
            v-if="profile_Picture"
            ref="cropper"
            :guides="true"
            :view-mode="2"
            drag-mode="crop"
            :auto-crop-area="0.5"
            :background="true"
            :min-container-width="250"
            :min-container-height="180"
            :img-style="{ width: '400px', height: '300px' }"
            :src="cropped_img"
          />
        </section>
        <div class="modal-card-foot is-justify-content-flex-end">
          <div class="buttons">
            <b-button type="is-danger is-outlined card-footer-item"
              >Cancel</b-button
            >
            <b-button
              type="is-primary card-footer-item"
              :loading="isSavingImage"
              @click="saveCroppedImage"
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
import { mapState, mapGetters } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
export default {
  data() {
    return {
      chatWith: '',
      edit: false,
      nojobs: false,
      clear: false,
      updatedProfileData: '',
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
      is_PP_Active: false,
      profile_Picture: [],
      cropped_img: null,
      isSavingImage: false,
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
    ...mapState(['internships', 'isSubmittingJob']),
    ...mapGetters(['unarchivedJobs', 'archivedJobs']),
  },
  created() {},

  async mounted() {
    await this.$store.dispatch('getProfile', this.$route.params.slug)
    this.loadingProfileCard = false
    if (this.profileData) {
      this.$store.dispatch('getInternships', this.profileData.id)
    }
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
    editProfile() {
      this.parishes = this.parishes.sort()
      this.updatedProfileData = cloneDeep(this.profileData)
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
      this.degreeName = ''
      this.nojobs = !this.nojobs
      this.$store.commit('DECREMENT_STEP')
      this.clear = true
      // this.$refs.createJobObserver.reset()
    },
    editProfilePicture(event) {
      const self = this
      this.profile_Picture = event[0]
      this.$nextTick(() => {
        const reader = new FileReader()
        this.is_PP_Active = true
        reader.onload = (event) => {
          self.cropped_img = event.target.result
          this.$refs.cropper.replace(this.cropped_img)
        }
        reader.readAsDataURL(event[0])
        this.is_PP_Active = true
      })
    },
    async saveCroppedImage() {
      const val = this.$refs.cropper.getCroppedCanvas().toDataURL()
      const formData = new FormData()
      formData.set('profile_picture', val)
      this.isSavingImage = true
      await this.$axios
        .post(
          `/api/users/company/${this.$auth.user.id}/profile_picture`,
          formData
        )
        .then((response) => {
          this.$buefy.notification.open({
            type: 'is-success',
            hasIcon: true,
            position: 'is-top-right',
            message: response.data,
          })
          this.$store.dispatch('getProfile', this.$route.params.slug)
          this.$store.dispatch('getInternships', this.profileData.id)
          this.$auth.fetchUser()
          this.isSavingImage = false
          this.is_PP_Active = false
        })
    },
  },
}
</script>
<style scoped>
.is-unclipped {
  overflow: visible;
}
.image:hover .is-overlay {
  opacity: 0.5;
}
.image:hover .file-cta {
  opacity: 0.5;
  background-color: #4a4a4a;
  color: white;
}
.file-cta {
  transition: 0.3s ease-in-out;
}
.is-overlay {
  height: 100%;
  width: 100%;
  opacity: 0;
  transition: 0.3s ease-in-out;
}
.w-100 {
  width: 100%;
}
.h-100 {
  height: 100%;
}
.upload > .file-cta {
  width: 100%;
  flex-grow: 1;
  height: 100%;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
</style>
