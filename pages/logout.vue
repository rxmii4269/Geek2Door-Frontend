<template>
  <section class="hero is-pink is-medium">
    <div class="hero-body">
      <h1 class="title">Logged Out Successfully</h1>
      <h2 class="subtitle">Redirecting to login page</h2>
    </div>
  </section>
</template>
<script>
export default {
  mounted() {
    const self = this
    setTimeout(function () {
      self.$auth.logout()
      self.$auth.strategy.token.reset()
    }, 1000)
  },
}
</script>
