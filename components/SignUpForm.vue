<template>
  <div>
    <ValidationObserver
      ref="signUpObserver"
      v-slot="{ handleSubmit }"
      tag="form"
      method="post"
    >
      <b-field v-if="userType == 'student'" grouped group-multiline>
        <ValidationProvider
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
            <b-input
              v-model="form.firstname"
              placeholder="e.g. John"
              expanded
            ></b-input>
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
            <b-input
              v-model="form.lastname"
              placeholder="e.g. Doe"
              expanded
            ></b-input>
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
          <b-input
            v-model="form.company_name"
            placeholder="e.g. Big Corp"
            expanded
          ></b-input>
        </b-field>
      </ValidationProvider>
      <ValidationProvider
        v-if="userType == 'company'"
        v-slot="{ errors, valid }"
        slim
        rules="required"
        name="Company Description"
      >
        <b-field
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors"
          label="Company Description"
          expanded
        >
          <b-input
            v-model="form.company_desc"
            type="textarea"
            maxlength="200"
            placeholder="e.g. General company Description"
            expanded
          ></b-input>
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
          expanded
        >
          <b-input
            v-model="form.email"
            type="email"
            placeholder="e.g. example@example.com.gov"
            expanded
          ></b-input>
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
          expanded
        >
          <b-datepicker
            v-model="form.dob"
            icon="calendar-today"
            locale="en-US"
            editable
            expanded
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
          expanded
        >
          <b-input
            v-model="form.number"
            placeholder="e.g. 876-478-578"
            expanded
          ></b-input>
        </b-field>
      </ValidationProvider>
      <ValidationProvider
        v-if="userType == 'student'"
        v-slot="{ errors, valid }"
        slim
        rules="required"
        name="Username"
      >
        <b-field
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors"
          label="Username"
          expanded
        >
          <b-input
            v-model="form.username"
            placeholder="e.g. John.Doe"
            expanded
          ></b-input>
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
              <b-input
                v-model="form.password"
                type="password"
                expanded
              ></b-input>
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
                expanded
              ></b-input>
            </b-field>
          </ValidationProvider>
        </ValidationObserver>
      </b-field>

      <b-button type="is-pink" expanded @click="handleSubmit(userSignUp)"
        >Continue</b-button
      >
    </ValidationObserver>
    <div class="divider">Already Joined Geek2Door?</div>
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
        company_name: '',
        company_desc: '',
        userType: this.userType,
      },
    }
  },
  methods: {
    async userSignUp() {
      const isValid = await this.$refs.signUpObserver.validate()
      if (isValid) {
        await this.$axios
          .$post('/api/auth/register', this.form)
          .then((response) => {
            const loginData = {
              email: this.form.email,
              password: this.form.password,
              userType: this.form.userType,
            }
            this.$auth.loginWith('local', { data: loginData }).then(() => {
              this.$store.dispatch('generateProfileUrl')
              if (this.userType === 'student') {
                this.$router.push(`/student/${this.form.username}`)
              } else {
                this.$router.push(`/company/${this.form.company_name}`)
              }
            })
          })
          .catch((error) => {
            this.$buefy.notification.open({
              duration: 3000,
              type: 'is-danger is-light',
              message: error,
              hasIcon: true,
            })
            console.error(error)
          })
      }
    },
  },
}
</script>
