<template>
  <b-modal full-screen :active="isActive" @update:active="toggleModal($event)">
    <iframe
      v-if="fileType === 'docx'"
      :src="url"
      frameborder="0"
      height="100%"
      width="100%"
    >
      This is an embedded
      <a target="_blank" href="http://office.com">Microsoft Office</a> document,
      powered by
      <a target="_blank" href="http://office.com/webapps">Office Online</a>.
    </iframe>
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
      return `https://view.officeapps.live.com/op/embed.aspx?src=${this.$config.axios.browserBaseURL}/api/document/${this.filename}`
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
<style scoped>
.is-large.modal-close {
  background-color: #7a7a7a !important;
}
</style>
