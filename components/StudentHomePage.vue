<template>
  <div class="columns">
    <div class="column is-one-third-desktop">
      <div class="card">
        <div class="card-header">
          <p class="card-header-title is-centered">
            Hello These are your recommended Jobs
          </p>
        </div>
        <div class="card-content p-0">
          <div class="content">
            <section>
              <b-collapse
                v-for="(internship, index) of recommendedInternships"
                :key="internship.id"
                :open="isOpen == index"
                class="card"
                animation="slide"
                @open="isOpen = index"
              >
                <template #trigger="props">
                  <div class="card-header" role="button">
                    <div class="media mb-0">
                      <div class="media-left mr-0">
                        <figure class="image is-48x48">
                          <img
                            :src="`${$config.axios.browserBaseURL}/api/images/${internship.profile_picture}`"
                            alt="internship profile picture"
                          />
                        </figure>
                      </div>
                    </div>
                    <p class="card-header-title">
                      {{ internship.position }}
                    </p>
                    <a class="card-header-icon">
                      <b-icon
                        :icon="props.open ? 'menu-down' : 'menu-up'"
                      ></b-icon>
                    </a>
                  </div>
                </template>
                <div class="card-content">
                  <div class="content">
                    <b-field label="Compatibility">
                      <b-progress
                        :value="internship.total_rank"
                        show-value
                        format="percent"
                        type="is-primary"
                      ></b-progress>
                    </b-field>
                    <div class="buttons is-centered">
                      <b-button
                        size="is-small"
                        type="is-primary is-outlined"
                        :loading="isApplying"
                        :disabled="hasAppliedCheck"
                        @click="applyForInternship(internship.id)"
                        >{{ isApplied }}</b-button
                      >
                      <b-button
                        tag="nuxt-link"
                        :to="`/jobs/${internship.id}`"
                        size="is-small"
                        type="is-primary is-outlined"
                        >View More</b-button
                      >
                    </div>
                  </div>
                </div>
              </b-collapse>
            </section>
          </div>
        </div>
      </div>
      <!-- <b-button @click="$auth.refreshTokens()">Refresh</b-button> -->
    </div>
    <div class="column">
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
      isOpen: 0,
      hasAppliedCheck: false,
      isApplying: false,
    }
  },
  computed: {
    ...mapState(['allInternships', 'recommendedInternships']),
    isApplied() {
      return this.hasAppliedCheck ? 'Applied' : 'Apply'
    },
  },
  async mounted() {
    await this.$store.dispatch('getAllInternships')
    await this.$store.dispatch('getRecommendedInternships')
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
    async applyForInternship(id) {
      this.isApplying = true
      await this.$store.dispatch('applyForInternship', {
        student_id: this.$auth.user.id,
        post_id: id,
      })
      this.isApplying = false
      this.hasAppliedCheck = true
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
