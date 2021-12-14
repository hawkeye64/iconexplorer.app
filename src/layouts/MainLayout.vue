<template>
  <q-layout view="lHh LpR lFf">
    <q-header
      elevated
      class="glass"
      style="max-height: 50px;"
    >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          :icon="mdiMenu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        >
          <q-tooltip class="text-no-wrap">Toggle left-side drawer</q-tooltip>
        </q-btn>

        <q-toolbar-title class="q-pa-none">
          <q-btn
            to="/"
            flat
            no-caps
            no-wrap
            class="ellipsis text-no-wrap"
          >
            <div
              class="row justify-left items-center text-no-wrap ellipsis"
              style="max-height: 50px;"
            >
              <q-img
                src="icon-finder-light.png"
                width="42px"
                height="42px"
              />
              <div
                class="column q-pl-sm ellipsis"
                :style="$q.screen.width > 421 ? 'font-size: 1.25rem' : 'font-size: 0.85rem'"
              >
                Icon Explorer&nbsp;
                <span
                  class="text-caption text-weight-bold"
                  :style="($q.screen.width > 421 ? 'font-size: .8rem;' : 'font-size: .65rem;') + ' max-width: 120px;'"
                >
                  v{{ appVersion }}
                </span>
              </div>
            </div>
            <q-tooltip
              anchor="bottom left"
              :offset="[-100, 0]"
              class="glass"
            >
              <div class="column items-center text-no-wrap">
                <span
                  style="font-size: 18px;"
                >Serving {{ store.totalIcons }}+ icons</span>
                <span style="font-size: 12px">Excludes (mdi-v4|mdi-v5|ionicons-v4|ionicons-v5)</span>
                <span style="font-size: 12px">These icon sets are not searchable</span>
              </div>
            </q-tooltip>
          </q-btn>
        </q-toolbar-title>

        <!-- <div class="row justify-center items-center col-md-4 col-sm-12">Totals: {{ filteredCount }}/{{ iconCount }}</div> -->

        <div
          v-if="$q.screen.gt.xs"
          class="column q-px-sm"
        >
          Quasar <span>v{{ $q.version }}</span>
        </div>

        <q-btn
          flat
          round
          :icon="$q.dark.isActive ? mdiBrightness2 : mdiBrightness5"
          @click="$q.dark.toggle()"
        >
          <q-tooltip>Toggle light/dark</q-tooltip>
        </q-btn>

        <q-btn
          flat
          round
          :icon="Object.keys(store.cart).length === 0 ? mdiCartOutline : mdiCartHeart"
          :color="Object.keys(store.cart).length === 0 ? 'currentColor' : 'pink-4'"
          @click="toggleRightDrawer"
        >
          <q-tooltip>Your selected library items</q-tooltip>
        </q-btn>

        <q-btn
          flat
          dense
          round
          :icon="mdiCog"
          aria-label="Settings"
          @click="toggleSettingsDrawer"
        >
          <q-tooltip>Settings</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-footer
      elevated
      class="glass q-ma-none"
    >
      <div class="markdown-page__footer--icons full-width row justify-center items-center q-gutter-sm">
        <a
          href="https://github.com/hawkeye64"
          target="_blank"
          rel="noopener"
        ><q-avatar size="28px"><img src="~assets/profile.png"></q-avatar></a>
        <a
          href="https://github.com/hawkeye64/iconexplorer.app"
          target="_blank"
          rel="noopener"
        ><q-icon :name="fabGithub" /></a>
        <a
          href="https://twitter.com/jgalbraith64"
          target="_blank"
          rel="noopener"
        ><q-icon :name="fabTwitter" /></a>
        <a
          href="https://github.com/sponsors/hawkeye64"
          target="_blank"
          rel="noopener"
        ><q-icon :name="mdiCharity" /></a>
      </div>
      <div class="full-width row justify-center items-center q-mt-xs markdown-copyright q-mx-sm">
        <div>CC-BY / MIT License</div>
        <div>|</div>
        <div>Copyright &copy; {{ year }} Jeff Galbraith</div>
      </div>

      <div
        v-if="$q.screen.gt.xs"
        :class="madeWithClasses"
      >
        <span>Made with <q-icon
          :name="mdiHeart"
          size="sm"
          class="text-red-8"
        /> using <a
          href="https://quasar.dev"
          target="_blank"
          class="quasar-link"
        >Quasar Framework</a></span>
      </div>
    </q-footer>

    <q-drawer
      v-model="store.leftDrawerOpen"
      :persistent="searchHasFocus"
      show-if-above
      bordered
    >
      <q-scroll-area style="height: calc(100% - 51px); margin-top: 51px;">
        <div class="fixed-top glass">
          <form
            autocorrect="off"
            autocapitalize="off"
            autocomplete="off"
            spellcheck="false"
          >
            <q-input
              ref="searchInputRef"
              v-model="store.filter"
              dark
              dense
              square
              borderless
              clearable
              debounce="300"
              placeholder="Search all icon sets..."
              class="full-width icon-search-input"
              @keydown="onSearchKeydown"
              @focus="onSearchFocus"
              @blur="onSearchBlur"
            >
              <template #append>
                <q-icon
                  v-if="!store.filter"
                  :name="uiwSearch"
                  color="grey-1"
                />
              </template>
            </q-input>
          </form>
        </div>
        <q-list
          dense
          class="icon-menu"
        >
          <div
            v-if="store.filter.length > 0"
            class="text-caption text-weight-bold q-ma-md"
            style="font-size: 14px;"
          >
            Search results below:
          </div>

          <template
            v-for="parent in iconSets"
            :key="parent.label"
          >
            <q-item-label
              header
              class="text-caption text-weight-bold"
              style="font-size: 14px;"
            >
              {{ parent.label }} v{{ parent.label === '@quasar/extras' ? qExtrasVersion : qExtrasSvgVersion }}
            </q-item-label>
            <template
              v-for="child in parent.children"
              :key="child.label"
            >
              <q-item
                v-if="canDisplay(child)"
                v-ripple
                :to="{ name: 'icons', params: { iconSet: child.value } }"
              >
                <q-item-section>
                  <q-item-label class="q-ml-lg">» {{ child.label }}</q-item-label>
                </q-item-section>
                <q-item-section
                  v-if="child.status"
                  side
                  class="text-right"
                >
                  <q-badge
                    color="blue"
                    text-color="white"
                    :label="child.status"
                  />
                </q-item-section>
              </q-item>
            </template>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-drawer
      v-model="store.rightDrawerOpen"
      bordered
      overlay
      side="right"
    >
      <q-scroll-area class="fit">
        <div
          v-if="Object.keys(store.cart).length === 0"
          class="row justify-center q-ma-lg"
        >
          The library is empty!
        </div>
        <q-list
          v-else
          dense
        >
          <q-item
            key="onCartRemoveAll"
          >
            <q-item-section>
              Remove all library items
            </q-item-section>
            <q-item-section avatar>
              <q-btn
                :icon="mdiTrashCanOutline"
                flat
                round
                @click="onCartRemoveAllItems"
              />
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item
            key="onImportAll"
            class="q-mt-xs"
          >
            <q-item-section>
              <q-btn
                label="Imported"
                no-caps
                @click="onImportAll"
              />
            </q-item-section>
            <q-item-section>
              <q-btn
                label="Inlined"
                no-caps
                @click="onInlinedAll"
              />
            </q-item-section>
          </q-item>
          <div class="row justify-center q-pt-sm">
            <q-btn
              v-for="icon in store.selectedIconsFlattened"
              :key="icon.iconName"
              :icon="icon.path"
              round
              flat
              @click="importToClipboard(icon)"
            >
              <q-tooltip>
                {{ 'import { ' + icon.iconName + ' } from ' + '\'' + icon.packageName + '/' + icon.iconSet + '\'' }}
              </q-tooltip>
            </q-btn>
          </div>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-drawer
      v-model="store.settingsDrawerOpen"
      bordered
      overlay
      side="right"
    >
      <q-scroll-area class="fit">
        <div class="row justify-center text-h5">Settings</div>

        <q-separator />

        <div class="fit q-pl-sm q-gutter-sm">
          <q-toggle
            v-model="store.tooltips"
            label="Tooltips"
            left-label
          />
          <q-select
            v-model="store.iconSize"
            label="Box Height"
            :options="['248px', '192px', '148px', '92px', '48px', '22px', 'xl', 'lg', 'md', 'sm', 'xs']"
            dense
            outlined
          />
          <q-select
            v-model="store.iconColumns"
            label="Columns"
            :options="['responsive', '12', '6', '4', '3', '2', '1']"
            dense
            outlined
          />
        </div>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useQuasar, copyToClipboard } from 'quasar'
import { iconSets } from 'src/icon-sets'
import { useStore } from 'assets/store.js'
import { uiwSearch } from 'quasar-extras-svg-icons/uiw-icons'

import pkg from '@quasar/extras/package.json'
const qExtrasVersion = pkg.version
import pkg2 from 'quasar-extras-svg-icons/package.json'
const qExtrasSvgVersion = pkg2.version
import pkg3 from 'app/package.json'
const appVersion = pkg3.version

import {
  fabGithub,
  fabTwitter
} from '@quasar/extras/fontawesome-v5'

import {
  mdiMenu,
  mdiBrightness2,
  mdiBrightness5,
  mdiCartOutline,
  mdiCartHeart,
  mdiTrashCanOutline,
  mdiPartyPopper,
  mdiCharity,
  mdiHeart,
  mdiCog
} from '@quasar/extras/mdi-v6'

const year = (new Date()).getFullYear()

export default defineComponent({
  name: 'MainLayout',

  setup () {
    const store = useStore()
    const $q = useQuasar()
    const searchHasFocus = ref(false)
    const searchInputRef = ref(null)

    onMounted(() => {
      if ($q.platform.is.desktop === true) {
        window.addEventListener('keypress', focusOnSearch)
      }
    })

    $q.platform.is.desktop === true && onBeforeUnmount(() => {
      window.removeEventListener('keypress', focusOnSearch)
    })

    const allImports = computed(() => {
      let imports = '';
      for (const packageName in store.cart) {
        for (const iconSet in store.cart[ packageName ]) {
          const icons = []

          for (const iconName in store.cart[ packageName ][ iconSet ]) {
            icons.push(iconName)
          }

          if (icons.length > 0) {
            if (imports) imports += '\n'
            imports += `import { ${ icons.join(', ') } } from '${ packageName }/${ iconSet }'`
          }
        }
      }

      return imports
    })

    const allInlined = computed(() => {
      let inlined = ''
      for (const packageName in store.cart) {
        for (const iconSet in store.cart[ packageName ]) {
          for (const iconName in store.cart[ packageName ][ iconSet ]) {
            if (inlined) inlined += '\n'
            inlined += `const ${ iconName } = '${ store.cart[ packageName ][ iconSet ][ iconName ] }'`
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

    function toggleLeftDrawer () {
      store.leftDrawerOpen = !store.leftDrawerOpen
    }

    function toggleRightDrawer () {
      store.rightDrawerOpen = !store.rightDrawerOpen
    }

    function toggleSettingsDrawer () {
      store.settingsDrawerOpen = !store.settingsDrawerOpen
    }

    function onCartRemoveAllItems () {
      store.removeAll()
    }

    function importToClipboard (icon) {
      const data = `import { ${ icon.iconName } } from '${ icon.packageName }/${ icon.iconSet }'`
      copyToClipboard(data)
        .then(() => {
          $q.notify({
            message: `Import for '${ icon.iconName }' copied to clipboard`,
            position: 'top',
            icon: icon.path,
            color: 'white',
            textColor: 'primary'
          })
        })
    }

    function onImportAll () {
      copyToClipboard(allImports.value)
        .then(() => {
          $q.notify({
            message: `All imported copied to clipboard`,
            position: 'top',
            icon: mdiPartyPopper,
            color: 'white',
            textColor: 'primary'
          })
        })
    }

    function onInlinedAll () {
      copyToClipboard(allInlined.value)
        .then(() => {
          $q.notify({
            message: `All inlined copied to clipboard`,
            position: 'top',
            icon: mdiPartyPopper,
            color: 'white',
            textColor: 'primary'
          })
        })
    }

    function canDisplay (child) {
      if (store.filter.length > 0) {
        return store.relatedIconSets.includes(child.value)
      }
      return true
    }

    const onSearchKeydown = $q.platform.is.desktop === true
    ? evt => {
      switch (evt.keyCode) {
        case 27: // escape
          evt.preventDefault()
          store.filter = null
          break
      }
    }
    : () => {}

    function onSearchFocus () {
      searchHasFocus.value = true
    }

    function onSearchBlur () {
      searchHasFocus.value = false
      if ($q.platform.is.mobile) {
        store.leftDrawerOpen = false
      }
    }

    function focusOnSearch (evt) {
      if (
        evt.target.tagName !== 'INPUT'
        && String.fromCharCode(evt.keyCode) === '/'
      ) {
        evt.preventDefault()

        // open the drawer if not already open
        if (store.leftDrawerOpen !== true) {
          store.leftDrawerOpen = true
        }

        setTimeout(() => {
          searchInputRef.value.focus()
        })
      }
    }
    
    return {
      store,

      qExtrasVersion,
      qExtrasSvgVersion,
      appVersion,

      mdiMenu,
      mdiBrightness2,
      mdiBrightness5,
      mdiCartOutline,
      mdiCartHeart,
      mdiTrashCanOutline,
      mdiHeart,
      mdiCog,
      uiwSearch,
      toggleLeftDrawer,
      toggleRightDrawer,
      toggleSettingsDrawer,
      onSearchKeydown,
      onSearchFocus,
      onSearchBlur,
      searchHasFocus,
      iconSets,
      onCartRemoveAllItems,
      importToClipboard,
      onImportAll,
      onInlinedAll,
      year,
      fabGithub,
      fabTwitter,
      mdiCharity,
      madeWithClasses,
      canDisplay,
      searchInputRef
    }
  }
})
</script>

<style lang="sass">
.icon-search-input,
.icon-search-input .q-field__control
  height: 50px

.icon-search-input
  .q-field__control
    padding: 0 18px 0 16px !important
  input
    line-height: 38px
  .q-field__prepend,
  .q-field__append
    height: 100%
    cursor: text !important
  kbd
    font-size: .6em !important
    min-width: 1.6em
    min-height: 1.5em
    font-weight: bold

body.mobile .icon-search-input kbd
  display: none

.markdown-copyright
  font-family: Consolas,Monaco,Andale Mono,Ubuntu Mono,monospace

.markdown-page__footer--icons
  font-size: 28px

  a
    text-decoration: none
    outline: 0
    color: $primary
    transition: color .28s

    &:hover
      color: $red-8

.icon-menu .q-item.q-item--active
  background: #e6f8ff

.icon-menu .q-item
  border-radius: 0 10px 10px 0
  margin-right: 12px

.quasar-link
  display: inline-block
  color: white
  text-decoration: underline dotted

.made-with
  position: absolute
  right: 10px
  bottom: 0px
  transition: all .5s
</style>
