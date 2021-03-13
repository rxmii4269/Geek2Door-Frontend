<template>
  <div class="center">
    <div class="box">
      <h1 class="is-size-4 has-text-centered is-capitalized">I want to</h1>
      <b-field>
        <b-radio-button
          v-model="userType"
          type="is-pink"
          name="company"
          native-value="company"
          expanded
        >
          <span>Hire</span>
        </b-radio-button>
        <b-radio-button
          v-model="userType"
          type="is-pink"
          name="student"
          native-value="student"
          expanded
        >
          <span>Work</span>
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
