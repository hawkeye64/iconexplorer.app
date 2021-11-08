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
          <div>@Quasar/Extras <span class="text-subtitle2">&nbsp;v{{ version }}</span></div>
          <div>Quasar Extras SVG Icons<span class="text-subtitle2">&nbsp;v{{ version2 }}</span></div>
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

    <q-drawer
      v-model="store.leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-scroll-area class="fit">
        <q-list dense>
          <template
            v-for="(parent) in iconSets"
            :key="parent.label"
          >
            <q-item-label
              header
            >
              {{ parent.label }}
            </q-item-label>
            <q-item
              v-for="child in parent.children"
              :key="child.label"
              v-ripple
              clickable
              @click="onClickIconSet(child)"
            >
              <q-item-section>
                <q-item-label>{{ child.label }}</q-item-label>
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
                label="Import all"
                no-caps
                @click="onImportAll"
              />
            </q-item-section>
          </q-item>
          <div>
            <q-btn
              v-for="icon in selectedIconsFlattened"
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
import { iconSets } from '../icon-sets'
import { useStore } from 'assets/store.js'

import {
  mdiMenu,
  mdiBrightness2,
  mdiBrightness5,
  mdiCartOutline,
  mdiCartHeart,
  mdiTrashCanOutline,
  mdiPartyPopper
} from '@quasar/extras/mdi-v6'

export default defineComponent({
  name: 'MainLayout',
  setup () {
    const store = useStore(),
    $q = useQuasar()

    const selectedIconsFlattened = computed(() => {
      const icons = [];
      for (const packageName in store.cart) {
        for (const iconSet in store.cart[ packageName ]) {
          for (const iconName in store.cart[ packageName ][ iconSet ]) {
            const path = store.cart[ packageName ][ iconSet ][ iconName ]
            icons.push({
              packageName,
              iconSet,
              iconName,
              path
            })
          }
        }
      }

      return icons
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
 
      return imports
    })

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
            message: `All imports copied to clipboard`,
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
      mdiMenu,
      mdiBrightness2,
      mdiBrightness5,
      mdiCartOutline,
      mdiCartHeart,
      mdiTrashCanOutline,
      toggleLeftDrawer,
      toggleRightDrawer,
      iconSets,
      onClickIconSet,
      onCartRemoveAllItems,
      selectedIconsFlattened,
      importToClipboard,
      onImportAll
    }
  }
})
</script>
