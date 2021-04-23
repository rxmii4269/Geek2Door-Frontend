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
            @select="(option) => (selected = option)"
          >
            <template slot-scope="props">
              <div class="media">
                <div class="media-left">
                  <img
                    width="32"
                    :src="`${$config.axios.browserBaseURL}/api/images/${props.profile_picture}`"
                    alt=""
                  />
                </div>
              </div>
            </template>
          </b-autocomplete>
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
  data() {
    return {
      data: [],
      isFetching: false,
      selected: null,
    }
  },
  computed: {
    ...mapState(['allStudents', 'page']),
  },
  async mounted() {
    await this.$store.dispatch('getAllStudents')
  },
  methods: {
    getAsyncData: debounce(function (name) {
      if (!name.length) {
        this.data = []
        return
      }
      this.isFetching = true
      this.$axios
        .get('/api/search', {
          params: {
            category: 'students',
            name,
          },
        })
        .then(({ data }) => {
          this.data = []
          console.log(data)
          data.results.forEach((item) => this.data.push(item))
        })
        .catch((error) => {
          this.data = []
          throw error
        })
        .finally(() => {
          this.isFetching = false
        })
    }, 500),
    infiniteHandler: debounce(function ($state) {
      this.$store.dispatch('getAllStudents', $state)
    }, 100),
  },
}
</script>
