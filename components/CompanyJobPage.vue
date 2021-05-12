<template>
  <b-tabs>
    <b-tab-item label="Applied">
      <div class="columns is-multiline">
        <StudentCard
          v-for="student in appliedStudents"
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
        />
      </div>
    </b-tab-item>
    <b-tab-item label="Haven't Applied"></b-tab-item>
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
