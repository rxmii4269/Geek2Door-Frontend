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
            <div
              v-if="profileData.company_name == $auth.user.name"
              class="test is-clearfix"
            >
              <b-tooltip
                label="Edit Profile"
                position="is-right"
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
                    :src="`/api/images/${profileData.profile_picture}`"
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
                v-if="profileData.company_name != $auth.user.name"
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
            <p class="control">
              <b-field label="Street" label-position="on-border">
                <b-input
                  v-model.trim="updatedProfileData.street"
                  lazy
                  expanded
                ></b-input>
              </b-field>
            </p>
            <p class="control">
              <b-field label="Parish" label-position="on-border">
                <b-input
                  v-model.trim="updatedProfileData.parish"
                  lazy
                  expanded
                ></b-input>
              </b-field>
            </p>
            <p class="control">
              <b-field label="City" label-position="on-border">
                <b-input
                  v-model.trim="updatedProfileData.city"
                  lazy
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
    <b-modal
      v-model="nojobs"
      active
      trap-focus
      has-modal-card
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-modal
    >
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Create a Job</p>
          <button type="button" class="delete" @click="nojobs = !nojobs" />
        </header>
        <section class="modal-card-body">
          <b-field label="Title">
            <b-input></b-input>
          </b-field>
          <b-field label="Position">
            <b-input
              placeholder="eg. Web Developer, Backend Developer, Database Administrator"
            ></b-input>
          </b-field>
          <b-field grouped group-multiline>
            <b-field label="GPA Requirement">
              <b-numberinput
                v-model="jobForm.GPA"
                expanded
                step="0.01"
                min="2.5"
                max="4.0"
              ></b-numberinput>
            </b-field>
            <b-field label="Qualifications">
              <b-select v-model="jobForm.Qualifications" expanded>
                <option
                  v-for="degree in degrees"
                  :key="degree.id"
                  :value="degree.name"
                >
                  {{ degree.name }}
                </option>
              </b-select>
            </b-field>
          </b-field>
          <b-field
            v-for="(input, k) in inputs"
            :key="k"
            label="Skills & Skill Level"
          >
            <b-autocomplete
              :data="skillsData"
              field="title"
              :loading="isFetching"
              @typing="getAsyncData"
              @select="(option) => selected.push(option)"
            ></b-autocomplete>
            <b-select placeholder="eg. Beginner" @select="addToSkills()">
              <option
                v-for="experience in experienceLevel"
                :key="experience.index"
                :value="experience"
              >
                {{ experience }}
              </option>
            </b-select>
            <span>
              <b-button
                v-show="k || (!k && inputs.length > 1)"
                icon-pack="bx"
                icon-right="bxs-minus-circle"
                class="ml-2"
                @click="remove(k)"
              ></b-button>
              <b-button
                v-show="k == inputs.length - 1"
                icon-pack="bx"
                icon-right="bxs-plus-circle"
                class="ml-2"
                @click="add(k)"
              ></b-button>
            </span>
          </b-field>
          <b-field></b-field>
          <b-field label="Description">
            <b-input type="textarea" maxlength="350"></b-input>
          </b-field>
        </section>
      </div>
    </b-modal>
  </div>
</template>
<script>
import Talk from 'talkjs'
import debounce from 'lodash.debounce'
export default {
  data() {
    return {
      chatWith: '',
      edit: false,
      nojobs: true,
      jobForm: {
        GPA: 2.5,
        Qualifications: '',
        skills: [],
      },
      degrees: [
        {
          id: 1,
          name: 'BSc. Computer Science',
        },
        {
          id: 2,
          name: 'BSc. Information Technology',
        },
        {
          id: 3,
          name: 'BSc. Software Engineering',
        },
        {
          id: 4,
          name: 'BSc. Computer Studies',
        },
        {
          id: 5,
          name: 'BSc. Information Systems',
        },
      ],
      experienceLevel: ['Beginner', 'Intermediate', 'Expert'],
      option: '',
      selected: [],
      skillsData: [],
      isFetching: false,
      inputs: [
        {
          name: '',
        },
      ],
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
          role: this.$auth.user.role,
        })
        const other = new Talk.User({
          id: this.profileData.id,
          name: this.profileData.company_name,
          email: this.profileData.email,
          role: 'company',
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
  },
}
</script>
<style scoped>
.is-unclipped {
  overflow: visible;
}
</style>
