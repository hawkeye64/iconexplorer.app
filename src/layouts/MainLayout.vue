<template>
  <q-layout view="lHh LpR lFf">
    <q-header elevated class="glass" style="max-height: 50px">
      <q-toolbar>
        <div>
          <q-btn
            flat
            dense
            round
            :icon="mdiMenu"
            aria-label="Menu"
            @click="toggleLeftDrawer"
          /><q-tooltip class="text-no-wrap">Toggle left-side drawer</q-tooltip>
        </div>

        <q-toolbar-title class="q-pa-none">
          <q-btn to="/" flat no-caps no-wrap class="ellipsis text-no-wrap">
            <div
              class="row justify-left items-center text-no-wrap ellipsis"
              style="max-height: 50px"
            >
              <q-img
                src="/icon-finder-light.png"
                class="app-logo"
                :width="$q.screen.lt.sm ? '28px' : '42px'"
                :height="$q.screen.lt.sm ? '28px' : '42px'"
              />
              <div
                class="column q-pl-sm ellipsis"
                :style="$q.screen.width > 421 ? 'font-size: 1.25rem' : 'font-size: 0.85rem'"
              >
                Icon Explorer&nbsp;
                <span
                  class="text-caption text-weight-bold"
                  :style="
                    ($q.screen.width > 421 ? 'font-size: .8rem;' : 'font-size: .65rem;') +
                    ' max-width: 120px;'
                  "
                >
                  v{{ appVersion }}
                </span>
              </div>
            </div>
            <q-tooltip anchor="bottom left" :offset="[-100, 0]" class="glass">
              <div class="column items-center text-no-wrap">
                <span style="font-size: 18px">{{ iconTotalTooltipText }}</span>
                <span style="font-size: 12px">
                  Generated from installed icon package metadata
                </span>
              </div>
            </q-tooltip>
          </q-btn>
        </q-toolbar-title>

        <div v-if="$q.screen.gt.xs" class="column q-px-sm">
          Quasar <span>v{{ $q.version }}</span>
        </div>

        <div>
          <q-btn
            flat
            round
            :icon="$q.dark.isActive ? mdiBrightness2 : mdiBrightness5"
            @click="$q.dark.toggle()"
          />
          <q-tooltip>Toggle light/dark</q-tooltip>
        </div>

        <div>
          <q-btn
            flat
            round
            :icon="Object.keys(iconStore.cart).length === 0 ? mdiCartOutline : mdiCartHeart"
            :color="Object.keys(iconStore.cart).length === 0 ? 'currentColor' : 'pink-4'"
            @click="toggleRightDrawer"
          />
          <q-tooltip>Your selected library items</q-tooltip>
        </div>

        <div>
          <q-btn
            flat
            dense
            round
            :icon="mdiCog"
            aria-label="Settings"
            @click="toggleSettingsDrawer"
          />
          <q-tooltip>Settings</q-tooltip>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="iconStore.leftDrawerOpen"
      :persistent="searchHasFocus"
      show-if-above
      bordered
    >
      <div class="column no-wrap">
        <div class="glass">
          <form autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false">
            <q-input
              ref="searchInputRef"
              v-model="filter"
              dark
              dense
              square
              borderless
              clearable
              debounce="300"
              placeholder="Search all icon sets..."
              type="search"
              class="full-width icon-search-input"
              @keydown="onSearchKeydown"
              @focus="onSearchFocus"
              @blur="onSearchBlur"
            >
              <template #append>
                <q-icon v-if="!common.filter" :name="uiwSearch" color="grey-1" />
              </template>
            </q-input>
          </form>
        </div>
      </div>
      <q-scroll-area style="height: calc(100% - 51px)">
        <q-list dense class="icon-menu">
          <div
            v-if="common.filter && Array.isArray(common.filter) && common.filter.length > 0"
            class="text-caption text-weight-bold q-ma-md"
            style="font-size: 14px"
          >
            Search results below:
          </div>

          <template v-for="parent in iconSets" :key="parent.label">
            <q-item-label header class="text-caption text-weight-bold" style="font-size: 14px">
              {{ parent.label }} v{{
                parent.label === '@quasar/extras' ? qExtrasVersion : qExtrasSvgVersion
              }}
            </q-item-label>
            <template v-for="child in parent.children" :key="child.label">
              <q-item
                v-if="canDisplay(child)"
                :id="child.value"
                v-ripple
                :to="{ name: 'icons', params: { iconSet: child.value } }"
              >
                <q-item-section>
                  <q-item-label class="q-ml-lg">» {{ child.label }}</q-item-label>
                </q-item-section>
                <q-item-section v-if="child.status" side class="text-right">
                  <q-badge color="blue" text-color="white" :label="child.status" />
                </q-item-section>
              </q-item>
            </template>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-drawer v-model="iconStore.rightDrawerOpen" bordered overlay side="right">
      <q-scroll-area class="fit">
        <div v-if="Object.keys(iconStore.cart).length === 0" class="row justify-center q-ma-lg">
          The library is empty!
        </div>
        <q-list v-else dense>
          <q-item key="onCartRemoveAll">
            <q-item-section> Remove all library items </q-item-section>
            <q-item-section avatar>
              <q-btn :icon="mdiTrashCanOutline" flat round @click="onCartRemoveAllItems" />
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item key="onImportAll" class="q-mt-xs">
            <q-item-section>
              <q-btn label="Imports" no-caps @click="onImportAll">
                <q-tooltip style="font-size: 18px">
                  Copy import statements for all selected icons, grouped by icon set
                </q-tooltip>
              </q-btn>
            </q-item-section>
            <q-item-section>
              <q-btn label="Inline" no-caps @click="onInlinedAll">
                <q-tooltip style="font-size: 18px">
                  Copy inline SVG constants for all selected icons
                </q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
          <q-item
            v-for="icon in selectedIconsFlattened"
            :key="icon.iconName"
            dense
            class="full-width q-mx-none q-px-none"
          >
            <q-item-section avatar>
              <q-icon :name="icon.path" class="cursor-pointer" @click="importToClipboard(icon)">
                <q-tooltip style="font-size: 18px">
                  {{
                    'import &#123; ' +
                    icon.iconName +
                    ' &#125; from ' +
                    "'" +
                    icon.packageName +
                    '/' +
                    icon.iconSet +
                    "'"
                  }}
                </q-tooltip>
              </q-icon>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                <span class="ellipsis">{{ icon.iconName }}</span>
              </q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-icon
                :name="mdiTrashCanOutline"
                class="float-right on-left trash-can cursor-pointer"
                @click="removeIconFromLibrary(icon)"
              />
              <q-tooltip style="font-size: 18px">
                {{ 'Remove ' + icon.iconName + ' from library' }}
              </q-tooltip>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-drawer v-model="iconStore.settingsDrawerOpen" bordered overlay side="right">
      <q-scroll-area class="fit">
        <div class="row justify-center text-h5">Settings</div>

        <q-separator />

        <div class="fit q-pl-sm q-gutter-sm">
          <q-toggle v-model="iconStore.tooltips" label="Tooltips" left-label />
          <q-select
            v-model="iconStore.iconSize"
            label="Box Height"
            :options="[
              '248px',
              '192px',
              '148px',
              '92px',
              '48px',
              '22px',
              'xl',
              'lg',
              'md',
              'sm',
              'xs',
            ]"
            dense
            outlined
          />
          <q-select
            v-model="iconStore.iconColumns"
            label="Columns"
            :options="['responsive', '12', '6', '4', '3', '2', '1']"
            dense
            outlined
          />
        </div>
      </q-scroll-area>
    </q-drawer>

    <q-footer reveal elevated class="glass q-ma-none">
      <div
        class="markdown-page__footer--icons full-width row justify-center items-center q-gutter-sm"
      >
        <a href="https://github.com/hawkeye64" target="_blank" rel="noopener"
          ><q-avatar size="28px"><img src="@/assets/profile.png" /></q-avatar
        ></a>
        <a href="https://github.com/hawkeye64/iconexplorer.app" target="_blank" rel="noopener"
          ><q-icon :name="fabGithub"
        /></a>
        <a href="https://x.com/jgalbraith64" target="_blank" rel="noopener"
          ><q-icon :name="fabXTwitter"
        /></a>
        <a href="https://github.com/sponsors/hawkeye64" target="_blank" rel="noopener"
          ><q-icon :name="mdiCharity"
        /></a>
      </div>
      <div class="full-width row justify-center items-center q-mt-xs markdown-copyright q-mx-sm">
        <div>CC-BY / MIT License</div>
        <div>|</div>
        <div>Copyright &copy; {{ year }} Jeff Galbraith</div>
      </div>

      <div v-if="$q.screen.gt.xs" :class="madeWithClasses">
        <span
          >Made with <q-icon :name="mdiHeart" size="sm" class="text-red-8" /> using
          <a href="https://quasar.dev" target="_blank" class="quasar-link"
            >Quasar Framework</a
          ></span
        >
      </div>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useQuasar, copyToClipboard } from 'quasar'
import { iconSets } from '@/icon-sets'
import { useIconStore } from '@/stores/icon-store'
import { useRouter } from 'vue-router'
import { useCommon, type Icon } from '@/assets/useCommon'
import {
  appBrightnessMoon as mdiBrightness2,
  appBrightnessSun as mdiBrightness5,
  appCartHeart as mdiCartHeart,
  appCartOutline as mdiCartOutline,
  appCharity as mdiCharity,
  appCog as mdiCog,
  appGithub as fabGithub,
  appHeart as mdiHeart,
  appMenu as mdiMenu,
  appPartyPopper as mdiPartyPopper,
  appSearch as uiwSearch,
  appTrashCanOutline as mdiTrashCanOutline,
  appXTwitter as fabXTwitter,
} from '@/assets/app-icons'

import pkg from '@quasar/extras/package.json'
const qExtrasVersion = pkg.version
import pkg2 from 'quasar-extras-svg-icons/package.json'
const qExtrasSvgVersion = pkg2.version
import pkg3 from '../../package.json'
const appVersion = pkg3.version

const year = new Date().getFullYear()
const router = useRouter()
const iconStore = useIconStore()
const $q = useQuasar()
const common = useCommon()
const searchHasFocus = ref(false)
const searchInputRef = ref<HTMLInputElement>()
const filter = ref(common.filter.value)
const displayedTotalIcons = ref(0)
let totalIconsAnimationFrame: number | undefined

const selectedIconsFlattened = computed(() => common.selectedIconsFlattened.value)

const iconTotalTooltipText = computed(() => {
  if (displayedTotalIcons.value <= 0) {
    return 'Counting icons...'
  }

  return `Serving ${displayedTotalIcons.value.toLocaleString()}+ icons`
})

onMounted(() => {
  if ($q.platform.is.desktop === true) {
    window.addEventListener('keypress', focusOnSearch)
  }

  router.beforeEach((to, from) => {
    if (Object.keys(to.query).length === 0 && Object.keys(from.query).length > 0) {
      to.query = { ...from.query }
      return to
    }
  })

  iconStore.loadStore()
  common.loadIconNames().catch(console.error)
})

onBeforeUnmount(() => {
  if ($q.platform.is.desktop === true) {
    window.removeEventListener('keypress', focusOnSearch)
  }

  if (totalIconsAnimationFrame !== undefined) {
    window.cancelAnimationFrame(totalIconsAnimationFrame)
  }
})

watch(
  () => iconStore.totalIcons,
  (target) => {
    animateTotalIcons(target)
  },
  { immediate: true },
)

watch(filter, (val) => {
  if (common.filter.value !== val) {
    common.filter.value = val
  }
})

watch(common.filter, (val) => {
  if (filter.value !== val) {
    filter.value = val
  }
})

watch(selectedIconsFlattened, (/*val*/) => {
  // console.log('Selected icons flattened:', val)
})

const allImports = computed(() => {
  let imports = ''
  for (const packageName in iconStore.cart) {
    for (const iconSet in iconStore.cart[packageName]) {
      const icons = []

      for (const iconName in iconStore.cart[packageName][iconSet]) {
        icons.push(iconName)
      }

      if (icons.length > 0) {
        if (imports) imports += '\n'
        imports += `import { ${icons.join(', ')} } from '${packageName}/${iconSet}'`
      }
    }
  }

  return imports
})

const allInlined = computed(() => {
  let inlined = ''
  for (const packageName in iconStore.cart) {
    for (const iconSet in iconStore.cart[packageName]) {
      for (const iconName in iconStore.cart[packageName][iconSet]) {
        if (inlined) inlined += '\n'
        inlined += `const ${iconName} = '${iconStore.cart[packageName][iconSet][iconName]}'`
      }
    }
  }

  return inlined
})

const madeWithClasses = computed(() => {
  if ($q.screen.lt.lg) {
    return 'full-width row justify-center items-center q-my-xs markdown-copyright'
  }
  return 'made-with markdown-copyright'
})

watch(
  () => iconStore.leftDrawerOpen,
  (val) => {
    if (val === true) {
      setTimeout(() => {
        // set focus on the search filter
        if (searchInputRef.value) {
          searchInputRef.value.focus()
        }
      })
    }
  },
)

function toggleLeftDrawer(): void {
  iconStore.leftDrawerOpen = !iconStore.leftDrawerOpen
}

function toggleRightDrawer(): void {
  iconStore.rightDrawerOpen = !iconStore.rightDrawerOpen
}

function toggleSettingsDrawer(): void {
  iconStore.settingsDrawerOpen = !iconStore.settingsDrawerOpen
}

function animateTotalIcons(target: number): void {
  if (totalIconsAnimationFrame !== undefined && typeof window !== 'undefined') {
    window.cancelAnimationFrame(totalIconsAnimationFrame)
    totalIconsAnimationFrame = undefined
  }

  if (target <= 0) {
    displayedTotalIcons.value = 0
    return
  }

  if (typeof window === 'undefined') {
    displayedTotalIcons.value = target
    return
  }

  const start = displayedTotalIcons.value
  const change = target - start
  const duration = 900
  const startedAt = window.performance.now()

  const tick = (now: number) => {
    const progress = Math.min((now - startedAt) / duration, 1)
    const easedProgress = 1 - Math.pow(1 - progress, 3)

    displayedTotalIcons.value = Math.round(start + change * easedProgress)

    if (progress < 1) {
      totalIconsAnimationFrame = window.requestAnimationFrame(tick)
      return
    }

    displayedTotalIcons.value = target
    totalIconsAnimationFrame = undefined
  }

  totalIconsAnimationFrame = window.requestAnimationFrame(tick)
}

function onCartRemoveAllItems(): void {
  iconStore.removeAll()
}

function importToClipboard(icon: Icon): void {
  const data = `import { ${icon.iconName} } from '${icon.packageName}/${icon.iconSet}'`
  void copyToClipboard(data)
    .then(() => {
      $q.notify({
        message: `Import for '${icon.iconName}' copied to clipboard`,
        position: 'top',
        icon: icon.path,
        color: 'white',
        textColor: 'primary',
      })
    })
    .catch((err) => {
      console.error('Failed to copy to clipboard:', err)
    })
}

function onImportAll(): void {
  copyToClipboard(allImports.value)
    .then(() => {
      $q.notify({
        message: `All imports copied to clipboard`,
        position: 'top',
        icon: mdiPartyPopper,
        color: 'white',
        textColor: 'primary',
      })
    })
    .catch((err) => {
      console.error('Failed to copy to clipboard:', err)
    })
}

function onInlinedAll(): void {
  copyToClipboard(allInlined.value)
    .then(() => {
      $q.notify({
        message: `All inline constants copied to clipboard`,
        position: 'top',
        icon: mdiPartyPopper,
        color: 'white',
        textColor: 'primary',
      })
    })
    .catch((err) => {
      console.error('Failed to copy to clipboard:', err)
    })
}

function canDisplay(child: { value: string }): boolean {
  const filterValue = common.filter.value
  if (typeof filterValue === 'string' && filterValue.length > 0) {
    return common.relatedIconSets.value.includes(child.value)
  }
  return true
}

function onSearchKeydown(evt: KeyboardEvent): void {
  switch (evt.keyCode) {
    case 27: // escape
      if ($q.platform.is.desktop === true) {
        evt.preventDefault()
        common.filter.value = null
      }
      break
    case 13: // enter
      evt.preventDefault()
      evt.stopPropagation()
      if (common.relatedIconSets.value.length > 0) {
        // grab the first item and click on it
        const item = common.relatedIconSets.value[0]
        if (item) {
          const element = document.getElementById(item)
          if (element) {
            element.click()
          }
        }
        // if not on desktop, close the drawer
        if ($q.platform.is.desktop !== true) {
          // close the drawer logic here
        }
      }
      break
  }
}

function onSearchFocus(): void {
  searchHasFocus.value = true
}

function onSearchBlur(): void {
  searchHasFocus.value = false
  if ($q.platform.is.mobile) {
    iconStore.leftDrawerOpen = false
  }
}

function focusOnSearch(evt: KeyboardEvent): void {
  if ((evt.target as HTMLElement).tagName !== 'INPUT' && String.fromCharCode(evt.keyCode) === '/') {
    evt.preventDefault()

    // open the drawer if not already open
    if (iconStore.leftDrawerOpen !== true) {
      iconStore.leftDrawerOpen = true
    }
  }
}

function removeIconFromLibrary(icon: Icon): void {
  iconStore.removeItem(icon.packageName, icon.iconSet, icon.iconName)
}
</script>

<style lang="scss">
.icon-search-input,
.icon-search-input .q-field__control {
  height: 50px;
}

.icon-search-input .q-field__control {
  padding: 0 18px 0 16px !important;
}

.icon-search-input input {
  line-height: 38px;
}

.icon-search-input .q-field__prepend,
.icon-search-input .q-field__append {
  height: 100%;
  cursor: text !important;
}

.icon-search-input kbd {
  font-size: 0.6em !important;
  min-width: 1.6em;
  min-height: 1.5em;
  font-weight: bold;
}

body.mobile .icon-search-input kbd {
  display: none;
}

.markdown-copyright {
  font-family:
    Consolas,
    Monaco,
    Andale Mono,
    Ubuntu Mono,
    monospace;
}

.markdown-page__footer--icons {
  font-size: 28px;
}

.markdown-page__footer--icons a {
  text-decoration: none;
  outline: 0;
  color: $primary;
  transition: color 0.28s;
}

.markdown-page__footer--icons a:hover {
  color: $red-8;
}

.icon-menu .q-item.q-item--active {
  background: #e6f8ff;
}

.icon-menu .q-item {
  border-radius: 0 10px 10px 0;
  margin-right: 12px;
}

.quasar-link {
  display: inline-block;
  color: white;
  text-decoration: underline dotted;
}

.made-with {
  position: absolute;
  right: 10px;
  bottom: 0px;
  transition: all 0.5s;
}

.trash-can {
  color: $green-8;
}

.trash-can:hover {
  color: $red-8;
}
</style>
