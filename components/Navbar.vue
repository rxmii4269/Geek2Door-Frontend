<template>
  <b-navbar close-on-click type="is-dark" shadow class="has-text-white">
    <template #brand>
      <b-navbar-item tag="router-link" class="" :to="{ path: '/' }">
        <img
          src="@/assets/img/facebook_cover_photo_1_transparent.png"
          alt=""
          class="mr-2"
        />
        Geek<span class="large2 pink">2</span>Door
      </b-navbar-item>
    </template>
    <template #start>
      <b-navbar-item class="">Hire</b-navbar-item>
      <b-navbar-item class="">Get Hired</b-navbar-item>
    </template>

    <template #end>
      <b-navbar-item tag="div">
        <div class="buttons">
          <a class="button pink">
            <strong>Get Started</strong>
          </a>
          <b-button tag="router-link" to="/accounts/login" type="is-white"
            >Log in</b-button
          >
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>
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
</style>
