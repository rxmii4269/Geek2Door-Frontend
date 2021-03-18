<template>
  <div class="is-flex-direction-column is-flex h-100">
    <Navbar />
    <section class="section is-flex-grow-1">
      <Nuxt />
    </section>
    <Footer class="is-flex-shrink-1" />
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  mounted() {
    if (this.$auth.loggedIn) {
      this.$store.dispatch('generateProfileUrl')
    }
  },
}
</script>
<style>
html {
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
html,
body,
* {
  font-family: 'Poppins', 'Lato', 'Roboto' !important;
  -webkit-font-smoothing: antialiased;
}
body {
  color: black;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}
:root {
  --vs-theme-bg2: #eef2f5;
  --alice-blue: #eef2f5ff;
  --white: #ffffffff;
  --midnight-green-eagle-green: #004e64ff;
  --pink: #f95858;
  --light-pink: #fb8a8a;
  --dark: #363636;
}
a {
  text-decoration: none;
}

.h-100 {
  height: 100vh;
}

.bg-pink {
  background-color: var(--pink);
}

.bg-light-pink {
  background-color: var(--light-pink);
}

.center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.b-steps .steps .step-items .step-item.is-pink::before,
.b-steps .steps .step-items .step-item.is-pink::after {
  background: -webkit-gradient(
    linear,
    right top,
    left top,
    color-stop(50%, #dbdbdb),
    color-stop(50%, var(--light-pink))
  );
  background: linear-gradient(to left, #dbdbdb 50%, var(--light-pink) 50%);
  background-size: 200% 100%;
}

.b-steps .steps .step-items .step-item.is-pink.is-active .step-marker {
  background-color: white;
  border-color: var(--light-pink);
  color: var(--light-pink);
}

.b-steps .steps .step-items .step-item.is-pink.is-previous .step-marker {
  color: #fff;
  background-color: var(--light-pink);
}
.box {
  padding: 3rem;
}

.has-text-pink {
  color: var(--light-pink);
}

.is-pink {
  color: var(--light-pink);
}

.hero.is-pink {
  background-color: var(--light-pink);
}

.hero.is-pink .title {
  color: var(--white);
}

.hero.is-pink .subtitle {
  color: var(--white);
}

.button.is-pink {
  background-color: var(--light-pink);
  color: var(--white);
}

.is-pink.is-outlined {
  background-color: var(--white);
  color: var(--light-pink);
}

.is-pink.is-outlined:hover {
  background-color: var(--light-pink);
  color: var(--white);
  border-color: var(--light-pink);
}
</style>
