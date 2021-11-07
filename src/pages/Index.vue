<template>
  <q-page>
    <q-dialog
      ref="dialogRef"
      v-model="showDialog"
      seamless
      position="bottom"
    >
      <q-card
        class="q-pa-md"
        :style="{ minWidth: screenWidth + 'px', minHeight: '200px'}"
      >
        <q-btn
          flat
          round
          :icon="matClose"
          class="close-button"
          @click="showDialog = false"
        />

        <div
          class="row justify-left items-center"
          style="width: 100%;"
        >
          <div class="column q-pa-md">
            <q-icon
              :name="currentPath"
              :size="store.iconSize"
              class="q-pa-xs col-1"
              :class="colorClasses"
              style="max-width: 130px; min-width: 80px;"
            />
          </div>
          <div class="column q-gutter-sm">
            <div
              class="col row"
              style="max-height: 32px;"
            >
              <p
                class="font-mono"
                style="font-size: 28px;"
              >
                {{ currentName }}
              </p>
              <q-icon
                size="xs"
                name="mdi-content-copy"
                color="grey-13"
                @click="onCopyName(currentPath, currentName)"
              >
                <q-tooltip>Copy name to clipboard</q-tooltip>
              </q-icon>
            </div>
            <q-btn
              no-caps
              size="sm"
              outline
              rounded
              style="max-width: 150px;"
              class="col"
              @click="onHandleCart(currentPath, currentName)"
            >
              <div class="full-width row justify-between items-center">
                <q-icon
                  :name="cartButtonIcon"
                  size="sm"
                />
                {{ cartButtonLabel }}
              </div>
            </q-btn>
            <div class="col row">
              <div
                v-for="color in colors"
                :key="color"
                :class="colorClass(color)"
                style="width: 20px; height: 20px;"
                @click.stop="changeColor(color)"
                @mouseenter.stop="changeColor(color)"
              />
            </div>
            <q-toggle
              v-model="inverted"
              label="Invert colors"
            />
          </div>
        </div>
      </q-card>
    </q-dialog>

    <div :class="headerClasses">
      <div class="row justify-center items-center col-md-4 col-sm-12">Totals: {{ filteredCount }}/{{ iconCount }}</div>
      <q-input
        v-model="filter"
        borderless
        dense
        outlined
        debounce="300"
        clearable
        placeholder="Search"
        class="col-md-4 col-sm-12"
        style="margin: 2px; max-width: 280px; width: 100%;"
      >
        <template #append>
          <q-icon
            v-if="!filter"
            name="mdi-card-search-outline"
          />
        </template>
      </q-input>
    </div>

    <q-separator class="q-mb-xs" />

    <template v-if="Object.keys(icons).length">
      <svg-icon-viewer
        :icons="icons"
        @selected="onSelected"
      />
    </template>

    <div class="icons-footer" />

    <q-page-scroller
      expand
      position="bottom"
      :scroll-offset="150"
      :offset="[0, 0]"
    >
      <div class="col cursor-pointer q-pa-sm text-center glass">
        <q-icon
          name="mdi-chevron-up"
          size="lg"
        />
      </div>
    </q-page-scroller>
  </q-page>
</template>

<script>
import { defineComponent, markRaw, ref, computed, watch, nextTick } from 'vue'
import { useQuasar, copyToClipboard } from 'quasar'
import { iconSets } from 'src/icon-sets'
import { useStore } from 'assets/store.js'
import { matClose, matAdd } from '@quasar/extras/material-icons'
import SvgIconViewer from '../components/Icons.vue'

export default defineComponent({
  name: 'MainPage',

  components: {
    SvgIconViewer
  },

  setup () {
    const store = useStore(),
      importedIcons = ref(null),
      filter = ref(''),
      dialogRef = ref(null),
      showDialog = ref(false),
      currentPath = ref(''),
      currentName = ref(''),
      isInCart = ref(false),
      inverted = ref(false),
      textColor = ref('black'),
      $q = useQuasar(),
      colors = [
        'black',
        'red', 'pink', 'purple', 'deep-purple', 'indigo',
        'blue', 'light-blue', 'cyan', 'teal', 'green',
        'light-green', 'lime', 'yellow', 'amber', 'orange',
        'deep-orange', 'brown', 'grey', 'blue-grey'
      ]

    const screenWidth = computed(() => {
      return $q.screen.width - 15 // scrollbars
    })

    const headerClasses = computed(() => {
      return ($q.screen.lt.sm ? 'column' : 'row')
        + ' justify-center items-center q-pa-xs'
    })

    const colorClasses = computed(() => {
      let color = ''
      let bgColor = 'bg-white'
      if (inverted.value) {
        color += 'bg-' + textColor.value
        bgColor = 'text-white'
      }
      else {
        color += 'text-' + textColor.value
      }
      if (textColor.value !== 'black') color += '-8'
      return color + ' ' + bgColor
    })

    const icons = computed(() => {
      const vals = {}
      const f = filter.value && importedIcons.value ? filter.value.toLowerCase() : ''
      Object.keys(importedIcons.value ? importedIcons.value : {}).forEach(name => {
        if (f === '' || name.toLowerCase().indexOf(f) > -1) {
          vals[ name ] = importedIcons.value[ name ]
        }
      })
      return vals
    })

    const filteredCount = computed(() => {
      return Object.keys(icons.value).length
    })

    const iconCount = computed(() => {
      return importedIcons.value ? Object.keys(importedIcons.value).length : 0
    })

    const cartButtonLabel = computed(() => {
      if (isInCart.value !== true) {
        return 'Add to cart'
      }
      return 'Remove from cart'
    })

    const cartButtonIcon = computed(() => {
      if (isInCart.value !== true) {
        return matAdd
      }
      return matClose
    })

    watch (currentName, val => {
      isInCart.value = store.findItem(val) > -1
    })

    watch(() => store.iconSet, val => {
      if (!val) {
        importedIcons.value = null
        return
      }

      const now = new Date()
      if (val.packageName === '@quasar/extras') {
        import(
          /* webpackChunkName: "[request]" */
          /* webpackInclude: /index\.js$/ */
          /* webpackExclude: /(mdi-v4|ionicons-v4)/ */
          '@quasar/extras/' + val.value
        ).then(async svgFile => {
          importedIcons.value = markRaw(svgFile)
          console.log(`${ val.value } Load (ms):`, new Date() - now)
          await nextTick()
          console.log(`${ val.value } Render (ms):`, new Date() - now)
        })
      }
      else if (val.packageName === 'quasar-extras-svg-icons') {
        import(
          /* webpackChunkName: "[request]" */
          /* webpackInclude: /index\.js$/ */
          'quasar-extras-svg-icons/' + val.value
        ).then(async svgFile => {
          importedIcons.value = markRaw(svgFile)
          console.log(`${ val.value } Load (ms):`, new Date() - now)
          await nextTick()
          console.log(`${ val.value } Render (ms):`, new Date() - now)
        })
      }
    })

    watch(showDialog,  val => {
      if (!val) {
        textColor.value = 'black'
      }
    })

    function colorClass (color) {
      let newColor = 'bg-' + color
      if (color !== 'black') newColor += '-8'
      if (textColor.value === color) {
        newColor += ' active-color'
      }
      return newColor
    }

    function changeColor (color) {
      textColor.value = color
    }

    // function hasChild (scope) {
    //   return scope.opt.children.some(c => store.iconSet && c.value === store.iconSet)
    // }

    function onSelected ({ path, name }) {
      currentPath.value = path
      currentName.value = name
      showDialog.value = true
    }

    function onClickDialog (path, name) {
      copyToClipboard(name)
        .then(() => {
          $q.notify({
            message: `'${ name }' copied to clipboard`,
            position: 'top',
            icon: path,
            color: 'white',
            textColor: 'primary'
          })
          // showDialog.value = false
        })
    }

    function onCopyName (path, name) {
      copyToClipboard(name)
        .then(() => {
          $q.notify({
            message: `'${ name }' copied to clipboard`,
            position: 'top',
            icon: path,
            color: 'white',
            textColor: 'primary'
          })
          // showDialog.value = false
        })
    }

    function onCopySvg (path, name) {
      copyToClipboard(path)
        .then(() => {
          $q.notify({
            message: `'${ name }' SVG copied to clipboard`,
            position: 'top',
            icon: path,
            color: 'white',
            textColor: 'primary'
          })
          // showDialog.value = false
        })
    }

    function onHandleCart (path, name) {
      if (isInCart.value === true) {
        isInCart.value = !store.removeItem(name)
        return
      }
      isInCart.value = store.addItem(name, path)
    }

    return {
      store,
      iconSets,
      // importedIcons,
      filter,
      dialogRef,
      showDialog,
      currentPath,
      currentName,
      headerClasses,
      colorClasses,
      cartButtonLabel,
      cartButtonIcon,
      textColor,
      colors,
      inverted,
      filteredCount,
      iconCount,
      icons,
      screenWidth,
      matClose,
      colorClass,
      changeColor,
      onSelected,
      onClickDialog,
      onCopyName,
      onCopySvg,
      onHandleCart
    }
  }
})
</script>

<style lang="sass">
.active-color
  border: 1px dashed white

.close-button
  position: absolute
  top: 0
  right: 0

</style>
