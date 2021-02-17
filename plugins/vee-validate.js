import { extend, setInteractionMode } from 'vee-validate'
import { required, email } from 'vee-validate/dist/rules'

setInteractionMode('eager')
extend('required', {
  ...required,
  message: 'This field is required.',
})

extend('email', email)
