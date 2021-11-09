<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'
import { provideStore } from 'assets/store.js'

export default defineComponent({
  name: 'App',

  setup () {
    provideStore()
  }
})
</script>
