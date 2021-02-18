<template>
  <div>
    <!-- <TalkJsContainer :current-user="this.currentUser" /> -->
  </div>
</template>
<script>
export default {
  auth: false,
  data() {
    return {
      currentUser: {
        id: '21',
        name: 'Romaine',
        email: 'dummy@gmail.com',
        photoUrl: 'https://dummy-img.com/img/1',
      },
    }
  },
}
</script>
