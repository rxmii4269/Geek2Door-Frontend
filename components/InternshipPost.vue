<template>
  <div class="column is-half">
    <div class="box" @mouseover="hover = true" @mouseleave="hover = false">
      <b-tooltip
        class="is-pulled-right"
        label="Edit"
        type="is-primary is-light"
      >
        <i
          v-if="hover && $auth.user.id === companyId"
          class="bx bx-edit is-size-4 is-clickable"
          @click="editPost = true"
        ></i>
      </b-tooltip>
      <div class="media">
        <div class="media-left">
          <figure class="image is-48x48">
            <img :src="img_url" alt="Placeholder image" />
          </figure>
        </div>
        <div class="media-content">
          <h1 class="is-size-5 is-capitalized">{{ position }}</h1>
          <p class="is-size-7">{{ shortDescription }}</p>
        </div>
      </div>
      <p class="is-size-7 has-text-weight-medium mt-2">
        by:
        <nuxt-link :to="'/company/' + companyName">{{ companyName }}</nuxt-link>
      </p>
      <hr class="my-3" />
      <b-field label="Skills" custom-class="is-size-7">
        <b-taglist>
          <b-tag v-for="skill in skills" :key="skill.id" type="is-primary">{{
            skill.name
          }}</b-tag>
        </b-taglist>
      </b-field>

      <b-field group-multiline grouped>
        <div class="control">
          <b-taglist attached>
            <b-tag type="is-primary">GPA</b-tag>
            <b-tag type="is-dark">{{ gpa }}</b-tag>
          </b-taglist>
        </div>
        <div v-if="location" class="control">
          <b-taglist attached>
            <b-tag type="is-primary"><i class="bx bxs-map"></i></b-tag>
            <b-tag type="is-dark">{{ location }}</b-tag>
          </b-taglist>
        </div>
      </b-field>

      <div class="is-size-7 is-flex is-flex-direction-row">
        <div class="is-justify-content-start">
          <div>
            <span>Starts:</span>
            <time>{{ startTime }}</time>
          </div>
          <div>
            <span>Ends:</span>
            <time>{{ endTime }}</time>
          </div>
        </div>
        <div class="is-justify-content-end"></div>
      </div>
      <nav v-if="$auth.user.role === 'company'" class="level">
        <div class="level-left">
          <p class="is-size-7 has-text-grey-light">Views: {{ views }}</p>
        </div>
        <div class="level-right">
          <p class="is-size-7 has-text-grey-light">Applied: {{ applied }}</p>
        </div>
      </nav>
      <div class="buttons is-centered">
        <b-button
          v-if="$auth.user.role == 'student'"
          outlined
          type="is-primary"
          size="is-small"
          :loading="isApplyingForInternship"
          :disabled="hasAppliedCheck"
          @click="applyForInternship"
        >
          {{ isApplied }}
        </b-button>
        <b-button
          outlined
          size="is-small"
          type="is-primary"
          tag="nuxt-link"
          :to="internshipUrl"
          >View More</b-button
        >
        <b-button
          v-if="$auth.user.id === companyId"
          outlined
          inverted
          size="is-small"
          type="is-warning"
          :loading="isArchivingPost"
          @click="archivePost"
        >
          {{ active }}
        </b-button>
        <b-button
          v-if="$auth.user.id === companyId"
          outlined
          size="is-small"
          type="is-danger"
          @click="confirmDeletePost"
        >
          Delete
        </b-button>
      </div>
    </div>
    <b-modal
      :active.sync="editPost"
      trap-focus
      has-modal-card
      destroy-on-hide
      aria-role="dialog"
      aria-modal
      :can-cancel="false"
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
            <b-field grouped group-multiline>
              <ValidationProvider
                v-slot="{ errors, valid }"
                rules="required|max_value:4.0"
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
                    :value="qualifications"
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
                  :value="startTime"
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
                :message="errors"
                expanded
                :addons="false"
              >
                <b-field
                  v-for="skill in jobForm.skills"
                  :key="skill.id"
                  expanded
                >
                  <b-input v-model="skill.name" expanded></b-input>
                  <b-field>
                    <b-numberinput
                      v-model="skill.weight"
                      expanded
                      controls-position="compact"
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
                  :value="description"
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
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  props: {
    id: {
      type: Number,
      default: 0,
      required: true,
    },
    position: {
      type: String,
      default: '',
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    shortDescription: {
      type: String,
      default: '',
    },
    skills: {
      type: [Array, Object],
      default: () => {
        return []
      },
      // validator: (prop) => prop.every((e) => typeof e === 'string'),
    },
    location: {
      type: String,
      default: '',
    },
    gpa: {
      type: Number,
      default: 2.75,
      validator: (prop) => typeof prop === 'number',
    },
    startTime: {
      type: String,
      default: () => {
        return new Date().toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      },
      required: true,
    },
    qualifications: {
      type: String,
      default: '',
    },
    endTime: {
      type: String,
      default: () => {
        return new Date().toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      },
      requried: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    applied: {
      type: Number,
      default: 0,
    },
    profilePicture: {
      type: String,
      default: 'company_default.png',
    },
    isActive: {
      type: Boolean,
      defualt: true,
    },
    companyId: {
      type: Number,
      default: 0,
    },
    companyName: {
      type: String,
      default: '',
    },
    hasApplied: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hover: false,
      img_url: `${this.$config.axios.browserBaseURL}/api/images/${this.$auth.user.profile_picture}`,
      internshipUrl: `/jobs/${this.id}`,
      editPost: false,
      jobForm: {
        position: this.position,
        GPA: this.gpa,
        qualifications: this.qualifications,
        skills: this.skills,
        location: this.location,
        description: this.description,
        duration: [new Date(this.startTime), new Date(this.endTime)],
      },
      degreeName: this.qualifications,
      degrees: [
        'BSc. Computer Science',
        'BSc. Information Technology',
        'BSc. Software Engineering',
        'BSc. Computer Studies',
        'BSc. Information Systems',
      ],
      active: this.isActive ? 'Archive' : 'Unarchive',
      hasAppliedCheck: this.hasApplied,
      isApplied: this.hasApplied ? 'Applied' : 'Apply',
    }
  },
  computed: {
    ...mapState([
      'isSubmittingJob',
      'isArchivingPost',
      'isApplyingForInternship',
    ]),
    filteredDegrees() {
      return this.degrees.filter((option) => {
        return option
          .toString()
          .toLowerCase()
          .includes(this.degreeName.toLowerCase())
      })
    },
  },
  methods: {
    async applyForInternship() {
      await this.$store.dispatch('applyForInternship', {
        student_id: this.$auth.user.id,
        post_id: this.id,
      })
      this.hasAppliedCheck = true
      this.isApplied = this.hasAppliedCheck ? 'Applied' : 'Apply'
    },
    async updateJob() {
      const isValid = await this.$refs.updateJobObserver.validate()
      if (isValid) {
        this.jobForm.id = this.id
        await this.$store.dispatch('updateInternship', this.jobForm)
        this.editPost = false
      }
    },
    closeJobModal() {
      this.editPost = false
      this.$refs.updateJobObserver.reset()
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
    archivePost() {
      this.$store.dispatch('archivePost', {
        id: this.id,
        isActive: !this.isActive,
      })
    },
    confirmDeletePost() {
      this.$buefy.dialog.confirm({
        title: 'Deleting Post',
        message:
          'Are you sure you want to <b>delete</b> this post? This action cannot be undone.',
        confirmText: 'Delete Post',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => {
          this.$store.dispatch('deleteInternship', this.id)
        },
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
