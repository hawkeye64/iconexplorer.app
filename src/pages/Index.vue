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
        :style="{ minWidth: '100vw', minHeight: '200px'}"
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
              :name="mdiContentCopy"
              color="grey-13"
              @click="nameToClipboard"
            >
              <q-tooltip class="primary my-tooltip">
                Copy name "{{ currentName }}" to clipboard
              </q-tooltip>
            </q-icon>
          </div>
          <q-space class="q-pr-lg" />
          <q-btn
            flat
            round
            :icon="mdiClose"
            @click="store.showIconDialog = false"
          />
        </q-card-section>

        <q-card-section class="row no-wrap q-pa-sm">
          <div
            class="row justify-center"
            style="width: 100%;"
          >
            <div class="q-pa-sm fill">
              <q-icon
                :name="currentPath"
                size="148px"
                class="q-pa-xs fill"
                :class="colorClasses"
                style="max-width: 200px; min-width: 140px;"
              />
            </div>
            <div class="justify-start q-gutter-sm q-pa-sm">
              <q-btn
                no-caps
                size="sm"
                flat
                style="min-width: 150px;"
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
              <div
                class="col row bordered"
                style="max-width: 142px;"
              >
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

            <div
              class="row justify-start q-gutter-sm q-pa-sm"
              style="max-width: 230px;"
            >
              <div class="col">
                <div style="font-size: 18px;">Copy to clipboard...</div>
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
                      class="primary my-tooltip"
                    >
                      Copy name "{{ currentName }}" to clipboard
                    </q-tooltip>
                    Name
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
                      class="primary my-tooltip"
                    >
                      Copy "import &#123; {{ currentName }} &#125; from '{{ store.iconSet.packageName }}/{{ store.iconSet.value }}'" to clipboard
                    </q-tooltip>
                    Import
                  </q-btn>
                  <q-btn
                    no-caps
                    size="sm"
                    flat
                    class="user-button"
                    @click="svgToClipboard"
                  >
                    <q-tooltip
                      :delay="250"
                      class="primary my-tooltip"
                    >
                      Rehydrate SVG for "{{ currentName }}" to clipboard
                    </q-tooltip>
                    SVG
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
                      class="primary my-tooltip"
                    >
                      Copy SVG inlined to clipboard (ex: 'const {{ currentName }} = "M..."')
                    </q-tooltip>
                    Inline
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
                      class="primary my-tooltip"
                    >
                      Copy "&lt;q-icon :name="{{ currentName }}" /&gt;" clipboard
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
                      class="primary my-tooltip"
                    >
                      Copy "&lt;q-btn :icon="{{ currentName }}" /&gt;" clipboard
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
                      class="primary my-tooltip"
                    >
                      Copy raw SVG to clipboard (ex: "M...")
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
      <div class="row justify-center items-center">{{ store.iconSet?.label }} Totals: {{ filteredCount }}/{{ iconCount }}</div>
    </div>

    <template v-if="Object.keys(icons).length">
      <svg-icon-viewer
        :icons="icons"
        :selected-name="currentName"
        @selected="onSelected"
      />
    </template>
    <div
      v-else-if="store.searching || store.loading"
      class="row justify-center"
    >
      <!-- Nothing goes here -->
    </div>
    <div
      v-else-if="store.filter && store.relatedIconSets.length > 0 && store.searching === false"
      class="row justify-center items-center text-h5 q-ma-md"
    >
      <q-icon
        :name="mdiHeart"
        class="text-blue-8"
      />{{ store.relatedIconSets.length }} icon sets contain "{{ store.filter }}" (select from left drawer to see them)
    </div>
    <div
      v-else-if="store.filter && importedIcons"
      class="row justify-center items-center text-h5 q-ma-md"
    >
      <q-icon
        :name="mdiHeartBroken"
        class="text-red-8"
      />No icons found for '{{ store.iconSet.label }}'
    </div>
    <div
      v-else
      class="column justify-center items-center text-h5 q-ma-md"
    >
      <div class="row justify-center full-width">
        <div
          class="text-center"
          style="max-width: 80%;"
        >
          <q-icon
            :name="mdiArrowCollapseLeft"
            color="primary"
          />Select an icon set in the left drawer or enter a search filter (top of left drawer)
        </div>
      </div>
      <div
        class="row justify-center full-width"
        style="font-size: 14px;"
      >
        <!-- eslint-disable vue/html-indent -->
        <q-markdown style="max-width: 80%;">
The filter bar accepts regular expressions. For instance, in the simplist form, you can search for a single word, such as "**map**". But, you can do a multiple word search by adding a "**|**" between words. Now, we can seach for "**map|pin**" at the same time. However, you may get false-positives with words like "shop**pin**g" or "s**pin**ner". With regular expressions, you can filter these out. We can create a search like this "**(?!pint|ping|maple)(pin|map)**". The first part (in parentheses) is using a regular expression look-ahead to filter out what we do not want, before looking for what we do want. Words containing "**pint**", "**ping**" or "**maple**" are skipped before looking for "**pin**" and "**map**".
        </q-markdown>
        <!-- eslint-enable vue/html-indent -->
      </div>
    </div>

    <div class="icons-footer" />

    <q-page-scroller
      expand
      position="bottom-right"
      :scroll-offset="150"
      :offset="[8, 8]"
    >
      <q-btn
        fab
        :icon="mdiChevronUp"
        class="glass"
      />
    </q-page-scroller>
  </q-page>
</template>

<script>
import { defineComponent, markRaw, ref, computed, watch, nextTick } from 'vue'
import { useQuasar, copyToClipboard } from 'quasar'
import { mdiHeartBroken, mdiHeart, mdiClose, mdiPlus, mdiChevronUp, mdiArrowCollapseLeft, mdiContentCopy } from '@quasar/extras/mdi-v6'
import { useStore } from 'assets/store.js'
import SvgIconViewer from 'components/SvgIconViewer.vue'

export default defineComponent({
  name: 'MainPage',

  components: {
    SvgIconViewer
  },

  setup () {
    const store = useStore(),
      importedIcons = ref(null),
      dialogRef = ref(null),
      currentPath = ref(''),
      currentName = ref(''),
      inverted = ref(false),
      textColor = ref('black'),
      $q = useQuasar(),
      useDark = ref($q.dark.isActive),
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
        + ' justify-center items-center q-pa-xs filter-bar'
    })

    const colorClasses = computed(() => {
      let color = '', bgColor = ''
      if (inverted.value) {
        color += 'bg-' + textColor.value
        bgColor += (useDark.value ? 'text-dark' : 'text-white')
      }
      else {
        color += 'text-' + textColor.value
        bgColor += (useDark.value ? '' : 'bg-white')
      }
      if (textColor.value !== 'black' && textColor.value !== 'white') color += '-8'
      return [ color, bgColor ].join(' ')
    })

    const isInCart = computed(() => {
      return store.isCartIcon(currentName.value)
    })

    // returns a list of filtered icons
    const icons = computed(() => {
      const vals = {}
      const re = importedIcons.value && store.filter ? new RegExp(store.filter, 'i') : ''
      Object.keys(importedIcons.value ? importedIcons.value : {}).forEach(name => {
        // the regex removes the prefix for more accurate matching
        if (re === '' || re.test(String(name).replace(/^[a-z]+/, ''))) {
          vals[ name ] = importedIcons.value[ name ]
        }
        if (re.lastIndex) re.lastIndex = 0
      })
      return vals
    })

    // returns a count of all filtered icons
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
        return mdiPlus
      }
      return mdiClose
    })

    watch(() => $q.dark.isActive, val => {
      useDark.value = val
      textColor.value = val ? 'white' : 'black'
    })

    // watches iconSet and loads new icons when it changes
    watch(() => store.iconSet, val => {
      importedIcons.value = null

      if (val) {
        const now = new Date()
        store.loading = true
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
            store.loading = false
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
            store.loading = false
          })
        }
      }

      if (process.env.CLIENT) {
        window.scrollTo(0, 0)
      }
    }, { immediate: true })

    watch(() => store.showIconDialog,  val => {
      if (val) {
        store.rightDrawerOpen = false
        store.settingsDrawerOpen = false
      }
      else {
        textColor.value = $q.dark.isActive ? 'white' : 'black'
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
      if (val) {
        store.showIconDialog = false
        store.settingsDrawerOpen = false
      }
    })

    watch(() => store.settingsDrawerOpen, val => {
      if (val) {
        store.showIconDialog = false
        store.rightDrawerOpen = false
      }
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

    function splitSvg (icon) {
        const [ def, viewBox ] = icon.split('|')

        return {
          nodes: def.split('&&').map(path => {
            const [ d, style, transform ] = path.split('@@')
            return { path: {
              style,
              d,
              transform
            } }
          }),
          viewBox: viewBox !== void 0 ? viewBox : '0 0 24 24'
        }
    }

    function createSvg(icon) {
      icon = splitSvg(icon)
      let svg = `<svg viewBox="${ icon.viewBox }">\n`
      icon.nodes.forEach(node => {
        svg += '  ' + (`<path d="${ node.path.d }" ${ node.path.style ? 'style="' + node.path.style + '"' : '' } ${ node.path.transform ? 'transform="' + node.path.transform + '"' : '' }`).trim() + '></path>\n'
      })
      svg += '</svg>\n'

      return svg
    }

    function nameToClipboard () {
      sendToClipboard(currentName.value, `Name: '${ currentName.value }' copied to clipboard`, currentPath.value)
    }

    function rawToClipboard () {
      sendToClipboard(currentPath.value, `Raw: '${ currentName.value }' copied to clipboard`, currentPath.value)
    }

    function svgToClipboard () {
      const svg = createSvg(currentPath.value)
      sendToClipboard(svg, `SVG: rehydrated SVG for '${ currentName.value }' copied to clipboard`, currentPath.value)
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
      importedIcons,
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
      mdiClose,
      mdiChevronUp,
      mdiHeartBroken,
      mdiHeart,
      mdiArrowCollapseLeft,
      mdiContentCopy,
      colorClass,
      changeColor,
      onSelected,
      onHandleCart,
      nameToClipboard,
      svgToClipboard,
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
  width: 60px
  font-size:18px 

.bordered
  border-radius: 2px
  border: 1px solid rgba(0, 0, 0, 0.4)

.text-dark
  color: #1d1d1d

.my-tooltip
  font-size: 18px

</style>
