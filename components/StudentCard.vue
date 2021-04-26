<template>
  <div class="column is-one-third">
    <div class="card">
      <div class="card-image is-flex is-justify-content-center">
        <figure class="image is-96x96">
          <img :src="profilePictureURL" alt="" class="" />
        </figure>
      </div>
      <header class="card-header">
        <nuxt-link :to="profile">
          <p class="card-header-title">
            {{ fullName }}
          </p>
        </nuxt-link>
      </header>
      <div class="card-content">
        <div class="content">
          <p>@{{ username }}</p>
          <p>{{ email }}</p>
          <b-taglist>
            <b-tag v-for="skill in skills" :key="skill.index" type="is-primary">
              {{ skill.name }}
            </b-tag>
          </b-taglist>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
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
  //   methods: {},
}
</script>
