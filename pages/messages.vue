<template>
  <Inbox :current-user="currentUser" />
</template>
<script>
export default {
  data() {
    return {
      currentUser: this.$auth.user,
    }
  },
}
</script>
