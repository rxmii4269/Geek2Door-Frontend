import { NotificationProgrammatic as Notification } from 'buefy'
import clonedeep from 'lodash/cloneDeep'

export const state = () => ({
  profile_url: '',
  profileData: '',
  updatedProfileData: '',
  isSubmittingJob: false,
  isSavingProfile: false,
  isArchivingPost: false,
  isApplyingForInternship: false,
  internships: [],
  appliedInternships: [],
  internshipPageInfo: [],
  allInternships: [],
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
  SET_ALL_INTERNSHIPS(state, internships) {
    state.allInternships = internships
  },
  SET_APPLIED_INTERNSHIPS(state, appliedInternships) {
    state.appliedInternships = appliedInternships
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
  TOGGLE_SAVING_PROFILE(state, flag) {
    state.isSavingProfile = flag
  },
  TOGGLE_APPLYING_FOR_INTERNSHIP(state, flag) {
    state.isApplyingForInternship = flag
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
    if (this.$auth.user.role === 'company') {
      await this.$axios
        .$post(`/api/users/company/${this.$auth.user.id}`, profile)
        .then(async function (response) {
          const updatedUser = await self.$axios.$get('/api/auth/user')
          Notification.open({
            duration: 3000,
            message: 'Profile Updated Successfully',
            position: 'is-top-right',
            type: 'is-success is-light',
            hasIcon: true,
          })
          await self.$auth.setUser(updatedUser.user)
          self.$router.push(`/users/company/${self.$auth.user.name}`)
          dispatch('getProfile', updatedUser.user.name)
        })
    } else if (this.$auth.user.role === 'student') {
      commit('TOGGLE_SAVING_PROFILE', true)
      await this.$axios
        .$post(`/api/users/student/${this.$auth.user.id}`, profile)
        .then(async function (response) {
          commit('TOGGLE_SAVING_PROFILE', false)
          const updateUser = await self.$axios.$get('/api/auth/user')
          Notification.open({
            duration: 3000,
            message: 'Profile Updated Successfully',
            position: 'is-top-right',
            type: 'is-success is-light',
            hasIcon: true,
          })
          await self.$auth.setUser(updateUser.user)
          self.$router.push(`/users/student/${self.$auth.user.username}`)
          dispatch('getProfile', updateUser.user.username)
        })
    }
  },
  async submitInternship({ commit, dispatch, state }, internshipForm) {
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
    await dispatch('getInternships', state.auth.user.id)
  },
  async getInternships({ commit, state }, id) {
    const response = await this.$axios.$get(`/api/users/${id}/internships`)
    response.forEach((element, index, response) => {
      response[index].shortDescription =
        element.description.replace(/\r?\n|\r/g, ' ').slice(0, 100) + '...'
    })
    commit('SET_INTERNSHIPS', response)
  },
  async getAppliedInternships({ commit, state }) {
    const response = await this.$axios.$get(
      `/api/users/${state.auth.user.id}/internships/apply`
    )
    response.forEach((element, index, response) => {
      response[index].shortDescription =
        element.description.replace(/\r?\n|\r/g, ' ').slice(0, 100) + '...'
    })
    commit('SET_APPLIED_INTERNSHIPS', response)
  },
  async updateInternship({ commit, dispatch, state }, internshipForm) {
    commit('TOGGLE_SUBMITTING_JOB', true)
    await this.$axios
      .$post(`/api/internships/${internshipForm.id}`, internshipForm)
      .then((response) => {
        commit('TOGGLE_SUBMITTING_JOB', false)
        Notification.open({
          duration: 3000,
          message: 'Job Post Updated Successfully',
          position: 'is-top-right',
          type: 'is-success is-light',
          hasIcon: true,
        })
      })
    await dispatch('getInternships', state.auth.user.id)
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
  async getAllInternships({ commit }) {
    const response = await this.$axios.$get(`/api/internships`)
    commit('SET_ALL_INTERNSHIPS', response)
  },
  async applyForInternship({ commit, state, dispatch }, data) {
    commit('TOGGLE_APPLYING_FOR_INTERNSHIP', true)
    const response = await this.$axios.$post(`/api/internships/apply`, data)
    commit('TOGGLE_APPLYING_FOR_INTERNSHIP', false)
    await dispatch('getAppliedInternships')
    Notification.open({
      duration: 3000,
      message: 'Application Sent Successfully',
      position: 'is-top-right',
      type: 'is-success is-light',
      hasIcon: true,
    })
    console.log(response)
  },
}
