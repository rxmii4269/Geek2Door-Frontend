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
      <b-navbar-item
        v-if="$auth.loggedIn"
        class="is-flex is-flex-direction-column is-size-7"
        tag="router-link"
        to="/messages"
      >
        <div class="h-24">
          <svg
            id="message--svg"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            style="fill: rgba(255, 255, 255, 1); transform: ; -ms-filter: "
          >
            <path
              d="M20,2H4C2.897,2,2,2.894,2,3.992v12.017C2,17.106,2.897,18,4,18h3v4l6.351-4H20c1.103,0,2-0.894,2-1.992 V3.992C22,2.894,21.103,2,20,2z M11,10c0,1.104-0.896,2-2,2s-2-0.896-2-2s0.896-2,2-2c0.086,0,0.167,0.015,0.25,0.025 C9.332,8.011,9.414,8,9.5,8C10.328,8,11,8.671,11,9.5c0,0.086-0.012,0.168-0.025,0.25C10.985,9.833,11,9.915,11,10z M15,12 c-1.104,0-2-0.896-2-2c0-0.086,0.015-0.167,0.025-0.25C13.012,9.668,13,9.585,13,9.5C13,8.671,13.672,8,14.5,8 c0.086,0,0.168,0.011,0.25,0.025C14.833,8.015,14.914,8,15,8c1.104,0,2,0.896,2,2S16.104,12,15,12z"
            ></path>
          </svg>
          <span
            id="notification-badge"
            class="notification-badge has-text-weight-bold is-hidden"
            ><span
              id="notification-badge--count"
              class="notification-badge--count"
            ></span
          ></span>
        </div>
        <span>Messages</span>
      </b-navbar-item>
      <b-navbar-item v-if="$auth.loggedIn">
        <b-dropdown append-to-body position="is-bottom-left">
          <template #trigger>
            <section class="media">
              <div class="">
                <figure class="image is-32x32">
                  <img
                    class="is-rounded"
                    :src="`${$axios.defaults.baseURL}/images/${$auth.user.profile_picture}`"
                    alt=""
                  />
                </figure>
              </div>
            </section>
          </template>
          <b-dropdown-item has-link>
            <Nuxt-link v-if="$auth.user.id" :to="profile_url"
              >Profile</Nuxt-link
            >
          </b-dropdown-item>
          <b-dropdown-item has-link>
            <b-button
              v-if="$auth.loggedIn"
              type="is-white"
              tag="a"
              @click="$auth.logout()"
              >Logout</b-button
            >
          </b-dropdown-item>
        </b-dropdown>
      </b-navbar-item>
      <b-navbar-item tag="div">
        <div class="buttons">
          <b-button
            v-if="!$auth.loggedIn"
            type="is-white"
            size="is-small"
            tag="router-link"
            to="/accounts/signup"
          >
            Get Started</b-button
          >

          <b-button
            v-if="!$auth.loggedIn"
            tag="router-link"
            to="/accounts/login"
            type="is-white"
            size="is-small"
            >Log in</b-button
          >
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      route: this.$auth.loggedIn ? '/home' : '/',
    }
  },
  computed: {
    ...mapState(['profile_url']),
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
.navbar-item .logo {
  max-height: 3.35rem;
}
.navbar-brand > .navbar-item {
  padding-top: 0;
  padding-bottom: 0;
}

.notification-badge {
  position: absolute;
  top: 0;
  bottom: 0;
  background-color: var(--light-pink);
  display: inline-flex;
  border-bottom-left-radius: 50%;
  border-top-left-radius: 50%;
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
  height: 19px;
  font-size: 0.8125rem;
  line-height: 1;
  min-width: 19px;
  z-index: 1;
}

.notification-badge--count {
  color: var(--white);
  justify-content: center;
  padding-top: 0;
  padding-bottom: 0;
  padding-left: 5px;
  padding-right: 5px;
  display: inline-flex;
  height: 100%;
  width: 100%;
  align-items: center;
}

@media screen and (min-width: 1024px) {
  #message--svg {
    fill: #ffffff !important;
  }
}

#message--svg {
  fill: #000000;
}

.h-24 {
  height: 24px;
}

.is-rounded {
  border-radius: 50%;
}

.navbar-item img {
  max-height: unset;
}
</style>
