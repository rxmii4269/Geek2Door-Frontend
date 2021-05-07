export default function ({ $axios, $auth }) {
  try {
    if ($auth.loggedIn && $auth.user.role === 'student') {
      $axios.onRequest((config) => {
        if (
          config.url.includes('/api/internships') &&
          !config.url.includes('views')
        ) {
          const internshipId = config.url.split('/')[3]
          console.log(internshipId)
          $axios.post(`/api/internships/${internshipId}/views`, {
            increment: 1,
            student_id: $auth.user.id,
          })
          console.log('Making request to ' + config.url)
        }
      })
    }
  } catch (error) {
    console.error(error)
  }
}
