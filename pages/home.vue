<template>
  <div></div>
</template>
<script>
export default {
  mounted() {
    if (this.$store.state.auth.user) {
      this.$buefy.snackbar.open({
        duration: 8000,
        message: `Logged in Successfully. Welcome, ${this.$store.state.auth.user.name}`,
        type: 'is-success',
        position: 'is-bottom',
      })
    }
  },
}
</script>
