<template>
  <section class="welcome-panel">
    <div class="welcome-panel__hero">
      <div class="welcome-panel__copy">
        <p class="welcome-panel__eyebrow">Quasar SVG Icon Finder</p>
        <h1>Search huge icon catalogs without leaving your workflow.</h1>
        <p>
          Browse included icon families, compare names, preview colors, collect favorites, and copy
          ready-to-use Quasar imports from one focused interface.
        </p>

        <div class="welcome-panel__actions row q-gutter-sm">
          <q-btn rounded unelevated no-caps class="welcome-panel__primary" @click="openLibrary">
            Browse icon sets
          </q-btn>
          <q-btn
            rounded
            outline
            no-caps
            class="welcome-panel__secondary"
            @click="trySearch('heart')"
          >
            Try "heart"
          </q-btn>
        </div>
      </div>

      <div class="welcome-panel__stats">
        <article>
          <strong>{{ formattedTotalIcons }}</strong>
          <span>searchable icons</span>
        </article>
        <article>
          <strong>{{ iconSetCount }}</strong>
          <span>icon sets</span>
        </article>
        <article>
          <strong>2</strong>
          <span>source packages</span>
        </article>
      </div>
    </div>

    <div class="welcome-panel__searches">
      <span>Popular searches</span>
      <button v-for="term in sampleTerms" :key="term" type="button" @click="trySearch(term)">
        {{ term }}
      </button>
    </div>

    <div class="welcome-panel__steps">
      <article v-for="step in steps" :key="step.title">
        <q-icon :name="step.icon" size="28px" />
        <h2>{{ step.title }}</h2>
        <p>{{ step.text }}</p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { iconSets } from '@/icon-sets'
import { useIconStore } from '@/stores/icon-store'
import { useCommon } from '@/assets/useCommon'
import {
  appCartHeart as mdiCartHeart,
  appContentCopy as mdiContentCopy,
  appImport as mdiImport,
  appSearch as mdiSearch,
} from '@/assets/app-icons'

const iconStore = useIconStore()
const common = useCommon()

const sampleTerms = ['heart', 'calendar', 'github', 'map|pin', 'weather']

const steps = [
  {
    icon: mdiSearch,
    title: 'Search across sets',
    text: 'Use the left drawer to search every generated icon name, including regular expressions.',
  },
  {
    icon: mdiCartHeart,
    title: 'Build a library',
    text: 'Open an icon, add it to your library, and keep a small working set while comparing options.',
  },
  {
    icon: mdiImport,
    title: 'Copy imports',
    text: 'Copy individual imports, grouped library imports, QIcon snippets, inline constants, or raw SVG.',
  },
  {
    icon: mdiContentCopy,
    title: 'Stay in flow',
    text: 'The app keeps previews, names, color checks, and copy actions close together for fast decisions.',
  },
]

const iconSetCount = computed(() => {
  return iconSets.reduce((total, parent) => total + parent.children.length, 0)
})

const formattedTotalIcons = computed(() => {
  const total = iconStore.totalIcons
  return total > 0 ? total.toLocaleString() : '140k+'
})

function openLibrary(): void {
  iconStore.leftDrawerOpen = true
}

function trySearch(term: string): void {
  common.filter.value = term
  iconStore.leftDrawerOpen = true
}
</script>
