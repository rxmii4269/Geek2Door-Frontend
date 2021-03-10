<template>
  <div class="container">
    <div class="columns">
      <div class="column is-full">
        <div class="columns">
          <div class="column">
            <img
              src="@/assets/img/list.svg"
              alt="picture_showing_lists"
              class="fhomepic"
            />
          </div>
          <div class="column">
            <h1 class="is-size-3 is-capitalized info_left">
              What is an Internship you may ask?
            </h1>
            <span class="info_left">
              Well, let us introduce you to a world fill with possibilities,
              somewhere you can find that one place you fit in even if you don't
              know it as yet. An internship is the position of a student or
              trainee who works in an organization, this more than often happens
              without pay. However, with Geek2Door we offer paid internship to
              every student in the field they are competent in, we even suggest
              jobs you never knew you even had the chance doing, but guess what,
              we suggest it you should try it.
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column is-full">
        <div class="columns">
          <div class="column">
            <h1 class="is-size-3 is-capitalized">
              Is this service only for students?
            </h1>
            <span>
              We don't only offer services to students, we welcome companies as
              companies as well. With Geek2Door we encourage businesses to post
              their internship opportunities on our site and let us do the
              searching for you. We will ensure that the persons that fit the
              job you posted are provided to you as a top priority with your
              option to choose. The possibilities are endless with Geek2Door.
            </span>
          </div>
          <div class="column">
            <img
              src="@/assets/img/lookup.svg"
              alt="picture_showing_lists"
              class="fhomepic2 is-pulled-right"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column is-full">
        <div class="columns">
          <div class="column">
            <img
              src="@/assets/img/signup.svg"
              alt="picture_showing_lists"
              class="fhomepic"
            />
          </div>
          <div class="column">
            <h1 class="is-size-3 is-capitalized">Excited Yet?</h1>
            <span class="info_left">
              Interested in an Internship? Want to get new Interns? Sign up
              <NuxtLink to="/accounts/signup"> TODAY </NuxtLink> and let the
              experience start.
            </span>
          </div>
        </div>
      </div>
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
/* }
.info_left {
  padding-left: ;
} */
</style>
