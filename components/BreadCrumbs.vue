<template>
  <div class="level ml-6">
    <nav class="breadcrumb is-pulled-left" aria-label="breadcrumbs">
      <ul>
        <li v-for="(item, i) in crumbs" :key="i" :class="item.classes">
          <nuxt-link :to="item.to">
            {{ item.title }}
          </nuxt-link>
        </li>
      </ul>
    </nav>
  </div>
</template>
<script>
import startCase from 'lodash/startCase'
export default {
  computed: {
    crumbs() {
      const pathArray = this.$route.path.split('/')
      pathArray.shift()
      const crumbs = pathArray.reduce((breadcrumbArray, path, idx) => {
        if (path) {
          breadcrumbArray.push({
            to: breadcrumbArray[idx - 1]
              ? '/' + breadcrumbArray[idx - 1].path + '/' + path
              : '/' + path,

            title: startCase(path),
          })
        }

        return breadcrumbArray
      }, [])
      if (crumbs[0].title !== 'Home') {
        crumbs.splice(0, 0, {
          to: '/home',
          title: startCase('Home'),
        })
      }

      const classes = crumbs[crumbs.length - 1] ? 'is-active' : ''
      crumbs[crumbs.length - 1].classes = classes
      return crumbs
    },
  },
}
</script>
