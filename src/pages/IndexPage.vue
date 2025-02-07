<template>
  <q-page>
    <q-dialog
      ref="dialogRef"
      v-model="iconStore.showIconDialog"
      seamless
      position="bottom"
      style="border-top: 1px solid #e1e1e1"
    >
      <q-card class="q-pa-sm" :style="{ minWidth: '100vw', minHeight: '200px' }">
        <q-card-section class="row justify-center items-center no-wrap q-pa-sm">
          <div class="col row justify-center no-wrap">
            <p class="font-mono ellipsis" style="font-size: 28px">
              {{ common.selected }}
            </p>
            <q-icon size="xs" :name="mdiContentCopy" color="grey-13" @click="nameToClipboard">
              <q-tooltip class="primary my-tooltip">
                Copy name "{{ common.selected }}" to clipboard
              </q-tooltip>
            </q-icon>
          </div>
          <q-space class="q-pr-lg" />
          <q-btn flat round :icon="mdiClose" @click="iconStore.showIconDialog = false" />
        </q-card-section>

        <q-card-section class="row no-wrap q-pa-sm">
          <div class="row justify-center" style="width: 100%">
            <div class="q-pa-sm fill">
              <q-icon
                :name="currentPath"
                size="148px"
                class="q-pa-xs fill"
                :class="colorClasses"
                style="max-width: 200px; min-width: 140px"
              />
            </div>
            <div class="justify-start q-gutter-sm q-pa-sm">
              <q-btn
                no-caps
                size="sm"
                flat
                :disable="!currentPath"
                style="min-width: 150px"
                class="col user-button"
                @click="onHandleCart(currentPath, common.selected.value)"
              >
                <div class="full-width row justify-between items-center ellipsis">
                  <q-icon :name="cartButtonIcon" size="sm" />
                  {{ cartButtonLabel }}
                </div>
              </q-btn>
              <div class="col row bordered" style="max-width: 142px">
                <div
                  v-for="color in colors"
                  :key="color"
                  :class="colorClass(color)"
                  style="width: 20px; height: 20px"
                  @click.stop="changeColor(color)"
                />
              </div>
              <q-toggle v-model="inverted" label="Invert colors" />
            </div>

            <div class="row justify-start q-gutter-sm q-pa-sm" style="max-width: 230px">
              <div class="col">
                <div style="font-size: 18px">Copy to clipboard...</div>
                <div class="row q-gutter-xs">
                  <q-btn
                    no-caps
                    size="sm"
                    flat
                    :disable="!currentPath"
                    class="user-button"
                    @click="nameToClipboard"
                  >
                    <q-tooltip :delay="250" class="primary my-tooltip">
                      Copy name "{{ common.selected }}" to clipboard
                    </q-tooltip>
                    Name
                  </q-btn>
                  <q-btn
                    no-caps
                    size="sm"
                    flat
                    :disable="!currentPath"
                    class="user-button"
                    @click="importToClipboard"
                  >
                    <q-tooltip :delay="250" class="primary my-tooltip">
                      Copy "import &#123; {{ common.selected }} &#125; from '{{
                        iconSet.packageName
                      }}/{{ iconSet.value }}'" to clipboard
                    </q-tooltip>
                    Import
                  </q-btn>
                  <q-btn
                    no-caps
                    size="sm"
                    flat
                    :disable="!currentPath"
                    class="user-button"
                    @click="svgToClipboard"
                  >
                    <q-tooltip :delay="250" class="primary my-tooltip">
                      Rehydrate SVG for "{{ common.selected }}" to clipboard
                    </q-tooltip>
                    SVG
                  </q-btn>
                  <q-btn
                    no-caps
                    size="sm"
                    flat
                    :disable="!currentPath"
                    class="user-button"
                    @click="inlineToClipboard"
                  >
                    <q-tooltip :delay="250" class="primary my-tooltip">
                      Copy SVG inlined to clipboard (ex: 'const {{ common.selected }} = "M..."')
                    </q-tooltip>
                    Inline
                  </q-btn>
                  <q-btn
                    no-caps
                    size="sm"
                    flat
                    :disable="!currentPath"
                    class="user-button"
                    @click="qiconToClipboard"
                  >
                    <q-tooltip :delay="250" class="primary my-tooltip">
                      Copy "&lt;q-icon :name="{{ common.selected }}" /&gt;" clipboard
                    </q-tooltip>
                    QIcon
                  </q-btn>
                  <q-btn
                    no-caps
                    size="sm"
                    flat
                    :disable="!currentPath"
                    class="user-button"
                    @click="qbtnToClipboard"
                  >
                    <q-tooltip :delay="250" class="primary my-tooltip">
                      Copy "&lt;q-btn :icon="{{ common.selected }}" /&gt;" clipboard
                    </q-tooltip>
                    QBtn
                  </q-btn>
                  <q-btn
                    no-caps
                    size="sm"
                    flat
                    :disable="!currentPath"
                    class="user-button"
                    @click="rawToClipboard"
                  >
                    <q-tooltip :delay="250" class="primary my-tooltip">
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
      style="position: sticky; top: 50px; left: 0; right: 0; z-index: 2000"
    >
      <div class="row justify-center items-center">
        {{ iconSet.label }} Totals: {{ filteredCount }}/{{ iconCount }}
      </div>
    </div>

    <template v-if="Object.keys(icons).length">
      <SvgIconViewer :icons="icons" :selected-name="selected" @selected="onSelected" />
    </template>
    <div v-else-if="iconStore.searching || iconStore.loading" class="row justify-center">
      <!-- Nothing goes here -->
    </div>
    <div
      v-else-if="common.filter && relatedIconSets.length > 0 && iconStore.searching === false"
      class="row justify-center items-center text-h5 q-ma-md"
    >
      <q-icon :name="mdiHeart" class="text-blue-8" />{{ relatedIconSets.length }} icon sets contain
      "{{ common.filter }}" (select from left drawer to see them)
    </div>
    <div
      v-else-if="common.filter && importedIcons"
      class="row justify-center items-center text-h5 q-ma-md"
    >
      <q-icon :name="mdiHeartBroken" class="text-red-8" />
      No icons found for '{{ iconSet.label }}'
    </div>
    <div v-else class="q-gutter-y-md q-ma-md">
      <q-tabs v-model="tab" align="left">
        <q-tab name="welcome" label="Welcome" />
        <q-tab name="help" label="Help" />
        <q-tab name="about" label="About" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated class="shadow-2 rounded-borders">
        <q-tab-panel name="welcome">
          <welcome />
        </q-tab-panel>

        <q-tab-panel name="help">
          <help />
        </q-tab-panel>

        <q-tab-panel name="about">
          <about />
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <div class="icons-footer" />

    <q-page-scroller expand position="bottom-right" :scroll-offset="150" :offset="[8, 8]">
      <q-btn fab :icon="mdiChevronUp" class="glass" />
    </q-page-scroller>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, markRaw } from 'vue'
import { useQuasar, copyToClipboard } from 'quasar'
import {
  mdiHeartBroken,
  mdiHeart,
  mdiClose,
  mdiPlus,
  mdiChevronUp,
  // mdiArrowCollapseLeft,
  mdiContentCopy,
} from '@quasar/extras/mdi-v7'
import { useIconStore } from 'stores/icon-store'
import { useCommon } from 'assets/useCommon'
import SvgIconViewer from 'components/SvgIconViewer.vue'
import Welcome from 'components/WelcomeTab.vue'
import Help from 'components/HelpTab.vue'
import About from 'components/AboutTab.vue'

const iconStore = useIconStore()
const common = useCommon()
const importedIcons = ref<Record<string, any> | null>(null)
const selected = ref('')
const dialogRef = ref(null)
const currentPath = ref('')
const inverted = ref(false)
const textColor = ref('black')
const $q = useQuasar()
const useDark = ref($q.dark.isActive)
const colors = [
  'black',
  'red',
  'pink',
  'purple',
  'deep-purple',
  'indigo',
  'blue',
  'light-blue',
  'cyan',
  'teal',
  'green',
  'light-green',
  'lime',
  'yellow',
  'amber',
  'orange',
  'deep-orange',
  'brown',
  'grey',
  'blue-grey',
  'white',
]
const tab = ref('welcome')

// const screenWidth = computed(() => {
//   return $q.screen.width - 15 // scrollbars
// })

const defaultIconSet = {
  label: '',
  value: '',
  packageName: '',
}

const iconSet = computed(() => common.iconSet.value || defaultIconSet)
const relatedIconSets = computed(() => common.relatedIconSets.value || [])

const headerClasses = computed(() => {
  return ($q.screen.lt.sm ? 'column' : 'row') + ' justify-center items-center q-pa-xs filter-bar'
})

const colorClasses = computed(() => {
  let color = '',
    bgColor = ''
  if (inverted.value) {
    color += 'bg-' + textColor.value
    bgColor += useDark.value ? 'text-dark' : 'text-white'
  } else {
    color += 'text-' + textColor.value
    bgColor += useDark.value ? '' : 'bg-white'
  }
  if (textColor.value !== 'black' && textColor.value !== 'white') color += '-8'
  return [color, bgColor].join(' ')
})

const isInCart = computed(() => {
  return common.isCartIcon(common.selected.value)
})

const icons = computed(() => {
  const vals: Record<string, any> = {}
  const re = importedIcons.value && common.filter.value ? new RegExp(common.filter.value, 'i') : ''
  if (importedIcons.value) {
    Object.keys(importedIcons.value).forEach((name) => {
      if (re === '' || (re instanceof RegExp && re.test(String(name).replace(/^[a-z]+/, '')))) {
        vals[name] = importedIcons.value![name]
      }
      if (re instanceof RegExp && re.lastIndex) re.lastIndex = 0
    })
  }
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
    return 'Add to library'
  }
  return 'Remove from library'
})

const cartButtonIcon = computed(() => {
  if (isInCart.value !== true) {
    return mdiPlus
  }
  return mdiClose
})

watch(selected, (val) => {
  common.selected.value = val
})

watch(
  () => $q.dark.isActive,
  (val) => {
    useDark.value = val
    textColor.value = val ? 'white' : 'black'
  },
)

watch(
  () => iconSet.value,
  async (val) => {
    importedIcons.value = null

    if (val) {
      const now = new Date().getTime()
      iconStore.loading = true
      if (val.packageName === '@quasar/extras') {
        const modulePath = `../../node_modules/@quasar/extras/${val.value}/index.mjs`
        if (common.extrasModules[modulePath]) {
          const svgFile = await common.extrasModules[modulePath]()
          if (svgFile) {
            importedIcons.value = markRaw(svgFile)
            console.info(`${val.value} Load (ms):`, new Date().getTime() - now)
            await nextTick()
            console.info(`${val.value} Render (ms):`, new Date().getTime() - now)
            iconStore.loading = false
            checkSelectedExists()
          }
        }
      } else if (val.packageName === 'quasar-extras-svg-icons') {
        const modulePath = `../../node_modules/quasar-extras-svg-icons/${val.value}/index.mjs`
        if (common.quasarExtrasSvgIconsModules[modulePath]) {
          const svgFile = await common.quasarExtrasSvgIconsModules[modulePath]()
          if (svgFile) {
            importedIcons.value = markRaw(svgFile)
            console.info(`${val.value} Load (ms):`, new Date().getTime() - now)
            await nextTick()
            console.info(`${val.value} Render (ms):`, new Date().getTime() - now)
            iconStore.loading = false
            checkSelectedExists()
          }
        }
      }
    }

    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)
    }
  },
  { immediate: true },
)

watch(
  () => iconStore.showIconDialog,
  (val) => {
    if (val) {
      // close any right-side drawers
      iconStore.rightDrawerOpen = false
      iconStore.settingsDrawerOpen = false
      textColor.value = $q.dark.isActive ? 'white' : 'black'

      if (!currentPath.value) {
        assignSelected()
      }
    } else {
      // when bottom panel closes, remove selected from route filter
      common.selected.value = ''
    }
  },
)

watch(
  () => common.selected.value,
  (val) => {
    if (!val) {
      iconStore.showIconDialog = false
    }
  },
)

watch(
  () => iconStore.leftDrawerOpen,
  (val) => {
    if (val) iconStore.showIconDialog = false
  },
)

watch(
  () => iconStore.rightDrawerOpen,
  (val) => {
    if (val) {
      iconStore.showIconDialog = false
      iconStore.settingsDrawerOpen = false
    }
  },
)

watch(
  () => iconStore.settingsDrawerOpen,
  (val) => {
    if (val) {
      iconStore.showIconDialog = false
      iconStore.rightDrawerOpen = false
    }
  },
)

function assignSelected(): void {
  for (const key of Object.keys(icons.value)) {
    if (key === common.selected.value) {
      currentPath.value = icons.value[key]
    }
  }
}

function checkSelectedExists(): void {
  let found = false
  for (const key of Object.keys(icons.value)) {
    if (key === common.selected.value) {
      found = true
      break
    }
  }

  if (found) {
    iconStore.showIconDialog = true
  } else {
    common.selected.value = ''
  }
}

function colorClass(color: string): string {
  let newColor = 'bg-' + color
  if (color !== 'black' && color !== 'white') newColor += '-8'
  if (textColor.value === color) {
    newColor += ' active-color'
  }
  return newColor
}

function changeColor(color: string): void {
  textColor.value = color
}

function onSelected({ path, name }: { path: string; name: string }): void {
  currentPath.value = path
  common.selected.value = name
  iconStore.showIconDialog = true
  iconStore.rightDrawerOpen = false
}

function onHandleCart(path: string, name: string): void {
  if (iconSet.value) {
    if (common.isCartIcon(name)) {
      iconStore.removeItem(iconSet.value.packageName, iconSet.value.value, name)
      return
    }
    iconStore.addItem(iconSet.value.packageName, iconSet.value.value, name, path)
  }
}

function sendToClipboard(data: string, message: string, icon: string): void {
  copyToClipboard(data)
    .then(() => {
      $q.notify({
        message: message,
        position: 'top',
        icon: icon,
        color: 'white',
        textColor: 'primary',
      })
    })
    .catch((err) => {
      console.error('Failed to copy to clipboard:', err)
    })
}

type Node = {
  path: {
    d: string
    style?: string
    transform?: string
  }
}

type IconParts = {
  viewBox: string
  nodes: Node[]
}

function splitSvg(icon: string): IconParts {
  const [def, viewBox] = icon.split('|')

  if (!def) {
    throw new Error('Invalid icon format')
  }

  return {
    nodes: def.split('&&').map((path) => {
      const [d = '', style = '', transform = ''] = path.split('@@')
      return { path: { style, d, transform } }
    }),
    viewBox: viewBox !== void 0 ? viewBox : '0 0 24 24',
  }
}

function createSvg(icon: string): string {
  const parts = splitSvg(icon)
  let svg = `<svg viewBox="${parts.viewBox}">\n`
  parts.nodes.forEach((node: Node) => {
    svg +=
      '  ' +
      `<path d="${node.path.d}" ${node.path.style ? 'style="' + node.path.style + '"' : ''} ${node.path.transform ? 'transform="' + node.path.transform + '"' : ''}`.trim() +
      '></path>\n'
  })
  svg += '</svg>\n'

  return svg
}

function nameToClipboard(): void {
  sendToClipboard(
    common.selected.value,
    `Name: '${common.selected.value}' copied to clipboard`,
    currentPath.value,
  )
}

function rawToClipboard(): void {
  sendToClipboard(
    currentPath.value,
    `Raw: '${common.selected.value}' copied to clipboard`,
    currentPath.value,
  )
}

function svgToClipboard(): void {
  const svg = createSvg(currentPath.value)
  sendToClipboard(
    svg,
    `SVG: rehydrated SVG for '${common.selected.value}' copied to clipboard`,
    currentPath.value,
  )
}

function inlineToClipboard(): void {
  const inline = `const ${common.selected.value} = '${currentPath.value}'`
  sendToClipboard(
    inline,
    `Inline: '${common.selected.value}' copied to clipboard`,
    currentPath.value,
  )
}

function importToClipboard(): void {
  const inline = `import { ${common.selected?.value} } from '${iconSet.value?.packageName}/${iconSet.value?.value}'`
  sendToClipboard(
    inline,
    `Import: '${common.selected.value}' copied to clipboard`,
    currentPath.value,
  )
}

function qiconToClipboard(): void {
  const inline = `<q-icon :name="${common.selected.value}" />`
  sendToClipboard(
    inline,
    `QIcon: '${common.selected.value}' copied to clipboard`,
    currentPath.value,
  )
}

function qbtnToClipboard(): void {
  const inline = `<q-btn :icon="${common.selected.value}" />`
  sendToClipboard(inline, `QBtn: '${common.selected.value}' copied to clipboard`, currentPath.value)
}
</script>

<style lang="scss">
.active-color {
  border: 1px dashed white;
}

.close-button {
  position: absolute;
  top: 0;
  right: 0;
}

.user-button {
  border-radius: 8px;
  border: 1px solid lightgrey;
  width: 60px;
  font-size: 18px;
}

.bordered {
  border-radius: 2px;
  border: 1px solid rgba(0, 0, 0, 0.4);
}

.text-dark {
  color: #1d1d1d;
}

.my-tooltip {
  font-size: 18px;
}
</style>
