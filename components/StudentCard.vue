<template>
  <div class="column" :class="customClass">
    <div class="card">
      <nuxt-link :to="profile">
        <div class="card-image is-flex is-justify-content-center">
          <figure class="image is-96x96">
            <img :src="profilePictureURL" alt="" class="" />
          </figure>
        </div>
        <header class="card-header is-justify-content-center">
          <nuxt-link :to="profile">
            <p class="card-header-title">
              {{ fullName }}
            </p>
          </nuxt-link>
        </header>
      </nuxt-link>

      <div class="card-content">
        <div class="content">
          <p>@{{ username }}</p>
          <p>{{ email }}</p>
          <b-taglist>
            <b-tag v-for="skill in skills" :key="skill.index" type="is-primary">
              {{ skill.name }}
            </b-tag>
          </b-taglist>
          <b-taglist v-if="gpa" attached>
            <b-tag type="is-primary">GPA</b-tag>
            <b-tag type="is-black">{{ gpa }}</b-tag>
          </b-taglist>
          <b-field
            v-if="major || minor"
            label="Qualifications"
            group-multiline
            grouped
          >
            <b-field label="Major">
              <div>{{ major }}</div>
            </b-field>
            <b-field label="Minor">
              <div>{{ minor }}</div>
            </b-field>
          </b-field>
        </div>
        <section>
          <b-field
            v-if="Object.keys(scores).length > 0"
            expanded
            label="Ranking"
            group-multiline
            grouped
          >
            <b-field
              v-if="scores.qual_score_percentage"
              expanded
              label="Qualifications Score"
            >
              <b-progress
                type="is-primary"
                :value="scores.qual_score_percentage"
                format="percent"
                show-value
              ></b-progress>
            </b-field>
            <b-field
              v-if="scores.gpa_score_percentage"
              expanded
              label="GPA Score"
            >
              <b-progress
                type="is-primary"
                :value="scores.gpa_score_percentage"
                format="percent"
                show-value
              ></b-progress>
            </b-field>
          </b-field>
          <b-field
            v-if="scores.skill_score_percentage"
            epxanded
            label="Skills Score"
          >
            <b-progress
              type="is-primary"
              :value="scores.skill_score_percentage"
              show-value
              format="percent"
            ></b-progress>
          </b-field>
        </section>
        <b-button
          v-if="internshipId"
          class="mt-3"
          expanded
          type="is-primary is-outlined"
          @click="sendInvitation"
          >Send Internship Invitation</b-button
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    id: {
      type: Number,
      default: 0,
    },
    username: {
      type: String,
      default: '',
      required: true,
    },
    email: {
      type: String,
      default: '',
      required: true,
    },
    firstName: {
      type: String,
      defualt: '',
      required: true,
    },
    lastName: {
      type: String,
      default: '',
      required: true,
    },
    profilePicture: {
      type: String,
      default: 'default.png',
      requried: true,
    },
    role: {
      type: String,
      default: 'student',
      required: true,
    },
    skills: {
      type: [Array],
      default: () => {
        return []
      },
    },
    scores: {
      type: Object,
      default: () => {
        return {}
      },
    },
    gpa: {
      type: Number,
      default: 0,
    },
    major: {
      type: String,
      default: '',
    },
    minor: {
      type: String,
      default: '',
    },
    customClass: {
      type: String,
      default: 'is-half',
    },
    internshipId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {}
  },
  computed: {
    fullName() {
      return this.firstName + ' ' + this.lastName
    },
    profilePictureURL() {
      return `${this.$config.axios.browserBaseURL}/api/images/${this.profilePicture}`
    },
    profile() {
      return `/student/${this.username}`
    },
  },
  //   mounted: {},
  methods: {
    sendInvitation() {
      this.$axios.post(
        `/api/internships/${this.internshipId}/invitation/${this.id}`,
        {
          message: 'I am offering you a job offer',
        }
      )
    },
  },
}
</script>
<style scoped>
.content > p {
  word-break: break-all;
}
.card {
  border-radius: 0.9rem;
  border-color: black;
  border-width: 2px;
}
</style>
