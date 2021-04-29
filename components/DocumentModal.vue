<template>
  <b-modal :active="isActive" @update:active="toggleModal($event)">
    <iframe v-if="fileType === 'docx'" :src="url" frameborder="0"></iframe>
    <Pdf v-else :src="pdfSrc" />
  </b-modal>
</template>
<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    filename: {
      type: String,
      default: '',
      required: true,
      validator: typeof filename === 'string',
    },
  },
  data() {
    return {}
  },
  computed: {
    isActive() {
      return this.active
    },
    url() {
      return `https://docs.google.com/gview?url=${this.$config.axios.browserBaseURL}/api/document/${this.filename}&embedded=true`
    },
    pdfSrc() {
      return `${this.$config.axios.browserBaseURL}/api/document/${this.filename}`
    },
    fileType() {
      if (this.filename.split('.')[1] === 'pdf') {
        return 'pdf'
      } else {
        return 'docx'
      }
    },
  },
  methods: {
    toggleModal(value) {
      this.$emit('update:active', value)
    },
  },
}
</script>
