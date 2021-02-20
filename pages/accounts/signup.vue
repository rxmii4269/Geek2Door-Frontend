<template>
  <div class="container box">
    <h1 class="is-size-2 has-text-centered is-capitalized">Sign Up As</h1>
    <b-tabs type="is-toggle" expanded>
      <b-tab-item label="Recruiter">
        <SignUpForm
          ref="signUpForm"
          class="is-flex is-justify-content-center"
          :user-type="userType"
          @formData="getFormData"
        />
      </b-tab-item>
      <b-tab-item label="Freelancer"></b-tab-item>
    </b-tabs>
  </div>
</template>
<script>
export default {
  auth: false,
  data() {
    return {
      userType: '',
      form: '',
    }
  },
  methods: {
    getFormData(params) {
      this.form = params
    },
  },
}
</script>
