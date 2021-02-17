<template>
  <div>
    <h1 class="">Logged Out Successfully</h1>
  </div>
</template>
<script>
export default {
  created() {
    this.$auth.logout()
    this.$auth.strategy.token.reset()
  },
}
</script>
