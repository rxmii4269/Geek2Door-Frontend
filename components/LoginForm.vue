<template>
  <div>
    <ValidationObserver ref="observer" v-slot="{ handleSubmit }" slim>
      <form method="post" @submit.prevent.stop="userLogin">
        <div class="is-flex is-flex-direction-column mt-2">
          <ValidationProvider rules="required" name="Email" slim>
            <b-field
              slot-scope="{ errors, valid }"
              label="Email or Username"
              :type="{ 'is-danger': errors[0], 'is-success': valid }"
              :message="errors"
            >
              <b-input
                v-model="form.email"
                type="text"
                custom-class="green"
                icon-pack="bx"
                icon="bxs-envelope"
                icon-right="bx-user-circle"
                size="is-medium"
              ></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="required" slim>
            <b-field
              slot-scope="{ errors, valid }"
              label="Password"
              :type="{ 'is-danger': errors[0], 'is-success': valid }"
              :message="errors"
            >
              <b-input
                v-model="form.password"
                type="password"
                custom-class="green"
                size="is-medium"
                icon="lock"
                password-reveal
              ></b-input>
            </b-field>
          </ValidationProvider>
          <b-button
            type="is-pink"
            tag="input"
            native-type="submit"
            value="Continue"
            expanded
            @click="handleSubmit(userLogin)"
          ></b-button>
        </div>
      </form>
    </ValidationObserver>
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
    <div class="divider">New to Geek2Door?</div>
    <b-button tag="router-link" to="signup" type="is-pink" expanded outlined
      >Sign Up</b-button
    >
  </div>
</template>
<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
export default {
  components: {
    ValidationObserver,
    ValidationProvider,
  },
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
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        this.$auth
          .loginWith('local', { data: this.form })
          .then((response) => {
            if (response.data.error) {
              this.$buefy.toast.open({
                duration: 4000,
                message: `Unable to sign in, ${response.data.error}`,
                type: 'is-danger',
              })
              this.resetForm()
            }
          })
          .catch((e) => {
            this.$buefy.toast.open({
              duration: 4000,
              message: `Unable to sign in due to ${e.message}. Please try again later.`,
              type: 'is-danger',
            })
          })
      }
    },
    resetForm() {
      this.form.email = ''
      this.form.password = ''
      requestAnimationFrame(() => {
        this.$refs.observer.reset()
      })
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
