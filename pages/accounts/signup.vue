<template>
  <div class="center">
    <div class="box">
      <h1
        class="is-size-3 has-text-centered has-text-weight-medium is-capitalized"
      >
        Who are you?
      </h1>
      <b-field expanded>
        <b-radio-button
          v-model="userType"
          type="is-pink"
          name="company"
          native-value="company"
          expanded
        >
          <span>Company</span>
        </b-radio-button>
        <b-radio-button
          v-model="userType"
          type="is-pink"
          name="student"
          native-value="student"
          expanded
        >
          <span>Student</span>
        </b-radio-button>
      </b-field>
      <SignUpForm :key="userType" :user-type="userType" />
    </div>
  </div>
</template>
<script>
export default {
  auth: false,
  data() {
    return {
      userType: 'company',
    }
  },
}
</script>
