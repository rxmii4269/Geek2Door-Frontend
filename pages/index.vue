<template>
  <div>
    <img src="@/assets/img/baloons.svg" alt="baloons" />
  </div>
</template>
<script>
export default {
  auth: false,
  middleware({ store, redirect }) {
    if (store.state.auth.loggedIn) {
      return redirect('/home')
    }
  },
  data() {
    return {}
  },
}
</script>
