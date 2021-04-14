<script>
export default {
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    userData: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  computed: {
    propModel: {
      get() {
        return this.isActive
      },
      set(value) {
        this.$emit('update:isActive', value)
      },
      default: false,
    },
    userDataProp: {
      get() {
        return this.userData
      },
    },
  },
  methods: {
    saveProfile() {},
  },
}
</script>
