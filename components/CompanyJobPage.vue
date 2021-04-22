<template>
  <b-tabs>
    <b-tab-item label="Applied"></b-tab-item>
    <b-tab-item label="Haven't Applied"></b-tab-item>
  </b-tabs>
</template>
<script>
export default {
  props: {
    applied: {
      type: Array,
      default: () => {
        return []
      },
      validator: (prop) => prop.every((e) => typeof e === 'object'),
    },
  },
}
</script>
