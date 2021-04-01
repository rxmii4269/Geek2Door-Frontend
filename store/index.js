import { NotificationProgrammatic as Notification } from 'buefy'
import clonedeep from 'lodash/cloneDeep'

export const state = () => ({
  profile_url: '',
  profileData: '',
  updatedProfileData: '',
  isSubmittingJob: false,
  isArchivingPost: false,
  internships: [],
  internshipPageInfo: [],
})

export const getters = {
  unarchivedJobs: (state) => {
    return state.internships.filter((internship) => internship.is_active)
  },
  archivedJobs: (state) => {
    return state.internships.filter(
      (internship) => internship.is_active === false
    )
  },
  getJobById: (state) => (id) => {
    return state.internships.filter((internship) => internship.id === id)
  },
}

export const mutations = {
  SET_PROFILE_URL(state, url) {
    state.profile_url = url
  },
  SET_PROFILE_DATA(state, profileData) {
    state.profileData = profileData
  },
  SET_UPDATED_PROFILE_DATA(state, profileData) {
    state.updatedProfileData = clonedeep(profileData)
  },
  SET_INTERNSHIPS(state, internships) {
    state.internships = internships
  },
  TOGGLE_SUBMITTING_JOB(state, flag) {
    state.isSubmittingJob = flag
  },
  TOGGLE_ARCHIVING_POST(state, flag) {
    state.isArchivingPost = flag
  },
  SET_JOB_PAGE_INFO(state, data) {
    state.internshipPageInfo = data
  },
}

export const actions = {
  generateProfileUrl({ commit }) {
    if (this.$auth.loggedIn) {
      let url = ''
      if (this.$auth.user.role === 'company') {
        url = `/users/${this.$auth.user.role}/${this.$auth.user.name}`
      } else {
        url = `/users/${this.$auth.user.role}/${this.$auth.user.username}`
      }
      commit('SET_PROFILE_URL', url)
    }
  },
  editProfile({ commit }, profile) {
    commit('SET_UPDATED_PROFILE_DATA', profile)
  },
  async getProfile({ commit }, userIdentifier) {
    const response = await this.$axios.$get(`/api/users/${userIdentifier}`)
    commit('SET_PROFILE_DATA', response)
  },
  async saveProfile({ commit, dispatch }, profile) {
    const self = this
    await this.$axios
      .$post(`/api/users/company/${this.$auth.user.id}`, profile)
      .then(async function (response) {
        const updatedUser = await self.$axios.$get('/api/auth/user')
        await self.$auth.setUser(updatedUser.user)
        if (self.$auth.user.role === 'company') {
          self.$router.push(`/users/company/${self.$auth.user.name}`)
          dispatch('getProfile', updatedUser.user.name)
        } else {
          dispatch('generateProfileUrl')
          self.$router.push(`/user/student/${self.$auth.user.username}`)
          dispatch('getProfile', updatedUser.user.username)
        }
      })
  },
  async submitInternship({ commit, dispatch }, internshipForm) {
    commit('TOGGLE_SUBMITTING_JOB', true)
    await this.$axios
      .$post('/api/internships', internshipForm)
      .then((response) => {
        commit('TOGGLE_SUBMITTING_JOB', false)
        Notification.open({
          duration: 3000,
          message: 'Job Post Created Successfully',
          position: 'is-top-right',
          type: 'is-success is-light',
          hasIcon: true,
        })
      })
    await dispatch('getInternships')
  },
  async getInternships({ commit, state }) {
    const response = await this.$axios.$get(
      `/api/users/${state.auth.user.id}/internships`
    )
    response.forEach((element, index, response) => {
      response[index].shortDescription =
        element.description.replace(/\r?\n|\r/g, ' ').slice(0, 100) + '...'
    })
    commit('SET_INTERNSHIPS', response)
  },
  async updateInternship({ commit, dispatch }, internshipForm) {
    commit('TOGGLE_SUBMITTING_JOB', true)
    await this.$axios
      .$post(`/api/internships/${internshipForm.id}`, internshipForm)
      .then((response) => {
        commit('TOGGLE_SUBMITTING_JOB', false)
        Notification.open({
          duration: 3000,
          message: 'Job Post Created Successfully',
          position: 'is-top-right',
          type: 'is-success is-light',
          hasIcon: true,
        })
      })
    await dispatch('getInternships')
  },
  async archivePost({ commit, dispatch }, info) {
    const response = await this.$axios.$post(
      `/api/internships/${info.id}/archive`,
      info
    )
    await commit('TOGGLE_ARCHIVING_POST', true)
    Notification.open({
      duration: 3000,
      message: response,
      position: 'is-top-right',
      type: 'is-success is-light',
      hasIcon: true,
    })
    await commit('TOGGLE_ARCHIVING_POST', false)
    await dispatch('getInternships')
  },
  async getInternshipPage({ commit }, id) {
    const response = await this.$axios.$get(`/api/internships/${id}`)
    commit('SET_JOB_PAGE_INFO', response)
  },
}
