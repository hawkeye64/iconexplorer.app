<template>
  <q-layout view="hHh LpR fFf">
    <q-header
      elevated
      class="glass"
    >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          :icon="mdiMenu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <div>
            <q-img
              src="icon-finder-light.png"
              width="42px"
              height="42px"
            />
            Icon Explorer&nbsp;
            <span
              class="text-caption text-weight-bold"
              style="font-size: 14px;"
            >
              v{{ appVersion }}
            </span>
          </div>
        </q-toolbar-title>

        <q-btn
          flat
          round
          :icon="$q.dark.isActive ? mdiBrightness2 : mdiBrightness5"
          @click="$q.dark.toggle()"
        />
        <div>Quasar v{{ $q.version }}</div>
        <q-btn
          flat
          round
          :icon="Object.keys(store.cart).length === 0 ? mdiCartOutline : mdiCartHeart"
          @click="toggleRightDrawer"
        />
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
      <div class="full-width row justify-center items-center q-my-sm">
        <p class="markdown-copyright">CC-BY / MIT License | Copyright &copy; {{ year }} Jeff Galbraith</p>
      </div>
    </q-footer>

    <q-drawer
      v-model="store.leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-scroll-area class="fit">
        <q-list dense>
          <template
            v-for="(parent, index) in iconSets"
            :key="parent.label"
          >
            <q-item-label
              header
              class="text-caption text-weight-bold"
              style="font-size: 14px;"
            >
              {{ parent.label }} v{{ index === 0 ? version : version2 }}
            </q-item-label>
            <q-item
              v-for="child in parent.children"
              :key="child.label"
              v-ripple
              :active="isActive(child)"
              clickable
              @click="onClickIconSet(child)"
            >
              <q-item-section>
                <q-item-label class="q-ml-lg">» {{ child.label }}</q-item-label>
              </q-item-section>
            </q-item>
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
          <div>
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

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useQuasar, copyToClipboard } from 'quasar'
import pkg from '@quasar/extras/package.json'
const version = pkg.version
import pkg2 from 'quasar-extras-svg-icons/package.json'
const version2 = pkg2.version
import pkg3 from '../../package.json'
const appVersion = pkg3.version
import { iconSets } from '../icon-sets'
import { useStore } from 'assets/store.js'

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
  mdiCharity
} from '@quasar/extras/mdi-v6'

const year = (new Date()).getFullYear()

export default defineComponent({
  name: 'MainLayout',

  setup () {
    const store = useStore(),
    $q = useQuasar()

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

    function isActive (iconSet) {
      return iconSet.value === store?.iconSet?.value
    }

    function onClickIconSet (iconSet) {
      store.rightDrawerOpen = false
      store.iconSet = iconSet
    }

    function toggleLeftDrawer () {
      store.leftDrawerOpen = !store.leftDrawerOpen
    }

    function toggleRightDrawer () {
      store.rightDrawerOpen = !store.rightDrawerOpen
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

    return {
      store,
      version,
      version2,
      appVersion,
      mdiMenu,
      mdiBrightness2,
      mdiBrightness5,
      mdiCartOutline,
      mdiCartHeart,
      mdiTrashCanOutline,
      toggleLeftDrawer,
      toggleRightDrawer,
      iconSets,
      isActive,
      onClickIconSet,
      onCartRemoveAllItems,
      importToClipboard,
      onImportAll,
      onInlinedAll,
      year,
      fabGithub,
      fabTwitter,
      mdiCharity
    }
  }
})
</script>

<style lang="sass">
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

</style>
