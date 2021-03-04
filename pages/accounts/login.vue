<template>
  <div class="center">
    <div class="box">
      <h1 class="is-size-3 has-text-weight-medium has-text-centered">
        Join Geek2Door
      </h1>
      <LoginForm />
    </div>
  </div>
</template>

<script>
export default {
  transitions: 'login',
  data: () => {
    return {}
  },
  mounted() {},
  methods: {
    clearIconClick() {
      this.email = ''
    },
  },
}
</script>

<style>
.is-right.icon.has-text-primary {
  color: #dbdbdb !important;
}
.is-right.icon.has-text-primary {
  color: #dbdbdb;
}
.icon.is-right.has-text-danger > .mdi {
  color: inherit;
}

.green:focus {
  border-color: var(--sea-green);
  box-shadow: 0 0 0 0.125em rgb(56 134 89 / 25%);
}
.content-inputs {
  flex-direction: column;
}
</style>
<style scoped>
.box {
  padding-left: 2rem;
  padding-right: 2rem;
}
</style>
