<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'
import { provideStore } from 'assets/store.js'

export default defineComponent({
  name: 'App',

  setup () {
    const { loadStore } = provideStore()
    loadStore()
  }
})
</script>
