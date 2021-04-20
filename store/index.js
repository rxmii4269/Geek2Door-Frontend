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
  isSavingInternship: false,
  newInternship: null,
  activeStep: 0,
  internships: [],
  appliedInternships: [],
  internshipPageInfo: [],
  allInternships: [],
  allStudents: [],
  totalWeight: 100,
  weights: {
    qualificationWeight: 0,
    gpaWeight: 0,
    skillsWeight: 0,
  },
  skillsList: [],
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
  qualifications2: (state) => {
    return state.newInternship.qualifications.join('\n') || ''
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
  SET_ALL_STUDENTS(state, students) {
    state.allStudents = students
  },
  SET_NEW_INTERNSHIP(state, internshipData) {
    state.newInternship = internshipData
  },
  SET_GPA(state, value) {
    state.newInternship.minimum_gpa = value
  },
  SET_RESPONSIBILITIES(state, value) {
    state.newInternship.responsibilities = value
  },
  SET_OTHER(state, value) {
    state.newInternship.qualifications = value
  },
  SET_DIPLOMA(state, value) {
    state.newInternship.diploma = value
  },
  SET_JOB_TITLE(state, value) {
    state.newInternship.job_title = value
  },
  SET_SKILLS(state, value) {
    state.newInternship.skills = value
  },
  POPULATE_SKILL_WEIGHT(state, length) {
    state.skillsList = [...Array(length).keys()]
  },
  SET_SKILLS_LIST_VALUE(state, val) {
    state.skillsList[val.index] = val.divideEvenly
  },
  SET_WEIGHT(state, update) {
    state.weights[update.key] = update.splitEvenly
  },
  SET_TOTAL_WEIGHT(state, newWeight) {
    state.totalWeight = newWeight
  },
  SET_DESCRIPTION(state, newDescription) {
    state.newInternship.description = newDescription
  },
  REMOVE_SKILL(state, index) {
    state.newInternship.skills.splice(index, 1)
    state.skillsList.splice(index, 1)
  },
  ADD_SKILL(state) {
    state.newInternship.skills.push('skill')
    state.skillsList.push(state.skillsList.length)
  },
  SET_APPLIED_INTERNSHIPS(state, appliedInternships) {
    state.appliedInternships = appliedInternships
  },
  INCREMENT_STEP(state) {
    state.activeStep++
  },
  DECREMENT_STEP(state) {
    state.activeStep--
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
  TOGGLE_SAVE_INTERNSHIP(state) {
    state.isSavingInternship = !state.isSavingInternship
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
    try {
      const response = await this.$axios.$post('/api/upload', internshipForm, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (typeof response.analysis.description === 'undefined') {
        response.analysis.description = ''
      }
      const hardSkills = response.analysis.required_hard_skills
      const softSkills = response.analysis.required_soft_skills
      const concatSkills = hardSkills.concat(softSkills)
      response.analysis.skills = concatSkills
      commit('TOGGLE_SUBMITTING_JOB', false)
      await dispatch('calculateTotalWeight')
      Notification.open({
        duration: 3000,
        message: 'Job Order Uploaded Successfully',
        position: 'is-top-right',
        type: 'is-success is-light',
        hasIcon: true,
      })
      commit('INCREMENT_STEP')
      commit('SET_NEW_INTERNSHIP', response.analysis)
      commit('POPULATE_SKILL_WEIGHT', state.newInternship.skills.length)
      await dispatch('divideSkills')
    } catch (error) {
      Notification.open({
        duration: 3000,
        message: error.response.data,
        position: 'is-top-right',
        type: 'is-danger is-light',
        hasIcon: true,
      })
      commit('TOGGLE_SUBMITTING_JOB', false)
    }

    // await dispatch('getInternships', state.auth.user.id)
  },
  async saveInternship({ commit, dispatch, state }) {
    // eslint-disable-next-line no-unused-vars
    const form = {
      totalWeight: state.totalWeight,
      newInternship: state.newInternship,
      weights: state.weights,
      skillsList: state.skillsList,
    }
    commit('TOGGLE_SAVE_INTERNSHIP')
    const response = await this.$axios.$post('/api/internships', form)
    commit('TOGGLE_SAVE_INTERNSHIP')
    console.log(response)
  },
  calculateTotalWeight({ commit, state }) {
    const weightKeys = Object.keys(state.weights)
    const weightlen = weightKeys.length
    const splitEvenly = Math.round((state.totalWeight / weightlen) * 100) / 100
    weightKeys.forEach((key, index) => {
      commit('SET_WEIGHT', { key, splitEvenly })
    })
  },
  recalculateTotalWeight({ commit, state, dispatch }, newWeight) {
    const weightKeys = Object.keys(state.weights)
    const weightlen = weightKeys.length
    const splitEvenly = Math.round((newWeight / weightlen) * 100) / 100
    commit('SET_TOTAL_WEIGHT', newWeight)
    weightKeys.forEach((key, index) => {
      commit('SET_WEIGHT', { key, splitEvenly })
    })
    dispatch('divideSkills')
  },
  recalculateWeight({ commit, state }, newWeight) {
    if (newWeight > state.totalWeight) {
      Notification.open({
        duration: 3000,
        type: 'is-danger',
        position: 'is-top-right',
        message: 'Value cannot be larger than the total weight',
        hasIcon: true,
      })
    }
  },
  calculateQualWeight({ commit, state }, newWeight) {
    const key = 'qualificationWeight'
    const splitEvenly = newWeight
    const cumulWeight =
      newWeight + state.weights.gpaWeight + state.weights.skillsWeight
    console.log(cumulWeight)
    if (newWeight > state.totalWeight) {
      Notification.open({
        duration: 3000,
        type: 'is-danger',
        position: 'is-top-right',
        message: 'Value cannot be larger than the total weight',
        hasIcon: true,
      })
      // splitEvenly = state.weights.qualificationWeight
      // console.log(splitEvenly)
      // commit('SET_WEIGHT', { key, splitEvenly })
    } else if (cumulWeight > state.totalWeight) {
      Notification.open({
        duration: 4000,
        type: 'is-danger',
        position: 'is-top-right',
        message: `The sum of the weight categories is greater than ${state.totalWeight}`,
        hasIcon: true,
      })
    } else if (cumulWeight < state.totalWeight) {
      Notification.open({
        duration: 4000,
        type: 'is-warning',
        position: 'is-top-right',
        message: `The sum of the weight categories is less than ${state.totalWeight}`,
        hasIcon: true,
      })
    }
    commit('SET_WEIGHT', { key, splitEvenly })
  },
  calculateGPAWeight({ commit, state }, newWeight) {
    const key = 'gpaWeight'
    const splitEvenly = newWeight
    const cumulWeight =
      newWeight + state.weights.qualificationWeight + state.weights.skillsWeight
    console.log(cumulWeight)

    if (newWeight > state.totalWeight) {
      Notification.open({
        duration: 3000,
        type: 'is-danger',
        position: 'is-top-right',
        message: 'Value cannot be larger than the total weight',
        hasIcon: true,
      })
      // splitEvenly = state.weights.qualificationWeight
      // console.log(splitEvenly)
      // commit('SET_WEIGHT', { key, splitEvenly })
    } else if (cumulWeight > state.totalWeight) {
      Notification.open({
        duration: 4000,
        type: 'is-danger',
        position: 'is-top-right',
        message: `The sum of the weight categories is greater than ${state.totalWeight}`,
        hasIcon: true,
      })
    } else if (cumulWeight < state.totalWeight) {
      Notification.open({
        duration: 4000,
        type: 'is-warning',
        position: 'is-top-right',
        message: `The sum of the weight categories is less than ${state.totalWeight}`,
        hasIcon: true,
      })
    }
    commit('SET_WEIGHT', { key, splitEvenly })
  },
  calculateSkillsWeight({ commit, state, dispatch }, newWeight) {
    const key = 'skillsWeight'
    const splitEvenly = newWeight
    const cumulWeight =
      newWeight + state.weights.qualificationWeight + state.weights.gpaWeight
    console.log(cumulWeight)

    if (newWeight > state.totalWeight) {
      Notification.open({
        duration: 3000,
        type: 'is-danger',
        position: 'is-top-right',
        message: 'Value cannot be larger than the total weight',
        hasIcon: true,
      })
      // splitEvenly = state.weights.qualificationWeight
      // console.log(splitEvenly)
      // commit('SET_WEIGHT', { key, splitEvenly })
    } else if (cumulWeight > state.totalWeight) {
      Notification.open({
        duration: 4000,
        type: 'is-danger',
        position: 'is-top-right',
        message: `The sum of the weight categories is greater than ${state.totalWeight}`,
        hasIcon: true,
      })
    } else if (cumulWeight < state.totalWeight) {
      Notification.open({
        duration: 4000,
        type: 'is-warning',
        position: 'is-top-right',
        message: `The sum of the weight categories is less than ${state.totalWeight}`,
        hasIcon: true,
      })
    }
    commit('SET_WEIGHT', { key, splitEvenly })
    dispatch('divideSkills')
  },
  deleteSkill({ commit, dispatch }, index) {
    commit('REMOVE_SKILL', index)
    dispatch('divideSkills')
  },
  addSkill({ commit, dispatch }) {
    commit('ADD_SKILL')
    dispatch('divideSkills')
  },
  divideSkills({ commit, state }) {
    const skillsLength = state.newInternship.skills.length
    const divideEvenly = parseFloat(
      (state.weights.skillsWeight / skillsLength).toFixed(3)
    )
    console.log(divideEvenly)

    state.skillsList.forEach((skill, index) => {
      commit('SET_SKILLS_LIST_VALUE', { index, divideEvenly })
    })
  },
  async editSkillWeight({ commit, dispatch, state }, newValue) {
    const index = newValue.index
    const divideEvenly = newValue.event
    await commit('SET_SKILLS_LIST_VALUE', { index, divideEvenly })
    const cumulSkill = state.skillsList.reduce((a, b) => {
      return parseFloat((a + b).toFixed(3))
    })

    console.log(cumulSkill)
    if (cumulSkill > state.weights.skillsWeight) {
      Notification.open({
        duration: 4000,
        type: 'is-warning',
        position: 'is-top-right',
        message: `Cumulative skill weight cannot be greater than ${state.weights.skillsWeight}`,
        hasIcon: true,
      })
    } else if (cumulSkill < state.weights.skillsWeight) {
      Notification.open({
        duration: 4000,
        type: 'is-warning',
        position: 'is-top-right',
        message: `Cumulative skill weight cannot be lesser than ${state.weights.skillsWeight}`,
        hasIcon: true,
      })
    }
    commit('SET_SKILLS_LIST_VALUE', { index, divideEvenly })
    console.log(newValue)
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
  async archivePost({ commit, dispatch, state }, info) {
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
    await dispatch('getInternships', state.auth.user.id)
  },
  async getInternshipPage({ commit }, id) {
    const response = await this.$axios.$get(`/api/internships/${id}`)
    commit('SET_JOB_PAGE_INFO', response)
  },
  async getAllInternships({ commit }) {
    const response = await this.$axios.$get(`/api/internships`)
    response.forEach((element, index, response) => {
      response[index].shortDescription =
        element.description.replace(/\r?\n|\r/g, ' ').slice(0, 100) + '...'
    })
    commit('SET_ALL_INTERNSHIPS', response)
  },
  async applyForInternship({ commit, state, dispatch }, data) {
    commit('TOGGLE_APPLYING_FOR_INTERNSHIP', true)
    await this.$axios.$post(`/api/internships/apply`, data)
    commit('TOGGLE_APPLYING_FOR_INTERNSHIP', false)
    await dispatch('getAppliedInternships')
    Notification.open({
      duration: 3000,
      message: 'Application Sent Successfully',
      position: 'is-top-right',
      type: 'is-success is-light',
      hasIcon: true,
    })
  },
  async deleteInternship({ commit, state, dispatch }, id) {
    await this.$axios.$delete(`/api/internships/${id}`)
  },
  async getAllStudents({ commit, dispatch }) {
    try {
      const response = await this.$axios.$get('/api/users/students')
      commit('SET_ALL_STUDENTS', response)
    } catch (error) {
      Notification.open({
        duration: 3000,
        message: error.response.data.message,
        position: 'is-top-right',
        type: 'is-danger is-light',
        hasIcon: true,
      })
    }
  },
}
