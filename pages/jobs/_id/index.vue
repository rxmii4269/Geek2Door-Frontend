<template>
  <section class="hero is-primary">JOBS</section>
</template>
<script>
export default {
  data() {
    return {}
  },
  async mounted() {
    await this.$store.dispatch('getInternshipPage', this.$route.params.id)
  },
}
</script>
