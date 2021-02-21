<template>
  <b-navbar
    wrapper-class="container"
    close-on-click
    type="is-dark"
    shadow
    class="has-text-white"
  >
    <template #brand>
      <b-navbar-item tag="router-link" class="" :to="route">
        <img
          src="@/assets/img/facebook_cover_photo_1_fullpic.png"
          alt="logo"
          class="logo"
        />
        Geek<span class="large2 pink">2</span>Door
      </b-navbar-item>
    </template>

    <template #end>
      <b-navbar-item v-if="$auth.loggedIn" tag="router-link" to="/messages"
        >Messages<sup><i class="bx bx-message-dots"></i></sup
      ></b-navbar-item>
      <b-navbar-item tag="div">
        <div class="buttons">
          <b-button
            v-if="!$auth.loggedIn"
            type="is-white"
            tag="router-link"
            to="/accounts/signup"
            >Get Started</b-button
          >

          <b-button
            v-if="!$auth.loggedIn"
            tag="router-link"
            to="/accounts/login"
            type="is-white"
            >Log in</b-button
          >
          <b-button v-else tag="router-link" to="/logout" type="is-white"
            >Logout</b-button
          >
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>
<script>
export default {
  data() {
    return {
      route: this.$auth.loggedIn ? '/home' : '/',
    }
  },
  methods: {},
}
</script>
<style>
.large2 {
  color: var(--sea-green);
  font-size: 1.6rem;
}
.bg-green {
  background-color: var(--midnight-green-eagle-green);
}
.pink {
  color: var(--light-pink);
}
a.navbar-item:hover {
  color: #000000;
}
.navbar-item img {
  max-height: 3.35rem;
}
.navbar-brand > .navbar-item {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
