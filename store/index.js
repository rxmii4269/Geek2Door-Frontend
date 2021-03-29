import { NotificationProgrammatic as Notification } from 'buefy'
export const state = () => ({
  profile_url: '',
  profileData: '',
  updatedProfileData: '',
  isSubmittingJob: false,
  internships: null,
})

export const mutations = {
  SET_PROFILE_URL(state, url) {
    state.profile_url = url
  },
  SET_PROFILE_DATA(state, profileData) {
    state.profileData = profileData
  },
  SET_UPDATED_PROFILE_DATA(state, profileData) {
    state.updatedProfileData = profileData
  },
  SET_INTERNSHIPS(state, internships) {
    state.internships = internships
  },
  TOGGLE_SUBMITTING_JOB(state, flag) {
    state.isSubmittingJob = flag
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
      .$post('/api/internship', internshipForm)
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
    dispatch('getInternships')
  },
  async getInternships({ commit, state }) {
    const response = await this.$axios.$get(
      `/api/users/${state.auth.user.id}/internships`
    )
    response.forEach((element, index, response) => {
      response[index].internship_desc =
        element.internship_desc.replace(/\r?\n|\r/g, ' ').slice(0, 40) + '...'
    })
    await commit('SET_INTERNSHIPS', response)
  },
}
