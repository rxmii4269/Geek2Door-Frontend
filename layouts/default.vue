<template>
  <div class="is-flex-direction-column is-flex h-100">
    <Navbar />
    <section
      class="section is-flex-grow-1"
      :class="[$route.name.includes('accounts') ? 'wave' : '']"
    >
      <Nuxt />
    </section>
    <Footer class="is-flex-shrink-1" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      isForm: false,
    }
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
.wave {
  background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 1356 500" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path fill="rgba(121, 87, 213, 1)" d="M 0 500 C 342.5 500 342.5 144 685 144 L 685 144 L 685 0 L 0 0 Z" stroke-width="0"></path> <path fill="rgba(121, 87, 213, 1)" d="M 684 144 C 1020 144 1020 0 1356 0 L 1356 0 L 1356 0 L 684 0 Z" stroke-width="0"></path> </svg>');
  /* background-size: cover; */
  background-repeat: no-repeat;
}

@media (max-width: 1365px) {
  .wave {
    background-size: contain;
  }
}
</style>
