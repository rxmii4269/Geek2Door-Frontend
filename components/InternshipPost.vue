<template>
  <div class="column is-half">
    <div class="box">
      <div class="media">
        <div class="media-left">
          <figure class="image is-48x48">
            <img
              src="https://bulma.io/images/placeholders/96x96.png"
              alt="Placeholder image"
            />
          </figure>
        </div>
        <div class="media-content">
          <h1 class="is-size-5">{{ position }}</h1>
          <p class="is-size-7">{{ description }}</p>
        </div>
      </div>

      <hr />
      <b-taglist>
        <b-tag v-for="skill in skills" :key="skill.index" type="is-primary">{{
          skill
        }}</b-tag>
      </b-taglist>
      <b-field group-multiline grouped>
        <div class="control">
          <b-taglist attached>
            <b-tag type="is-primary">GPA</b-tag>
            <b-tag type="is-dark">{{ gpa }}</b-tag>
          </b-taglist>
        </div>
        <div v-if="location" class="control">
          <b-taglist attached>
            <b-tag type="is-primary"><i class="bx bxs-map"></i></b-tag>
            <b-tag type="is-dark">{{ location }}</b-tag>
          </b-taglist>
        </div>
      </b-field>

      <div class="is-size-7 is-flex is-flex-direction-row">
        <div class="is-justify-content-start">
          <div>
            <span>Starts:</span>
            <time>{{ startTime }}</time>
          </div>
          <div>
            <span>Ends:</span>
            <time>{{ endTime }}</time>
          </div>
        </div>
        <div class="is-justify-content-end"></div>
      </div>
      <nav class="level">
        <div class="level-left">
          <p class="is-size-7 has-text-grey-light">Views:{{ views }}</p>
        </div>
        <div class="level-right">
          <p class="is-size-7 has-text-grey-light">Applied:{{ applied }}</p>
        </div>
      </nav>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    position: {
      type: String,
      default: '',
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    skills: {
      type: Array,
      default: () => {
        return []
      },
      validator: (prop) => prop.every((e) => typeof e === 'string'),
      required: true,
    },
    location: {
      type: String,
      default: '',
    },
    gpa: {
      type: Number,
      default: 2.75,
      validator: (prop) => typeof prop === 'number',
    },
    startTime: {
      type: String,
      default: () => {
        return new Date().toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      },
      required: true,
    },
    endTime: {
      type: String,
      default: () => {
        return new Date().toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      },
      requried: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    applied: {
      type: Number,
      default: 0,
    },
  },
}
</script>
<style scoped>
.box {
  padding: inherit;
}
</style>
