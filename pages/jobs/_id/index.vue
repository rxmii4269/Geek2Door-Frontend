<template>
  <section>
    <div v-if="internshipPageInfo" class="columns is-multiline">
      <div class="column is-one-third">
        <div class="card">
          <header class="card-header is-flex-direction-column">
            <p class="card-header-title pb-1">
              {{ internshipPageInfo.position }}
            </p>
            <p class="is-size-7 has-text-weight-medium card-header-title pt-0">
              by:
              <nuxt-link
                class="ml-1"
                :to="'/company/' + internshipPageInfo.company_name"
                >{{ internshipPageInfo.company_name }}</nuxt-link
              >
            </p>
          </header>
          <div class="card-content">
            <div class="content">
              <div
                v-if="internshipPageInfo.company_name == $auth.user.name"
                class="is-clearfix"
              >
                <b-button
                  class="is-pulled-right"
                  type="is-info is-light"
                  size="is-small"
                  rounded
                  @click="toggleModal"
                  >View Uploaded File</b-button
                >
              </div>
              <p>{{ internshipPageInfo.description }}</p>
              <div class="is-flex is-flex-direction-row">
                <span class="is-size-6"> {{ startDate }}</span>
                <span class="mx-2">-</span>
                <span class="is-size-6"> {{ endDate }}</span>
              </div>
              <b-field label="Skills">
                <b-taglist>
                  <b-tag
                    v-for="skill in internshipPageInfo.skills"
                    :key="skill.id"
                    type="is-primary"
                    >{{ skill.name }}</b-tag
                  >
                </b-taglist>
              </b-field>
              <b-field>
                <b-taglist v-if="internshipPageInfo.gpa" attached>
                  <b-tag type="is-primary">GPA</b-tag>
                  <b-tag type="is-black">{{ internshipPageInfo.gpa }}</b-tag>
                </b-taglist>
              </b-field>
            </div>
          </div>
          <div
            v-if="internshipPageInfo.company_name == $auth.user.name"
            class="card-footer"
          >
            <a
              role="button"
              class="card-footer-item has-background-dark has-text-warning"
              @click="confirmArchivePost"
              >Archive</a
            >
            <a
              role="button"
              class="card-footer-item has-background-primary has-text-white"
              @click="editPost"
              >Edit</a
            >
          </div>
        </div>
      </div>
      <div class="column">
        <CompanyJobPage
          v-if="$auth.user.name === internshipPageInfo.company_name"
          :applied="internshipPageInfo.applied"
        />
      </div>
    </div>
    <b-modal
      :active="editingPost"
      trap-focus
      has-modal-card
      destroy-on-hide
      :can-cancel="false"
      aria-role="dialog"
      aria-modal
    >
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Edit Internship</p>
          <button type="button" class="delete" @click="closeJobModal" />
        </header>
        <section class="modal-card-body">
          <ValidationObserver ref="updateJobObserver">
            <ValidationProvider
              v-slot="{ errors, valid }"
              class="is-clearfix"
              rules="required|min_value:3"
              name="Total Weight"
            >
              <b-field
                class="is-pulled-right"
                label="Total Weight"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
              >
                <template #message>
                  <span v-if="!errors[0]" class="has-text-grey-light">
                    <b-icon size="is-small" icon="information"></b-icon> Enter
                    the weighting metric you use.</span
                  >
                  <span v-for="(error, index) in errors" v-else :key="index">{{
                    error
                  }}</span>
                </template>
                <b-numberinput
                  v-model.number="jobForm.weights.total_weight"
                  step="0.01"
                  :controls="true"
                  @input="divideTotalWeight($event)"
                ></b-numberinput>
              </b-field>
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors, valid }"
              rules="required"
              name="Position"
              slim
              mode="lazy"
            >
              <b-field
                label="Position"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-input v-model="jobForm.position"></b-input>
              </b-field>
            </ValidationProvider>

            <b-field expanded grouped group-multiline :addons="false">
              <ValidationProvider
                v-slot="{ errors, valid }"
                rules="required|max_value:4.0"
                name="GPA"
                slim
              >
                <b-field
                  expanded
                  label="Minimum GPA"
                  :type="{ 'is-danger': errors[0], 'is-success': valid }"
                  :message="errors"
                >
                  <b-numberinput
                    v-model.number="jobForm.gpa"
                    min="1.75"
                    step="0.01"
                    max="4.0"
                    expanded
                    lazy
                  ></b-numberinput> </b-field
              ></ValidationProvider>
              <ValidationProvider
                v-slot="{ errors, valid }"
                rules="required"
                name="GPA Weight"
                slim
              >
                <b-field
                  expanded
                  :type="{ 'is-danger': errors[0], 'is-success': valid }"
                  :message="errors"
                  label="Assign Weight"
                >
                  <b-numberinput
                    v-model="jobForm.weights.gpa_weight"
                    step="0.01"
                  ></b-numberinput>
                </b-field>
              </ValidationProvider>
            </b-field>

            <b-field grouped group-multiline expanded :addons="false">
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
                >
                  <b-autocomplete
                    ref="autocomplete"
                    v-model="jobForm.qualifications"
                    open-on-focus
                    clearable
                    :data="filteredDegrees"
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
              <ValidationProvider
                v-slot="{ errors, valid }"
                rules="required"
                name="Weight"
                slim
              >
                <b-field
                  :type="{ 'is-danger': errors[0], 'is-success': valid }"
                  :message="errors"
                  label="Assign Weight"
                >
                  <b-numberinput
                    v-model="jobForm.weights.qualification_weight"
                    step="0.01"
                  ></b-numberinput>
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
                  :mobile-native="false"
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
              <b-field class="mb-3" :addons="false" grouped group-multiline>
                <b-field label="Add more">
                  <b-button
                    v-if="jobForm.skills.length > 0"
                    icon-right="plus"
                    label="Add More"
                    type="is-primary"
                    @click="add"
                  ></b-button>
                </b-field>
                <b-field class="is-pulled-right" label="Overall Skills Weight">
                  <b-numberinput
                    v-model="jobForm.weights.overall_skill_weight"
                    step="0.01"
                    class="ml-2"
                    controls-position="compact"
                    :controls="true"
                    expanded
                    @input="divideSkillWeight"
                  ></b-numberinput>
                </b-field>
              </b-field>
              <b-field
                label="Skills"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
                expanded
                :addons="false"
              >
                <b-field
                  v-for="(skill, index) in jobForm.skills"
                  :key="skill.id"
                  expanded
                >
                  <p class="control">
                    <b-button
                      v-show="index || jobForm.skills.length > 1"
                      icon-left="delete"
                      @click="remove(index)"
                    ></b-button>
                  </p>
                  <b-input v-model="skill.name" expanded></b-input>
                  <b-field>
                    <b-numberinput
                      v-model="skill.weight"
                      expanded
                      controls-position="compact"
                      step="0.001"
                    ></b-numberinput>
                  </b-field>
                </b-field>
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
            </ValidationProvider>
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
            @click="updateJob"
          ></b-button>
        </footer>
      </div>
    </b-modal>
    <DocumentModal
      :active="modalIsActive"
      :filename="internshipPageInfo.filename"
      @update:active="toggleModal($event)"
    />
  </section>
</template>
<script>
import cloneDeep from 'lodash/cloneDeep'
import { mapState } from 'vuex'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
export default {
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      startDate: '',
      endDate: '',
      jobForm: '',
      editingPost: false,
      degreeName: '',
      degrees: [
        'BSc. Computer Science',
        'BSc. Information Technology',
        'BSc. Software Engineering',
        'BSc. Computer Studies',
        'BSc. Information Systems',
      ],
      modalIsActive: false,
    }
  },
  computed: {
    ...mapState(['internshipPageInfo', 'isSubmittingJob', 'isArchivingPost']),
    filteredDegrees() {
      return this.degrees.filter((option) => {
        return option
          .toString()
          .toLowerCase()
          .includes(this.degreeName.toLowerCase())
      })
    },
  },

  async mounted() {
    await this.$store.dispatch('getInternshipPage', this.$route.params.id)
    const startDate = new Date(this.internshipPageInfo.start_date)
    const endDate = new Date(this.internshipPageInfo.end_date)
    this.startDate = startDate.toDateString()
    this.endDate = endDate.toDateString()
  },
  methods: {
    toggleModal(value) {
      this.modalIsActive = !this.modalIsActive
    },
    add() {
      this.jobForm.skills.push({
        name: 'value',
        weight: 0,
        internship_id: this.jobForm.id,
      })
      this.divideSkillWeight()
    },
    remove(index) {
      this.jobForm.skills.splice(index, 1)
      this.divideSkillWeight()
    },
    divideTotalWeight(value) {
      const self = this
      const weights = Object.keys(this.jobForm.weights)
      const count = weights.filter(
        (weight) =>
          weight.includes('weight') && weight.toLowerCase() !== 'total_weight'
      ).length

      weights.forEach((element) => {
        if (
          element.includes('weight') &&
          element.toLowerCase() !== 'total_weight'
        ) {
          this.jobForm.weights[element] = value / count
          self.divideSkillWeight()
        }
      })
    },
    divideSkillWeight() {
      const ovrSkillWeight = this.jobForm.weights.overall_skill_weight
      const skills = this.jobForm.skills
      const totSkills = skills.length
      const indvSkillWeight = ovrSkillWeight / totSkills
      skills.forEach((element) => {
        element.weight = indvSkillWeight
      })
    },
    editPost() {
      this.jobForm = cloneDeep(this.internshipPageInfo)
      this.jobForm.duration = [
        new Date(this.jobForm.start_date),
        new Date(this.jobForm.end_date),
      ]
      this.editingPost = !this.editingPost
    },
    closeJobModal() {
      this.editingPost = false
      this.$refs.updateJobObserver.reset()
    },
    async updateJob() {
      const isValid = await this.$refs.updateJobObserver.validate()
      if (isValid) {
        await this.$store.dispatch('updateInternship', this.jobForm)
        this.editingPost = false
        await this.$store.dispatch('getInternshipPage', this.$route.params.id)
      }
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
    confirmArchivePost() {
      this.$buefy.dialog.confirm({
        title: 'Archiving Post',
        message:
          'Archiving this Post will remove it from the view of students and will not be found in any search results. You can always unarchive this post by going to your profile and select the archived tab.',
        confirmText: 'Archive Post',
        type: 'is-warning',
        hasIcon: true,
        onConfirm: () => this.archivePost(),
      })
    },
    archivePost() {
      this.$store.dispatch('archivePost', {
        id: this.id,
        isActive: !this.isActive,
      })
      this.$buefy.notification.open({
        duration: 4000,
        type: 'is-success',
        message: 'Operation Successful',
        position: 'is-top-right',
        hasIcon: true,
      })
    },
  },
}
</script>
<style scoped>
.box {
  padding: inherit;
}
</style>
