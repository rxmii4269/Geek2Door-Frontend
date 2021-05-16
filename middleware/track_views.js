export default function ({ $axios, $auth }) {
  try {
    if ($auth.loggedIn && $auth.user.role === 'student') {
      $axios.onRequest((config) => {
        if (
          config.url.includes('/api/internships') &&
          !config.url.includes('views')
        ) {
          const internshipId = config.url.split('/')[3]
          if (internshipId) {
            $axios.post(`/api/internships/${internshipId}/views`, {
              increment: 1,
              student_id: $auth.user.id,
            })
          }
        }
      })
    }
  } catch (error) {
    console.error(error)
  }
}
