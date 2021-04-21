<template>
  <div class="columns is-8">
    <div class="column is-3">
      <div class="card">
        <div class="card-content">
          <div class="content">
            <h5>Hello These are your recommended Students:</h5>
          </div>
        </div>
      </div>
      <b-button @click="$auth.refreshTokens()">Refresh</b-button>
    </div>
    <div class="column is-9">
      <div class="container mb-5">
        <b-field expanded>
          <b-input
            expanded
            rounded
            icon-pack="bx"
            icon-right="bx-search"
            placeholder="Search"
          ></b-input>
        </b-field>
      </div>
      <div class="columns is-multiline">
        <StudentCard
          v-for="student in allStudents"
          :key="student.id"
          :first-name="student.firstname"
          :last-name="student.lastname"
          :profile-picture="student.profile_picture"
          :role="student.role"
          :email="student.email"
          :skills="student.skills"
          :username="student.username"
        />
        <InfiniteLoading @infinite="infiniteHandler"> </InfiniteLoading>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import debounce from 'lodash/debounce'
export default {
  computed: {
    ...mapState(['allStudents', 'page']),
  },
  async mounted() {
    await this.$store.dispatch('getAllStudents')
  },
  methods: {
    infiniteHandler: debounce(function ($state) {
      this.$store.dispatch('getAllStudents', $state)
    }, 100),
  },
}
</script>
