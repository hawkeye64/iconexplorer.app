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
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-scroll-area class="fit">
        <q-list>
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

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
// import EssentialLink from 'components/EssentialLink.vue'
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
} from '@quasar/extras/mdi-v5'

export default defineComponent({
  name: 'MainLayout',
  setup () {
    const store = useStore(),
      leftDrawerOpen = ref(false)

    function onClickIconSet (iconSet) {
      console.log(iconSet)
      store.iconSet = iconSet
    }

    function toggleLeftDrawer () {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    return {
      version,
      version2,
      mdiMenu,
      mdiBrightness2,
      mdiBrightness5,
      leftDrawerOpen,
      toggleLeftDrawer,
      iconSets,
      onClickIconSet
    }
  }
})
</script>
