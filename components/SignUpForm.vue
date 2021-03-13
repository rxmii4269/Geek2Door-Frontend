<template>
  <div>
    <ValidationObserver
      ref="signUpObserver"
      v-slot="{ handleSubmit }"
      tag="form"
      method="post"
      slim
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

      <b-button type="is-pink" expanded @click="handleSubmit(userLogin)"
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
        dob: '',
        number: '',
        name: '',
        userType: this.userType,
      },
    }
  },
}
</script>
