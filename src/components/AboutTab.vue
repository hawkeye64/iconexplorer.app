<template>
  <div class="column justify-center items-start q-ma-md">
    <q-markdown :src="aboutMarkdown" />
  </div>
</template>

<script setup lang="ts">
const aboutMarkdown = `**IconExplorer.app** would like to thank [Quasar Framework](https://quasar.dev) for the excellent tools and components that make this project viable. We would also like to express gratitude to all the icon makers out there for their time and energy in creating icons that everyone can use. And finally, to [Netlify](https://www.netlify.com) for the hosting services.

[![Netlify](https://www.netlify.com/img/global/badges/netlify-color-accent.svg)](https://www.netlify.com)
`
</script>
