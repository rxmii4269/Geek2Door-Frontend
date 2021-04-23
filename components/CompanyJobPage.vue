<template>
  <b-tabs>
    <b-tab-item label="Applied">
      <div class="columns is-multiline">
        <StudentCard
          v-for="student in applied"
          :key="student.id"
          :first-name="student.firstname"
          :last-name="student.lastname"
          :email="student.email"
          :profile-picture="student.profile_picture"
          :role="student.role"
          :skills="student.skills"
          :username="student.username"
        />
      </div>
    </b-tab-item>
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
