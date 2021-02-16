<template>
  <div class="center">
    <div class="mt-3 box">
      <LoginForm />
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {}
  },
  methods: {
    clearIconClick() {
      this.email = ''
    },
  },
}
</script>

<style>
.center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.box {
  border-radius: 10px;
  background-color: var(--white);
  padding: 3rem;
}
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
