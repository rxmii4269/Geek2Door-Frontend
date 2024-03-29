<template>
  <ValidationObserver ref="createJobObserver" v-slot="{ passes }">
    <b-steps v-model="activeStep">
      <b-step-item step="1" label="Part One">
        <ValidationProvider
          v-slot="{ errors, validate, valid }"
          rules="required|mimes:application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          name="Internship Document"
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
                  <p>Drop your Job Order File here or Click to Upload</p>
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
      </b-step-item>
      <b-step-item step="2" label="Confirm Details">
        <div class="is-flex is-justify-content-between">
          <ValidationProvider v-if="activeStep === 1" slim>
            <b-field class="mr-1" label="Accepted Interns">
              <b-numberinput
                v-model="allowedInterns"
                controls-position="compact"
              ></b-numberinput>
            </b-field>
          </ValidationProvider>
          <ValidationProvider
            v-if="activeStep === 1"
            v-slot="{ errors, valid }"
            rules="required|min_value:3|integer|numeric"
            name="Total Weight"
            slim
          >
            <b-field
              class="is-pulled-right"
              label="Total Weight"
              :type="{ 'is-danger': errors[0], 'is-success': valid }"
            >
              <template #message>
                <span v-if="!errors[0]" class="has-text-grey-light">
                  <b-icon size="is-small" icon="information"></b-icon> Enter the
                  weighting metric you use.</span
                >
                <span v-for="(error, index) in errors" v-else :key="index">{{
                  error
                }}</span>
              </template>
              <b-numberinput
                v-model="totalWeight"
                step="1"
                :controls="false"
              ></b-numberinput>
            </b-field>
          </ValidationProvider>
        </div>

        <ValidationProvider
          v-if="activeStep === 1"
          v-slot="{ errors, valid }"
          rules="required"
          slim
        >
          <b-field
            v-if="newInternshipData"
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
            :message="errors"
            label="Title"
          >
            <b-input v-model="job_title"></b-input>
          </b-field>
        </ValidationProvider>
        <ValidationProvider v-if="activeStep === 1" v-slot="{ errors, valid }">
          <b-field
            label="Description"
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
          >
            <b-input v-model="description" type="textarea"></b-input>
          </b-field>
        </ValidationProvider>
        <ValidationProvider v-if="activeStep === 1" v-slot="{ errors, valid }">
          <b-field
            label="Tenure/Duration"
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
          >
            <b-datepicker
              v-model="duration"
              placeholder="Pick a date range..."
              range
              editable
            ></b-datepicker>
          </b-field>
        </ValidationProvider>
        <b-field grouped>
          <ValidationProvider
            v-if="activeStep === 1"
            v-slot="{ errors, valid }"
            rules="required"
            name="Qualifications"
            slim
          >
            <b-field
              label="Qualification"
              :type="{ 'is-danger': errors[0], 'is-success': valid }"
              :message="errors"
              expanded
            >
              <b-input v-model="diploma"></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider
            v-if="activeStep === 1"
            v-slot="{ errors, valid }"
            rules="required"
            slim
          >
            <b-field label="Assign Weight" expanded>
              <b-numberinput
                v-model="qualificationWeight"
                :type="{ 'is-danger': errors[0], 'is-primary': valid }"
                step="0.1"
                controls-position="compact"
                :controls="true"
              ></b-numberinput
            ></b-field>
          </ValidationProvider>
        </b-field>
        <b-field v-if="activeStep === 1" grouped>
          <b-field label="Minimum GPA" expanded>
            <b-numberinput
              v-model.number="gpa"
              min="1.75"
              step="0.1"
              :controls="true"
              controls-position="compact"
              max="4.0"
            ></b-numberinput>
          </b-field>
          <b-field label="Assign Weight" expanded>
            <b-numberinput
              v-model.number="gpaWeight"
              step="0.1"
              controls-position="compact"
              :controls="true"
            ></b-numberinput>
          </b-field>
        </b-field>
        <b-field group-multiline grouped label="Skills">
          <b-field class="mb-3">
            <b-field label="Add more">
              <b-button
                v-if="skills.length > 0"
                icon-right="plus"
                label="Add More"
                type="is-primary"
                @click="add(index)"
              ></b-button>
            </b-field>
            <b-field class="is-pulled-right" label="Overall Skills Weight">
              <b-numberinput
                v-model="skillsWeight"
                step="0.1"
                class="ml-2"
                controls-position="compact"
                :controls="true"
                expanded
              ></b-numberinput>
            </b-field>
          </b-field>
          <b-field
            v-for="(skill, index) in skills"
            :key="`skill-${index}`"
            class="mb-2"
          >
            <p class="control">
              <b-button
                v-show="index || (!index && skills.length > 1)"
                icon-left="delete"
                @click="remove(index)"
              ></b-button>
            </p>
            <b-input
              :value="skills[index]"
              @input="editSkill($event, index)"
            ></b-input>
            <b-field>
              <b-numberinput
                v-if="`skill-${index}`"
                :value="skillsList[index]"
                step="0.1"
                controls-alignment="right"
                controls-position="compact"
                expanded
                @input="editSkillWeight($event, index)"
              ></b-numberinput>
            </b-field>
          </b-field>
        </b-field>
        <ValidationProvider v-if="activeStep === 1">
          <b-field label="Responsibilities">
            <b-input v-model="responsibilities" type="textarea"></b-input>
          </b-field>
        </ValidationProvider>
        <ValidationProvider v-if="activeStep === 1">
          <b-field label="Other">
            <b-input v-model="other" type="textarea"></b-input>
          </b-field>
        </ValidationProvider>
      </b-step-item>
      <template slot="navigation" slot-scope="{ previous, next }">
        <div class="buttons is-centered">
          <b-button :disabled="previous.disabled" @click.prevent="previousStep"
            >Previous</b-button
          >
          <b-button
            :disabled="next.disabled"
            :loading.sync="isSubmittingJob"
            @click.prevent="passes(submitJob)"
            >Next</b-button
          >
        </div>
      </template>
    </b-steps>
    <div v-if="activeStep === 1" class="buttons is-pulled-right">
      <b-button
        type="is-success"
        :loading="isSavingInternship"
        @click="saveInternship"
        >Submit</b-button
      >
    </div>
  </ValidationObserver>
</template>
<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { mapState } from 'vuex'
export default {
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  props: {
    clear: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      jobForm: {
        company_id: this.$auth.user.id,
        profile_picture: this.$auth.user.profile_picture,
        file: null,
      },
    }
  },
  computed: {
    job_title: {
      get() {
        if (this.$store.state.newInternship) {
          return this.$store.state.newInternship.job_title
        } else {
          return ''
        }
      },
      set(newValue) {
        this.$store.commit('SET_JOB_TITLE', newValue)
      },
    },
    diploma: {
      get() {
        if (this.$store.state.newInternship) {
          return this.$store.state.newInternship.diploma
        } else {
          return ''
        }
      },
      set(newValue) {
        this.$store.commit('SET_DIPLOMA', newValue)
      },
    },
    skills: {
      get() {
        if (this.$store.state.newInternship) {
          return this.$store.state.newInternship.skills
        } else {
          return ''
        }
      },
      set(newValue) {
        this.$store.commit('SET_SKILLS', newValue)
      },
    },
    gpa: {
      get() {
        if (this.$store.state.newInternship) {
          return parseFloat(this.$store.state.newInternship.minimum_gpa)
        } else {
          return ''
        }
      },
      set(newValue) {
        this.$store.commit('SET_GPA', newValue)
      },
    },
    responsibilities: {
      get() {
        if (
          this.$store.state.newInternship &&
          typeof this.$store.state.newInternship.responsibilities === 'object'
        ) {
          return this.$store.state.newInternship.responsibilities.join('\n ')
        } else if (
          this.$store.state.newInternship &&
          typeof this.$store.state.newInternship.responsibilities === 'string'
        ) {
          return this.$store.state.newInternship.responsibilities
        } else {
          return ''
        }
      },
      set(newValue) {
        return this.$store.commit('SET_RESPONSIBILITIES', newValue)
      },
    },
    other: {
      get() {
        if (
          this.$store.state.newInternship &&
          typeof this.$store.state.newInternship.qualifications === 'object'
        ) {
          return this.$store.state.newInternship.qualifications.join('\n ')
        } else if (
          this.$store.state.newInternship &&
          typeof this.$store.state.newInternship.qualifications === 'string'
        ) {
          return this.$store.state.newInternship.qualifications
        } else {
          return ''
        }
      },
      set(newValue) {
        return this.$store.commit('SET_OTHER', newValue)
      },
    },
    newInternshipData: {
      get() {
        return this.$store.state.newInternship
      },
      set(newValue) {
        this.$store.commit('setFields', newValue)
      },
    },
    activeStep: {
      get() {
        return this.$store.state.activeStep
      },
      set() {
        this.$store.commit('DECREMENT_STEP')
      },
    },
    totalWeight: {
      get() {
        return this.$store.state.totalWeight
      },
      set(newValue) {
        return this.$store.dispatch('recalculateTotalWeight', newValue)
      },
    },
    allowedInterns: {
      get() {
        return this.$store.state.allowedInterns
      },
      set(newValue) {
        return this.$store.commit('SET_ALLOWED_INTERNS', newValue)
      },
    },
    weights: {
      get() {
        return this.$store.state.weights
      },
    },
    qualificationWeight: {
      get() {
        if (this.$store.state.weights) {
          return this.$store.state.weights.qualificationWeight
        } else {
          return 0
        }
      },
      set(newValue) {
        return this.$store.dispatch('calculateQualWeight', newValue)
      },
    },
    gpaWeight: {
      get() {
        if (this.$store.state.weights) {
          return this.$store.state.weights.gpaWeight
        } else {
          return 0
        }
      },
      set(newValue) {
        return this.$store.dispatch('calculateGPAWeight', newValue)
      },
    },
    skillsWeight: {
      get() {
        if (this.$store.state.weights) {
          return this.$store.state.weights.skillsWeight
        } else {
          return 0
        }
      },
      set(newValue) {
        return this.$store.dispatch('calculateSkillsWeight', newValue)
      },
    },
    duration: {
      get() {
        if (this.$store.state.newInternship) {
          return this.$store.state.newInternship.duration
        } else {
          return ''
        }
      },
      set(newValue) {
        return this.$store.commit('SET_DURATION', newValue)
      },
    },
    skillsList: {
      get() {
        if (this.$store.state.newInternship) {
          return this.$store.state.skillsList
        } else {
          return ''
        }
      },
      set(newValue) {},
    },
    description: {
      get() {
        if (this.$store.state.newInternship) {
          return this.$store.state.newInternship.description || ''
        } else {
          return ''
        }
      },
      set(newValue) {
        return this.$store.commit('SET_DESCRIPTION', newValue)
      },
    },
    ...mapState(['isSubmittingJob', 'activeStep', 'isSavingInternship']),
  },
  methods: {
    add(index) {
      this.$store.dispatch('addSkill')
    },
    remove(index) {
      this.$store.dispatch('deleteSkill', index)
    },
    previousStep() {
      this.$store.commit('DECREMENT_STEP')
    },
    calculateWeights(event) {},
    async submitJob() {
      const isValid = await this.$refs.createJobObserver.validate()
      if (isValid) {
        const formData = new FormData()
        const keys = Object.keys(this.jobForm)

        keys.forEach((key, index) => {
          formData.append(key, this.jobForm[key])
        })

        await this.$store.dispatch('submitInternship', formData)
      }
    },
    async saveInternship() {
      const isValid = await this.$refs.createJobObserver.validate()
      if (isValid) {
        await this.$store.dispatch('saveInternship')
        this.$emit('closeJobModal', true)
        this.$buefy.notification.open({
          duration: 3000,
          type: 'is-success',
          message: 'Post created successfully',
          hasIcon: true,
          position: 'is-top-right',
        })
        this.$store.commit('DECREMENT_STEP')
        this.deleteDropFile()
        this.$store.dispatch('getInternships', this.$auth.user.id)
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
    editSkillWeight(event, index) {
      this.$store.dispatch('editSkillWeight', { event, index })
    },
    editSkill(skill, index) {
      this.$store.dispatch('editSkill', { skill, index })
    },
  },
}
</script>
