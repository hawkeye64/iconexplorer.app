<template>
  <q-layout view="lHh Lpr fFf">
    <q-header elevated class="glass">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          :icon="mdiMenu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          <div>@Quasar/Extras <span class="text-subtitle2">&nbsp;v{{ version }}</span></div>
          <div>Quasar Extras SVG Icons<span class="text-subtitle2">&nbsp;v{{ version2 }}</span></div>
        </q-toolbar-title>

        <q-btn flat round @click="$q.dark.toggle()" :icon="$q.dark.isActive ? mdiBrightness2 : mdiBrightness5" />
        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import pkg from '@quasar/extras/package.json'
const version = pkg.version
import pkg2 from 'quasar-extras-svg-icons/package.json'
const version2 = pkg2.version


import {
  mdiMenu,
  mdiBrightness2,
  mdiBrightness5,
  mdiSchool,
  mdiForumOutline,
  mdiDiscord,
  mdiFacebook,
  mdiTwitter,
  mdiGithub,
  mdiHeart
} from '@quasar/extras/mdi-v5'

const linksData = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: mdiSchool,
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: mdiGithub,
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: mdiDiscord,
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: mdiForumOutline,
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: mdiTwitter,
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: mdiFacebook,
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: mdiHeart,
    link: 'https://awesome.quasar.dev'
  }
]

export default defineComponent({
  name: 'MainLayout',
  components: { EssentialLink },
  data () {
    return {
      version,
      version2,
      mdiMenu,
      mdiBrightness2,
      mdiBrightness5,
      mdiSchool,
      mdiHeart,
      mdiFacebook,
      mdiTwitter,
      mdiForumOutline,
      mdiDiscord,
      mdiGithub,
      leftDrawerOpen: false,
      essentialLinks: linksData
    }
  }
})
</script>
