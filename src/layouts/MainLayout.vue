<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar :class="$q.dark.isActive ? 'bg-black text-white' : 'bg-primary text-white'">
        <q-btn
          flat
          dense
          round
          :icon="mdiMenu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Quasar Extras v{{ version }}
        </q-toolbar-title>

        <q-btn flat round @click="$q.dark.toggle()" :icon="$q.dark.isActive ? mdiBrightness2 : mdiBrightness5" />
        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
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
import EssentialLink from 'components/EssentialLink.vue'
import { version } from '@quasar/extras/package.json'

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

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data () {
    return {
      version,
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
}
</script>
