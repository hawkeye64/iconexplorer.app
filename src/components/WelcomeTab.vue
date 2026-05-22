<template>
  <div class="column justify-center items-start q-ma-md">
    <q-markdown :src="welcomeMarkdown" />
    <div class="row justify-start full-width" style="font-size: 14px">
      <q-markdown :src="homeTipMarkdown" style="max-width: 80%" />
    </div>
  </div>
</template>

<script setup lang="ts">
const welcomeMarkdown = `Welcome to the Icon Explorer app. The icons you can explore come from the [@quasar/extras](https://github.com/quasarframework/quasar/tree/dev/extras) and [quasar-extras-svg-icons](https://github.com/hawkeye64/quasar-extras-svg-icons) packages.

Click the **Help** tab above to get information on how to use this app.
`

const homeTipMarkdown = `::: tip
To get back to this page at any time, just click the **Icon Explorer** icon in the top header bar.
:::
`
</script>
