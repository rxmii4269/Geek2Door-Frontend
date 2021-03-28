export const state = () => ({
  profile_url: '',
  profileData: '',
  updatedProfileData: '',
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
}
