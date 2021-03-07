<template>
  <div>
    <h1 class="moveword"></h1>
    <div>
      <img
        src="@/assets/img/list.svg"
        alt="picture_showing_lists"
        class="fhomepic"
      />
    </div>
    <br />
    <div class="column">
      <h1 class="is-size-3 is-capitalized">
        Is this service only for students?
      </h1>
      <span>
        But wait, we don't only offer services to students, we welcome companies
        as well. With Geek2Door we encourage businesses to post their internship
        opportunities on our site and let us do the searching for you. We will
        ensure that the persons that fit the job you posted are provided to you
        as a top priority with your option to choose. The possibilities are
        endless with Geek2Door.
      </span>
    </div>
    <div>
      <img
        src="@/assets/img/lookup.svg"
        alt="picture_showing_lists"
        class="fhomepic2"
      />
    </div>
  </div>
</template>
<script>
export default {
  auth: false,
  middleware({ store, redirect }) {
    if (store.state.auth.loggedIn) {
      return redirect('/home')
    }
  },
  data() {
    return {}
  },
}
</script>
<style>
.fhomepic {
  height: 350px;
  width: 350px;
}

.fhomepic2 {
  height: 350px;
  width: 350px;
}

.moveword {
  text-align: center;
  font-size: 200%;
}

.makebold {
  font-weight: bold;
}

.arange2 {
  padding-left: 250px;
  font-size: 1.125rem;
  text-align: left;
}
</style>
