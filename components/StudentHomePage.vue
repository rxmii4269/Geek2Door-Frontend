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
      <!-- <b-button @click="$auth.refreshTokens()">Refresh</b-button> -->
    </div>
    <div class="column is-9">
      <div class="container mb-5">
        <b-field expanded>
          <b-autocomplete
            expanded
            rounded
            icon-pack="bx"
            icon-right="bx-search"
            placeholder="Search"
            :data="data"
            field="title"
            :loading="isFetching"
            @typing="getAsyncData"
            @select="navigate($event)"
          >
            <template slot-scope="props">
              <div class="media">
                <div class="media-left">
                  <img
                    width="32"
                    :src="`${$config.axios.browserBaseURL}/api/images/${props.option.profile_picture}`"
                    alt=""
                  />
                </div>
                <div class="media-content">
                  {{ props.option.position }}
                  <br />
                  <p class="has-text-weight-medium">
                    by:
                    <nuxt-link :to="`/company/${props.option.company_name}`">{{
                      props.option.company_name
                    }}</nuxt-link>
                  </p>
                  <hr class="my-3" />
                  <b-field label="Skills" custom-class="is-size-7">
                    <b-taglist>
                      <b-tag
                        v-for="skill in props.option.skills"
                        :key="skill.id"
                        type="is-primary"
                        >{{ skill.name }}</b-tag
                      >
                    </b-taglist>
                  </b-field>
                  <b-field group-multiline grouped>
                    <div class="control">
                      <b-taglist attached>
                        <b-tag type="is-primary">GPA</b-tag>
                        <b-tag type="is-dark">{{ props.option.gpa }}</b-tag>
                      </b-taglist>
                    </div>
                  </b-field>
                  <div class="is-size-7 is-flex is-flex-direction-row">
                    <div class="is-justify-content-start">
                      <div>
                        <span>Starts:</span>
                        <time>{{ props.option.start_date }}</time>
                      </div>
                      <div>
                        <span>Ends:</span>
                        <time>{{ props.option.end_date }}</time>
                      </div>
                    </div>
                    <div class="is-justify-content-end"></div>
                  </div>
                </div>
              </div>
            </template>
          </b-autocomplete>
        </b-field>
      </div>
      <div v-if="$auth.user.role === 'student'" class="columns is-multiline">
        <client-only>
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
            :has-applied="internship.has_applied"
            :company-name="internship.company_name"
          />
          <InfiniteLoading @infinite="infiniteHandler"></InfiniteLoading>
        </client-only>
      </div>
    </div>
  </div>
</template>
<script>
import debounce from 'lodash/debounce'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      data: [],
      isFetching: false,
      selected: null,
    }
  },
  computed: {
    ...mapState(['allInternships']),
  },
  mounted() {
    this.$store.dispatch('getAllInternships')
  },
  methods: {
    getAsyncData: debounce(function (position) {
      if (!position.length) {
        this.data = []
        return
      }
      this.isFetching = true
      this.$axios
        .get('/api/search', {
          params: {
            category: 'internships',
            position,
          },
        })
        .then(({ data }) => {
          this.data = []
          data.results.forEach((item) => this.data.push(item))
        })
        .catch((error) => {
          this.data = []
          this.$buefy.notification.open({
            duration: 4000,
            position: 'is-top-right',
            hasIcon: true,
            type: 'is-danger',
            message: error.response.data,
          })
        })
        .finally(() => {
          this.isFetching = false
        })
    }, 500),
    infiniteHandler: debounce(function ($state) {
      this.$store.dispatch('getAllInternships', $state)
    }, 100),
    navigate(option) {
      this.$router.push(`/jobs/${option.id}`)
    },
  },
}
</script>
<style scoped>
@media screen and (max-width: 768px) {
  .media-content {
    overflow-x: visible;
  }
}
a.dropdown-item {
  border-bottom: 2px solid #ddd;
}
.autocomplete .dropdown-content {
  max-height: 250px;
}
</style>
