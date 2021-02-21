<template>
  <div class="center">
    <div class="box">
      <h1 class="is-size-4 has-text-centered is-capitalized">I want to</h1>
      <b-field>
        <b-radio-button
          v-model="userType"
          type="is-pink"
          name="recruiter"
          native-value="recruiter"
          expanded
        >
          <span>Hire</span>
        </b-radio-button>
        <b-radio-button
          v-model="userType"
          type="is-pink"
          name="freelancer"
          native-value="freelancer"
          expanded
        >
          <span>Work</span>
        </b-radio-button>
      </b-field>
      <SignUpForm :user-type="userType" />
    </div>
  </div>
</template>
<script>
export default {
  auth: false,
  data() {
    return {
      userType: 'recruiter',
    }
  },
}
</script>
