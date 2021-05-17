<template>
  <div class="container">
    <div v-if="!profileData.message" class="columns">
      <div class="column is-one-third-desktop">
        <div class="card is-unclipped">
          <div class="columns">
            <div class="card-image column pt-0">
              <figure
                v-if="profileData && !loadingProfileCard"
                class="image is-square"
              >
                <img
                  :src="`${$config.axios.browserBaseURL}/api/images/${profileData.profile_picture}`"
                  alt="Profile Picture"
                />
                <div
                  v-if="$auth.user.username === $route.params.slug"
                  class="is-overlay"
                  title="Edit Profile"
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
              <b-skeleton
                height="80px"
                :active="loadingProfileCard"
              ></b-skeleton>
            </div>
          </div>

          <div class="card-content pt-2">
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
                  <p class="subtitle is-6 mb-2">@{{ profileData.username }}</p>
                  <p class="subtitle is-6">{{ profileData.email }}</p>
                </div>
              </div>
              <div class="content">
                <b-field label="Status">
                  <b-switch
                    v-model="is_active"
                    type="is-success"
                    passive-type="is-danger"
                    name="Available"
                    :disabled="$auth.user.username !== profileData.username"
                    >{{ status }}</b-switch
                  >
                </b-field>
                <div class="buttons">
                  <b-button
                    v-if="$auth.user.username === profileData.username"
                    size="is-small"
                    type="is-primary is-outlined"
                    expanded
                    @click="openResumeUpload"
                    >Upload Resume</b-button
                  >
                  <b-button
                    v-if="profileData.resume"
                    size="is-small"
                    type="is-primary is-outlined"
                    expanded
                    @click="toggleModal"
                    >View Most Recent Resume</b-button
                  >
                </div>
              </div>

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
      <div v-if="$auth.user.username === profileData.username" class="column">
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
            :company-name="internship.company_name"
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
    <b-modal v-model="uploadModalActive" has-modal-card>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Upload Resume</p>
        </header>
        <section class="modal-card-body">
          <ValidationObserver ref="resumeUpload">
            <ValidationProvider
              v-slot="{ errors, valid, validate }"
              rules="required|mimes:application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              name="Resume"
              slim
            >
              <b-field
                class="file is-flex-direction-column is-align-items-center"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-upload
                  v-model="uploadedResume"
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
                      <p>Drop your resume here or click to upload</p>
                    </div>
                  </section>
                </b-upload>
              </b-field>
              <b-tag
                v-if="uploadedResume"
                type="is-primary"
                closable
                aria-close-label="Delete uploaded Resume"
                @close="deleteDropFile"
              >
                {{ uploadedResume.name }}
              </b-tag>
            </ValidationProvider>
          </ValidationObserver>
        </section>
        <div class="modal-card-foot is-justify-content-flex-end">
          <div class="buttons">
            <b-button
              type="is-danger is-outlined card-footer-item"
              @click="closeResumeUpload"
              >Cancel</b-button
            >
            <b-button
              type="is-primary card-footer-item"
              :loading="isUploadingResume"
              @click="uploadResume"
              >Save</b-button
            >
          </div>
        </div>
      </div>
    </b-modal>
    <DocumentModal
      v-if="profileData.resume"
      :active="modalIsActive"
      :filename="profileData.resume"
      @update:active="toggleModal($event)"
    />
  </div>
</template>
<script>
import Talk from 'talkjs'
import { mapState } from 'vuex'
import clonedeep from 'lodash/cloneDeep'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { sha256 } from 'js-sha256'

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
      status: this.is_active ? 'Available' : 'Unavailable',
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
      is_PP_Active: false,
      profile_Picture: [],
      cropped_img: null,
      isSavingImage: false,
      uploadModalActive: false,
      uploadedResume: null,
      isUploadingResume: false,
      modalIsActive: false,
    }
  },
  computed: {
    ...mapState(['appliedInternships', 'isSavingProfile', 'profileData']),
    is_active: {
      get() {
        return this.$store.state.profileData.is_active
      },
      set(val) {
        return this.$store.dispatch('toggleActive', val)
      },
    },
  },
  watch: {
    is_active(val) {
      if (val) {
        this.status = 'Available'
      } else {
        this.status = 'Unavailable'
      }
    },
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
            appId: process.env.APP_ID,
            me,
            signature: sha256
              .hmac(process.env.SECRET_KEY, this.$auth.user.id.toString())
              .toString(),
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
          `/api/users/students/${this.$auth.user.id}/profile_picture`,
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
          this.$auth.fetchUser()
          this.isSavingImage = false
          this.is_PP_Active = false
        })
    },
    toggleModal(value) {
      this.modalIsActive = !this.modalIsActive
    },
    openResumeUpload() {
      this.uploadModalActive = true
    },
    closeResumeUpload() {
      this.uploadModalActive = false
      this.uploadedResume = null
    },
    async uploadResume() {
      const isValid = this.$refs.resumeUpload.validate()
      if (isValid) {
        this.isUploadingResume = true
        const formData = new FormData()
        formData.append('resume', this.uploadedResume)
        await this.$axios
          .$post(
            `/api/users/students/${this.profileData.id}/resume`,
            formData,
            {
              headers: { 'Content-Type': 'multipart/form-data' },
            }
          )
          .then((response) => {
            this.$buefy.notification.open({
              hasIcon: true,
              position: 'is-top-right',
              message: response.data,
              type: 'is-success',
            })
            this.uploadModalActive = false
          })
          .catch((error) => {
            this.$buefy.notification.open({
              hasIcon: true,
              position: 'is-top-right',
              message: error,
              type: 'is-danger',
            })
          })
        this.isUploadingResume = false
      }
    },
    deleteDropFile() {
      this.uploadedResume = null
    },
  },
}
</script>
<style scoped>
.is-unclipped {
  overflow: visible;
}
.mt-auto {
  margin-top: auto;
}

@media screen and (max-width: 375px) {
  .is-flex-direction-column-mobile {
    flex-direction: column;
  }
}
.image:hover .is-overlay {
  opacity: 0.5;
}
.image:hover .file-cta {
  opacity: 1;
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
.switch[disabled] {
  opacity: 1;
}
</style>
