<template>
  <div :class="classes">
    <div class="full-width row justify-center items-center q-gutter-sm q-pa-sm">
      <div
        v-for="iconSet in store.relatedIconSets"
        :key="iconSet"
      >
        <q-btn
          :to="{ name: 'icons', params: { iconSet } }"
          :label="iconSet"
          :disable="iconSet === store.iconSet.value"
          rounded
          dense
          unelevated
          no-caps
          size="sm"
          color="primary"
          style="min-width: 140px;"
        />
      </div>
    </div>
    <q-separator />
  </div>
</template>

<script>
import { defineComponent, computed, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { iconSets } from 'src/icon-sets'
import { useStore } from 'assets/store.js'

export default defineComponent({
  name: 'RelatedIconSets',

  setup () {
    const store = useStore()
    const $route = useRoute()

    function isObject (obj) {
      return obj === Object(obj);
    }

    function isArray (arr) {
      return arr && Array.isArray(arr) && arr.constructor === Array
    }

    // HMR messes with this number if not initialized here
    store.totalIcons = 0

    const classes = computed(() => {
      let k = 'q-pa-xs related'
      if (store.relatedIconSets.length > 0) {
        k += ' related--visible'
      }
      return k
    })


    return {
      store,
      classes
    }
  }
})
</script>

<style lang="sass">
.related
  height: 0
  transition: height 0.5s

  &--visible
    height: auto
</style>
