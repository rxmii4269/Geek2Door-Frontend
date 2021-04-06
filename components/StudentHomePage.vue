<template>
  <div class="columns is-8">
    <div class="column is-3">
      <div class="card">
        <div class="card-content">
          <div class="content">
            <h5>Hello These are your recommended Jobs:</h5>
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
      <div v-if="$auth.user.role === 'student'" class="columns">
        <InternshipPost
          v-for="internship in allInternships"
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
          :home-page="true"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['allInternships']),
  },
  async mounted() {
    await this.$store.dispatch('getAllInternships')
  },
}
</script>
