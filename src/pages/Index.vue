<template>
  <q-page>
    <q-dialog
      ref="dialogRef"
      v-model="store.showIconDialog"
      seamless
      position="bottom"
    >
      <q-card
        class="q-pa-sm"
        :style="{ minWidth: screenWidth + 'px', minHeight: '200px'}"
      >
        <q-card-section class="row justify-center items-center no-wrap q-pa-sm">
          <div
            class="col row justify-center no-wrap"
          >
            <p
              class="font-mono ellipsis"
              style="font-size: 28px;"
            >
              {{ currentName }}
            </p>
            <q-icon
              size="xs"
              name="mdi-content-copy"
              color="grey-13"
              @click="nameToClipboard"
            >
              <q-tooltip>Copy SVG name to clipboard</q-tooltip>
            </q-icon>
          </div>
          <q-space />
          <q-btn
            flat
            round
            :icon="matClose"
            @click="store.showIconDialog = false"
          />
        </q-card-section>

        <q-card-section class="row items-center no-wrap q-pa-sm">
          <div
            class="row justify-center items-center"
            style="width: 100%;"
          >
            <div class="column q-pa-sm">
              <q-icon
                :name="currentPath"
                :size="store.iconSize"
                class="q-pa-xs col-1"
                :class="colorClasses"
                style="max-width: 200px; min-width: 140px;"
              />
            </div>
            <div class="column justify-start q-gutter-sm q-pa-sm">
              <q-btn
                no-caps
                size="sm"
                flat
                style="max-width: 150px;"
                class="col user-button"
                @click="onHandleCart(currentPath, currentName)"
              >
                <div class="full-width row justify-between items-center ellipsis">
                  <q-icon
                    :name="cartButtonIcon"
                    size="sm"
                  />
                  {{ cartButtonLabel }}
                </div>
              </q-btn>
              <div class="col row bordered">
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

            <div class="column justify-start q-gutter-sm q-pa-sm">
              <div class="col">
                <div>Copy</div>
                <div class="row q-gutter-xs">
                  <q-btn
                    no-caps
                    size="sm"
                    flat
                    class="user-button"
                    @click="nameToClipboard"
                  >
                    <q-tooltip
                      :delay="250"
                      class="primary"
                    >
                      Copy SVG name to clipboard
                    </q-tooltip>
                    Name
                  </q-btn>
                  <q-btn
                    no-caps
                    size="sm"
                    flat
                    class="user-button"
                    @click="inlineToClipboard"
                  >
                    <q-tooltip
                      :delay="250"
                      class="primary"
                    >
                      Copy SVG inlined to clipboard
                    </q-tooltip>
                    Inline
                  </q-btn>
                  <q-btn
                    no-caps
                    size="sm"
                    flat
                    class="user-button"
                    @click="importToClipboard"
                  >
                    <q-tooltip
                      :delay="250"
                      class="primary"
                    >
                      Copy SVG import to clipboard
                    </q-tooltip>
                    Import
                  </q-btn>
                  <q-btn
                    no-caps
                    size="sm"
                    flat
                    class="user-button"
                    @click="qiconToClipboard"
                  >
                    <q-tooltip
                      :delay="250"
                      class="primary"
                    >
                      Copy QIcon with SVG name to clipboard
                    </q-tooltip>
                    QIcon
                  </q-btn>
                  <q-btn
                    no-caps
                    size="sm"
                    flat
                    class="user-button"
                    @click="qbtnToClipboard"
                  >
                    <q-tooltip
                      :delay="250"
                      class="primary"
                    >
                      Copy QBtn with SVG name to clipboard
                    </q-tooltip>

                    QBtn
                  </q-btn>
                  <q-btn
                    no-caps
                    size="sm"
                    flat
                    class="user-button"
                    @click="rawToClipboard"
                  >
                    <q-tooltip
                      :delay="250"
                      class="primary"
                    >
                      Copy raw SVG to clipboard
                    </q-tooltip>

                    Raw
                  </q-btn>
                </div>
              </div>
              <div class="col-auto">
                <!-- other content here -->
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <div
      :class="headerClasses"
      style="position: sticky; top: 50px; left: 0; right: 0; z-index: 2000;"
    >
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

    <div class="q-mb-xs" />

    <template v-if="Object.keys(icons).length">
      <svg-icon-viewer
        :icons="icons"
        :selected-name="currentName"
        @selected="onSelected"
      />
    </template>

    <div class="icons-footer" />

    <q-page-scroller
      expand
      position="bottom-right"
      :scroll-offset="150"
      :offset="[8, 8]"
    >
      <q-btn
        fab
        :icon="matKeyboardArrowUp"
        class="glass"
      />
    </q-page-scroller>
  </q-page>
</template>

<script>
import { defineComponent, markRaw, ref, computed, watch, nextTick } from 'vue'
import { useQuasar, copyToClipboard } from 'quasar'
import { useStore } from 'assets/store.js'
import { matClose, matAdd, matKeyboardArrowUp } from '@quasar/extras/material-icons'
import SvgIconViewer from '../components/SvgIconViewer.vue'

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
      currentPath = ref(''),
      currentName = ref(''),
      inverted = ref(false),
      textColor = ref('black'),
      $q = useQuasar(),
      colors = [
        'black',
        'red', 'pink', 'purple', 'deep-purple', 'indigo',
        'blue', 'light-blue', 'cyan', 'teal', 'green',
        'light-green', 'lime', 'yellow', 'amber', 'orange',
        'deep-orange', 'brown', 'grey', 'blue-grey',
        'white'
      ]

    const screenWidth = computed(() => {
      return $q.screen.width - 15 // scrollbars
    })

    const headerClasses = computed(() => {
      return ($q.screen.lt.sm ? 'column' : 'row')
        + ' justify-center items-center q-pa-xs '
        + ($q.dark.isActive ? '' : 'bg-white')
    })

    const colorClasses = computed(() => {
      let color = '', bgColor = ''
      if (inverted.value) {
        color += 'bg-' + textColor.value
        bgColor += ($q.dark.isActive ? 'text-dark' : 'text-white')
      }
      else {
        color += 'text-' + textColor.value
        bgColor += ($q.dark.isActive ? '' : 'bg-white')
      }
      if (textColor.value !== 'black' && textColor.value !== 'white') color += '-8'
      return color + ' ' + bgColor
    })

    const isInCart = computed(() => {
      return store.isCartIcon(currentName.value)
    })

    // returns a list of filtered icons
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

    // returns a countof all filtered icons
    const filteredCount = computed(() => {
      return Object.keys(icons.value).length
    })

    // returns a count of all loaded icons
    const iconCount = computed(() => {
      return importedIcons.value ? Object.keys(importedIcons.value).length : 0
    })

    // retrns the text to use for "Add to library"/"Remove from library" button
    const cartButtonLabel = computed(() => {
      if (isInCart.value !== true) {
        return 'Add to library'
      }
      return 'Remove from library'
    })

    // retrns the icon to use for "Add to library"/"Remove from library" button
    const cartButtonIcon = computed(() => {
      if (isInCart.value !== true) {
        return matAdd
      }
      return matClose
    })

    // watches iconSet and loads new icons when it changes
    watch(() => store.iconSet, val => {
      importedIcons.value = null

      if (val) {
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
      }

      if(window) {
        window.scrollTo(0, 0)
      }
    })

    watch(() => store.showIconDialog,  val => {
      if (val) store.rightDrawerOpen = false
      else {
        textColor.value = 'black'
      }
    })

    watch(currentName, val => {
      if (!val) {
        store.showIconDialog = false
      }
    })

    watch(() => store.leftDrawerOpen, val => {
      if (val) store.showIconDialog = false
    })

    watch(() => store.rightDrawerOpen, val => {
      if (val) store.showIconDialog = false
    })

    function colorClass (color) {
      let newColor = 'bg-' + color
      if (color !== 'black' && color !== 'white') newColor += '-8'
      if (textColor.value === color) {
        newColor += ' active-color'
      }
      return newColor
    }

    function changeColor (color) {
      textColor.value = color
    }

    // called when user clicks on an icon
    function onSelected ({ path, name }) {
      currentPath.value = path
      currentName.value = name
      store.showIconDialog = true
      store.rightDrawerOpen = false
    }

    // removes or adds item from the cart
    function onHandleCart (path, name) {
      if (store.isCartIcon(name)) {
        store.removeItem(store.iconSet.packageName, store.iconSet.value, name)
        return
      }
      store.addItem(store.iconSet.packageName, store.iconSet.value, name, path)
    }

    // sends requested data to th clipboard with specified message and icon
    function sendToClipboard (data, message, icon) {
      copyToClipboard(data)
        .then(() => {
          $q.notify({
            message: message,
            position: 'top',
            icon: icon,
            color: 'white',
            textColor: 'primary'
          })
        })
    }

    function nameToClipboard () {
      sendToClipboard(currentName.value, `Name: '${ currentName.value }' copied to clipboard`, currentPath.value)
    }

    function rawToClipboard () {
      sendToClipboard(currentPath.value, `Raw: '${ currentName.value }' copied to clipboard`, currentPath.value)

    }

    function inlineToClipboard () {
      const inline = `const ${ currentName.value } = '${ currentPath.value }'`
      sendToClipboard(inline, `Inline: '${ currentName.value }' copied to clipboard`, currentPath.value)
    }

    function importToClipboard () {
      const inline = `import { ${ currentName.value } } from '${ store.iconSet.packageName }/${ store.iconSet.value }'`
      sendToClipboard(inline, `Import: '${ currentName.value }' copied to clipboard`, currentPath.value)
    }

    function qiconToClipboard( ) {
      const inline = `<q-icon :name="${ currentName.value }" />`
      sendToClipboard(inline, `QIcon: '${ currentName.value }' copied to clipboard`, currentPath.value)
    }

    function qbtnToClipboard () {
      const inline = `<q-btn :icon="${ currentName.value }" />`
      sendToClipboard(inline, `QBtn: '${ currentName.value }' copied to clipboard`, currentPath.value)
    }

    return {
      store,
      filter,
      dialogRef,
      currentPath,
      currentName,
      headerClasses,
      colorClasses,
      cartButtonLabel,
      cartButtonIcon,
      colors,
      inverted,
      filteredCount,
      iconCount,
      icons,
      screenWidth,
      matClose,
      matKeyboardArrowUp,
      colorClass,
      changeColor,
      onSelected,
      onHandleCart,
      nameToClipboard,
      rawToClipboard,
      inlineToClipboard,
      importToClipboard,
      qiconToClipboard,
      qbtnToClipboard
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

.user-button
  border-radius: 8px
  border: 1px solid lightgrey

.bordered
  border-radius: 2px
  border: 1px solid rgba(0, 0, 0, 0.4)

.text-dark
  color: #1d1d1d

</style>
