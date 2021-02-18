<template>
  <div>
    <b-steps type="is-pink" size="is-medium">
      <b-step-item step="1" label="Account" icon="account-key" clickable>
        <div class="center">
          <div class="box">
            <h1 class="is-size-2 has-text-centered is-capitalized">
              Sign Up FreeLancer
            </h1>
            <SignUpForm ref="signUpForm" @formData="getFormData" />
          </div>
        </div>
      </b-step-item>
      <b-step-item step="2" label="Experience"></b-step-item>
      <template #navigation="{ previous, next }">
        <div class="buttons is-justify-content-center">
          <b-button
            :disabled="previous.disabled"
            @click.prevent="previous.action"
            >Previous</b-button
          >
          <b-button :disabled="next.disabled" @click.prevent="next.action"
            >Next</b-button
          >
        </div>
      </template>
    </b-steps>
  </div>
</template>
<script>
export default {
  transitions: 'fade',
  scrollToTop: true,
  auth: false,
  data() {
    return {
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
