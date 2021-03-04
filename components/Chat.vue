<template>
  <div
    id="talkjs-container"
    class="chatbox-container"
    :class="{ 'is-hidden': this.hidden }"
  ></div>
</template>
<script>
export default {
  data() {
    return {
      hidden: true,
    }
  },
  methods: {},
}
</script>
<style>
.chatbox-container {
  position: fixed;
  bottom: 0;
  height: 400px;
  right: 5%;
  width: 300px;
}
</style>
