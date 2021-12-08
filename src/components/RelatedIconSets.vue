<template>
  <div :class="classes">
    <div class="full-width row justify-center items-center q-gutter-sm q-pa-sm">
      <div
        v-for="iconSet in relatedIconSets"
        :key="iconSet"
      >
        <q-btn
          :to="{ name: 'icons', params: { iconSet } }"
          :label="iconSet"
          :disable="iconSet === store.iconSet?.value"
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

    // contains a listing of all icon names
    const iconNames = reactive({})

    function isObject (obj) {
      return obj === Object(obj);
    }

    function isArray (arr) {
      return arr && Array.isArray(arr) && arr.constructor === Array
    }

    // HMR messes this number if not initialized here
    store.totalIcons = 0

    iconSets.map(iconPackage => {
      iconPackage.children.forEach(iconSet => {
        if (iconSet?.icons === true) {
          if (iconPackage.label === '@quasar/extras') {
            import(
              /* webpackChunkName: "[request]" */
              /* webpackInclude: /icons\.json$/ */
              /* webpackExclude: /(mdi-v4|mdi-v5|ionicons-v4|ionicons-v5)/ */
              '@quasar/extras/' + iconSet.value + '/icons.json'
            ).then(async jsonFile => {
              if (!isObject(iconNames[ iconPackage.label ])) iconNames[ iconPackage.label ] = {}
              if (!isArray(iconNames[ iconPackage.label ][ iconSet.value ])) iconNames[ iconPackage.label ][ iconSet.value ] = []
              Object.keys(jsonFile).forEach(key => {
                store.totalIcons++
                iconNames[ iconPackage.label ][ iconSet.value ].push(jsonFile[ key ])
              })
            })
          }
          if (iconPackage.label === 'quasar-extras-svg-icons') {
            import(
              /* webpackChunkName: "[request]" */
              /* webpackInclude: /icons\.json$/ */
              'quasar-extras-svg-icons/' + iconSet.value + '/icons.json'
            ).then(async jsonFile => {
              if (!isObject(iconNames[ iconPackage.label ])) iconNames[ iconPackage.label ] = {}
              if (!isArray(iconNames[ iconPackage.label ][ iconSet.value ])) iconNames[ iconPackage.label ][ iconSet.value ] = []
              Object.keys(jsonFile).forEach(key => {
                store.totalIcons++
                iconNames[ iconPackage.label ][ iconSet.value ].push(jsonFile[ key ])
              })
            })
          }
        }
      })
    })

    const classes = computed(() => {
      let k = 'q-pa-xs related'
      if (relatedIconSets.value.length > 0) {
        k += ' related--visible'
      }
      return k
    })

    const relatedIconSets = computed(() => {
      const related = []
      const filt = store.filter || $route.query?.filter
      if (filt && filt.length >= 3) {
        const f = filt.toLowerCase()
        Object.keys(iconNames).forEach(pkg => {
          Object.keys(iconNames[ pkg ] ).forEach(iconSet => {
            Object.keys(iconNames[ pkg ][ iconSet ]).every(iconIndex => {
              const icon = iconNames[ pkg ][ iconSet ][ iconIndex ]
              if (String(icon).toLowerCase().indexOf(f) > -1) {
                related.push(iconSet)
                return false // 'every' stops on first false
              }
              return true
            })
          })
        })
      }
      return related
    })

    return {
      store,
      relatedIconSets,
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
