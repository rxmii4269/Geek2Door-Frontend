<template>
  <section>
    <div v-if="internshipPageInfo" class="columns is-multiline">
      <div class="column is-one-third">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">{{ internshipPageInfo.position }}</p>
          </header>
          <div class="card-content">
            <div class="content">
              <time class="block"> Start Date: {{ startDate }}</time>
              <time class="block">{{ endDate }}</time>
              <p class="is-size-7 has-text-weight-medium">
                by:
                <nuxt-link
                  :to="'/users/company/' + internshipPageInfo.company_name"
                  >{{ internshipPageInfo.company_name }}</nuxt-link
                >
              </p>
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
        </div>
      </div>
      <div class="column">
        <CompanyJobPage
          v-if="$auth.user.name === internshipPageInfo.company_name"
          :applied="internshipPageInfo.applied"
        />
      </div>
    </div>
  </section>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      startDate: '',
      endDate: '',
    }
  },
  computed: {
    ...mapState(['internshipPageInfo']),
  },
  async mounted() {
    await this.$store.dispatch('getInternshipPage', this.$route.params.id)
    const startDate = new Date(this.internshipPageInfo.start_date)
    const endDate = new Date(this.internshipPageInfo.end_date)
    this.startDate = startDate.toDateString()
    this.endDate = endDate.toDateString()
    console.log(startDate, endDate)
  },
  methods: {},
}
</script>
<style scoped>
.box {
  padding: inherit;
}
</style>
