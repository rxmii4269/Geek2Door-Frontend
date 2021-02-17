<template>
  <div>
    <b-steps type="is-pink">
      <b-step-item step="1" label="Account" clickable>
        <h1 class="title has-text-centered">Account</h1>
        <div class="center">
          <div class="box">
            <h1 class="is-size-2 has-text-centered is-capitalized">
              Sign Up Jobrecruiter
            </h1>
            <SignUpForm />
          </div>
        </div>
      </b-step-item>
      <b-step-item step="2" label="Help" clickable></b-step-item>
    </b-steps>
  </div>
</template>
<script>
export default {
  transitions: 'fade',
  scrollToTop: true,
  auth: false,
}
</script>
