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
    <div v-else class="is-flex is-justify-content-center">
      <div class="pdf">
        <iframe
          height="100%"
          width="100%"
          :src="pdfSrc"
          frameborder="0"
        ></iframe>
      </div>
    </div>
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
    return {
      currentPage: 0,
      pageCount: 0,
    }
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
      const filename = this.filename.split('.')
      const filetype = filename.slice(-1)[0]
      if (filetype === 'pdf') {
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
<style>
.is-large.modal-close {
  background-color: #7a7a7a !important;
}
.pdf {
  width: 100%;
  height: 100vh;
  min-width: 400px;
}
</style>
