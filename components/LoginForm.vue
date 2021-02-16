<template>
  <div>
    <form method="post" @submit.prevent.stop="userLogin">
      <h1 class="is-size-3 has-text-weight-medium has-text-centered">
        Join Geek2Door
      </h1>
      <div class="is-flex is-flex-direction-column mt-2">
        <b-field label="Email">
          <b-input
            v-model="form.email"
            type="email"
            custom-class="green"
            icon-pack="bx"
            icon="bxs-envelope"
            icon-right="bx-user-circle"
            size="is-medium"
          ></b-input>
        </b-field>

        <b-field label="Password">
          <b-input
            v-model="form.password"
            type="password"
            custom-class="green"
            size="is-medium"
            icon="lock"
            password-reveal
          ></b-input>
        </b-field>
        <b-button
          tag="input"
          native-type="submit"
          type="is-success"
          outlined
          expanded
          value="Continue"
        ></b-button>
      </div>
    </form>
    <div class="divider">Or</div>
    <button
      class="button facebook has-text-white mb-2 is-fullwidth"
      @click="loginWithFacebook"
    >
      Sign in with Facebook
    </button>
    <button
      class="google button has-text-white is-fullwidth mb-2"
      @click="loginWithGoogle"
    >
      Sign in with Google
    </button>
    <button
      class="button is-fullwidth github has-text-white"
      @click="loginWithGithub"
    >
      Sign in with Github
    </button>
  </div>
</template>
<script>
export default {
  data: () => {
    return {
      form: {
        email: '',
        password: '',
      },
    }
  },
  methods: {
    async loginWithFacebook() {
      await this.$auth.loginWith('facebook')
    },
    loginWithGoogle() {
      this.$auth.loginWith('google', { params: { prompt: 'select_account' } })
    },
    loginWithGithub() {
      this.$auth.loginWith('github')
    },
    async userLogin() {
      const response = await this.$auth.loginWith('local', { data: this.form })
      console.log(response)
    },
  },
}
</script>
<style>
.facebook {
  background-color: #4267b2;
  border-color: #4267b2;
  background-image: url('~assets/f_logo_RGB-White_1024.svg');
  background-size: 20px;
  background-position: top 10px left 10px;
  background-repeat: no-repeat;
}
.facebook:focus {
  border-color: #4267b2;
  box-shadow: 0 0 0 0.125em rgba(66 103 178/25%);
}
.google {
  background-color: #4285f4;
  background-image: url('~assets/btn_google_light_normal_ios.svg');
  background-size: 32px;
  background-position: top 3px left 4px;
  background-repeat: no-repeat;
}
.github {
  background-color: #2f363d;
  background-image: url('~assets/GitHub-Mark-Light-64px.png');
  background-size: 20px;
  background-position: top 10px left 10px;
  background-repeat: no-repeat;
}
</style>
