<template>
  <b-tabs>
    <b-tab-item label="Applied">
      <div v-if="appliedStudents.length > 0" class="columns is-multiline">
        <StudentCard
          v-for="student in appliedStudents"
          :id="student.id"
          :key="student.id"
          :first-name="student.firstname"
          :last-name="student.lastname"
          :email="student.email"
          :profile-picture="student.profile_picture"
          :role="student.role"
          :skills="student.skills"
          :username="student.username"
          :scores="student.rank"
          :gpa="student.gpa"
          :major="student.major"
          :minor="student.minor"
          :internship-id="parseInt($route.params.id)"
        />
      </div>
      <section v-else class="hero is-primary">
        <div class="hero-body has-text-centered">
          <p class="title">No one Applied</p>
          <b-icon
            class="subtitle is-size-2"
            size="is-large"
            pack="bx"
            icon="bxs-sad"
          ></b-icon>
        </div>
      </section>
    </b-tab-item>
    <b-tab-item label="Haven't Applied">
      <div class="columns is-multiline">
        <StudentCard
          v-for="student in notApplied"
          :id="student.id"
          :key="student.id"
          :first-name="student.firstname"
          :last-name="student.lastname"
          :email="student.email"
          :profile-picture="student.profile_picture"
          :role="student.role"
          :skills="student.skills"
          :username="student.username"
          :scores="student.rank"
          :gpa="student.gpa"
          :major="student.major"
          :minor="student.minor"
          :internship-id="parseInt($route.params.id)"
        />
      </div>
    </b-tab-item>
  </b-tabs>
</template>
<script>
import clonedeep from 'lodash/cloneDeep'
export default {
  props: {
    applied: {
      type: Array,
      default: () => {
        return []
      },
      validator: (prop) => prop.every((e) => typeof e === 'object'),
    },
    notApplied: {
      type: Array,
      default: () => {
        return []
      },
      validator: (prop) => prop.every((e) => typeof e === 'object'),
    },
    ranked: {
      type: Array,
      default: () => {
        return []
      },
      validator: (prop) => prop.every((e) => typeof e === 'object'),
    },
  },
  data() {
    return {
      appliedStudents: clonedeep(this.applied),
      rankedStudents: clonedeep(this.ranked),
    }
  },
  mounted() {
    this.appliedStudents = this.sort()
  },
  methods: {
    sort() {
      return this.appliedStudents.sort(
        (a, b) => b.rank.ranking - a.rank.ranking
      )
    },
  },
}
</script>
