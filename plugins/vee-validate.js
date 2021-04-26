import { extend, setInteractionMode } from 'vee-validate'
import { required } from 'vee-validate/dist/rules'
import * as rules from 'vee-validate/dist/rules'
import { messages } from 'vee-validate/dist/locale/en.json'
// let response = ''
setInteractionMode('eager')
extend('required', required)

Object.keys(rules).forEach((rule) => {
  extend(rule, {
    // eslint-disable-next-line import/namespace
    ...rules[rule],
    message: messages[rule],
  })
})
