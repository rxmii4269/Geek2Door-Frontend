<template>
  <div>
    <ValidationObserver slim>
      <ValidationProvider slim rules="required">
        <b-field
          slot-scope="{ errors, valid }"
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors"
          label="Full Name"
        >
          <b-input v-model="form.fullname"></b-input>
        </b-field>
      </ValidationProvider>
      <ValidationProvider slim rules="required">
        <b-field
          slot-scope="{ errors, valid }"
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors"
          label="Occupation"
          ><b-input v-model="form.occupation"></b-input
        ></b-field>
      </ValidationProvider>
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
  data() {
    return {
      form: {
        fullname: '',
      },
    }
  },
}
</script>
