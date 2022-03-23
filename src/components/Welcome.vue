<template>
  <div
    class="column justify-center items-start q-ma-md"
  >
    <!-- eslint-disable vue/html-indent -->
    <q-markdown>
Welcome to the Icon Explorer app. The icons you can explore come from the [@quasar/extras](https://github.com/quasarframework/quasar/tree/dev/extras) and [quasar-extras-svg-icons](https://github.com/hawkeye64/quasar-extras-svg-icons) packages.

Click the **Help** tab above to get information on how to use this app.
    </q-markdown>
    <!-- eslint-enable vue/html-indent -->
    <div
      class="row justify-start full-width"
      style="font-size: 14px;"
    >
      <!-- eslint-disable vue/html-indent -->
      <q-markdown style="max-width: 80%;">
::: tip
To get back to this page at any time, just click the **Icon Explorer** icon in the top header bar.
:::
      </q-markdown>
      <!-- eslint-enable vue/html-indent -->
    </div>
  </div>
</template>

<script>


export default {
  name: 'Welcome',
  setup () {
    return {
    }
  }
}
</script>
