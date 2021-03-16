<template>
  <div>
    <ValidationObserver
      ref="signUpObserver"
      v-slot="{ handleSubmit }"
      tag="form"
      method="post"
    >
      <b-field grouped>
        <ValidationProvider
          v-if="userType == 'student'"
          v-slot="{ errors, valid }"
          slim
          rules="required"
          name="First Name"
        >
          <b-field
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
            :message="errors"
            label="First Name"
            expanded
          >
            <b-input v-model="form.firstname"></b-input>
          </b-field>
        </ValidationProvider>
        <ValidationProvider
          v-if="userType == 'student'"
          v-slot="{ errors, valid }"
          slim
          rules="required"
          name="Last Name"
        >
          <b-field
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
            :message="errors"
            label="Last Name"
            expanded
          >
            <b-input v-model="form.lastname"></b-input>
          </b-field>
        </ValidationProvider>
      </b-field>
      <ValidationProvider
        v-if="userType == 'company'"
        v-slot="{ errors, valid }"
        slim
        rules="required"
        name="Company Name"
      >
        <b-field
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors"
          label="Company Name"
          expanded
        >
          <b-input v-model="form.companyName"></b-input>
        </b-field>
      </ValidationProvider>
      <ValidationProvider
        v-slot="{ errors, valid }"
        slim
        rules="required|email"
        name="Email"
      >
        <b-field
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors"
          label="Email"
        >
          <b-input v-model="form.email" type="email"></b-input>
        </b-field>
      </ValidationProvider>
      <ValidationProvider
        v-if="userType == 'student'"
        v-slot="{ errors, valid }"
        slim
        rules="required"
        name="Date of Birth"
      >
        <b-field
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors"
          label="Date of birth"
        >
          <b-datepicker
            v-model="form.dob"
            icon="calendar-today"
            locale="en-US"
            editable
          ></b-datepicker>
        </b-field>
      </ValidationProvider>
      <ValidationProvider
        v-slot="{ errors, valid }"
        slim
        :rules="{
          required: true,
          regex: '^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$',
        }"
        name="Phone Number"
      >
        <b-field
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors"
          label="Phone Number"
        >
          <b-input v-model="form.number"></b-input>
        </b-field>
      </ValidationProvider>
      <ValidationProvider
        v-if="userType == 'student'"
        v-slot="{ errors, valid }"
        slim
        rules="required|usernameCheck"
        name="Username"
      >
        <b-field
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors"
          label="Username"
        >
          <b-input v-model="form.username"></b-input>
        </b-field>
      </ValidationProvider>
      <b-field>
        <ValidationObserver slim>
          <ValidationProvider
            v-slot="{ errors, valid }"
            slim
            rules="required|confirmed:Confirm|min:8"
            name="Password"
          >
            <b-field
              :type="{ 'is-danger': errors[0], 'is-success': valid }"
              label="Password"
              :message="errors"
              expanded
            >
              <b-input v-model="form.password" type="password"></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors, valid }"
            slim
            rules="required"
            name="Confirm"
            vid="Confirm"
          >
            <b-field
              :type="{ 'is-danger': errors[0], 'is-success': valid }"
              label="Confirm Password"
              :message="errors"
              expanded
            >
              <b-input
                v-model="form.confirm_password"
                type="password"
              ></b-input>
            </b-field>
          </ValidationProvider>
        </ValidationObserver>
      </b-field>

      <b-button type="is-pink" expanded @click="handleSubmit(userSignUp)"
        >Continue</b-button
      >
    </ValidationObserver>
    <div class="divider" style="font-family: Lato !important">
      Already Joined Geek2Door?
    </div>
    <b-button tag="router-link" to="login" type="is-pink" expanded outlined
      >Log In</b-button
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
  props: {
    userType: {
      type: String,
      default: 'student',
    },
  },
  data() {
    return {
      form: {
        firstname: '',
        lastname: '',
        email: '',
        username: '',
        password: '',
        confirm_password: '',
        dob: new Date(),
        number: '',
        name: '',
        companyName: '',
        userType: this.userType,
      },
    }
  },
  methods: {
    async userSignUp() {
      const isValid = await this.$refs.signUpObserver.validate()
      if (isValid) {
        await this.$axios
          .$post('/auth/register', this.form)
          .then((response) => {
            console.log(response)

            const loginData = {
              email: this.form.email,
              password: this.form.password,
              userType: this.form.userType,
            }
            console.log(loginData)
            this.$auth.loginWith('local', { data: loginData }).then(() => {
              this.$router.push(`/users/${this.form.username}`)
            })
          })
          .catch((error) => {
            console.error(error)
          })
      }
    },
  },
}
</script>
