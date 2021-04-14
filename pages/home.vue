<template>
  <div class="container">
    <StudentHomePage v-if="$auth.user.role === 'student'" />
    <CompanyHomePage v-else />
  </div>
</template>
