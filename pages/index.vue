<template>
  <div class="container mobile tablet">
    <div>
      <div class="mb-6 has-text-centered">
        <h1 class="is-size-2 has-text-weight-semibold">How does it work?</h1>
        <span class="has-text-weight-light"
          >Good Question, this can be answered in 2 simple steps</span
        >
      </div>
      <div class="columns">
        <div class="column is-full">
          <div class="columns">
            <div class="column">
              <img
                src="@/assets/img/intern.svg"
                alt="picture_showing_lists"
                class="fhomepic2 pl-6 ml-6"
              />
            </div>
            <div class="column">
              <h1 class="is-size-3 is-capitalized has-text-right">
                What is an <span class="has-text-pink"> Internship</span>?
              </h1>
              <p class="info_left has-text-justified">
                Let us introduce you to a world fill with possibilities,
                somewhere you can find that one place you fit in even if you
                don't know it as yet. An internship is the position of a student
                or trainee who works in an organization, this more than often
                happens without pay. However, with Geek2Door we offer paid
                internship to every student in the field they are competent in,
                we even suggest jobs you never knew you even had the chance
                doing, but guess what, we suggest it you should try it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column is-full">
        <div class="columns">
          <div class="column mt-6">
            <h1 class="is-size-3 is-capitalized has-text-left">
              Is this service only for
              <span class="has-text-pink">students?</span>
            </h1>
            <p class="info_left has-text-justified">
              We don't only offer services to students, we welcome companies as
              companies as well. With Geek2Door we encourage businesses to post
              their internship opportunities on our site and let us do the
              searching for you. We will ensure that the persons that fit the
              job you posted are provided to you as a top priority with your
              option to choose. The possibilities are endless with Geek2Door.
            </p>
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
              class="fhomepic2"
            />
          </div>
          <div class="column mt-6">
            <h1 class="is-size-3 is-capitalized has-text-right">
              <span class="has-text-pink"> Excited</span> Yet?
            </h1>
            <span class="info_left has-text-justified">
              Interested in an Internship? Want to get new Interns? Sign up
              <NuxtLink to="/accounts/signup" class="is-pink"> TODAY </NuxtLink>
              and let the experience start.
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
.fhomepic2 {
  height: 350px;
  width: 350px;
}

.moveleft {
  padding-left: 200px;
}

.moveright {
  padding-right: 200px;
}
</style>
