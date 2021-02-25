<template>
  <div>
    <ValidationObserver ref="signUpObserver" v-slot="{ handleSubmit }" slim>
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
      <b-field grouped>
        <ValidationProvider v-slot="{ errors, valid }" slim rules="required">
          <b-field
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
            :message="errors"
            label="First Name"
          >
            <b-input v-model="form.firstname"></b-input>
          </b-field>
        </ValidationProvider>
        <ValidationProvider v-slot="{ errors, valid }" slim rules="required">
          <b-field
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
            :message="errors"
            label="Last Name"
          >
            <b-input v-model="form.lastname"></b-input>
          </b-field>
        </ValidationProvider>
      </b-field>
      <ValidationProvider v-slot="{ errors, valid }" slim rules="required">
        <b-field
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors"
          label="Occupation"
          ><b-input v-model="form.occupation"></b-input
        ></b-field>
      </ValidationProvider>
      <b-button type="is-pink" expanded @click="handleSubmit(userLogin)"
        >Continue</b-button
      >
    </ValidationObserver>
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
      default: '',
    },
  },
  data() {
    return {
      form: {
        firstname: '',
        lastname: '',
        email: '',
      },
    }
  },
}
</script>
