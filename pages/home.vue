<template>
  <div class="container">
    <div class="columns is-8">
      <div class="column is-3">
        <div class="card">
          <div class="card-content">
            <div class="content">Hello These are your recommended Jobs:</div>
          </div>
        </div>
        <b-button @click="$auth.refreshTokens()">Refresh</b-button>
      </div>
      <div class="column is-9">
        <div class="columns">
          <InternshipPost />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  // mounted() {
  //   if (this.$store.state.auth.user) {
  //     this.$buefy.snackbar.open({
  //       duration: 8000,
  //       message: `Logged in Successfully. Welcome, ${this.$store.state.auth.user.name}`,
  //       type: 'is-success',
  //       position: 'is-bottom',
  //     })
  //   }
  // },
}
</script>
