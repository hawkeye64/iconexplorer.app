<template>
  <section class="info-panel about-panel">
    <div class="info-panel__header">
      <p class="info-panel__eyebrow">About Icon Explorer</p>
      <h2>Built for fast Quasar icon decisions.</h2>
      <p>
        IconExplorer.app brings generated SVG icon packages into one searchable workspace so Quasar
        developers can browse, compare, collect, and copy without leaving their app flow.
      </p>
    </div>

    <div class="info-panel__grid">
      <article>
        <q-icon :name="mdiHeart" size="30px" />
        <h3>Powered by Quasar</h3>
        <p>
          Huge thanks to
          <a href="https://quasar.dev" target="_blank" rel="noopener">Quasar Framework</a>
          for the Vue tooling and components that make this project practical.
        </p>
      </article>

      <article>
        <q-icon :name="mdiPartyPopper" size="30px" />
        <h3>Made possible by icon creators</h3>
        <p>
          This app exists because designers and maintainers keep creating useful icon sets for the
          community. Their work is the foundation.
        </p>
      </article>

      <article>
        <q-icon :name="mdiImport" size="30px" />
        <h3>Hosted by Netlify</h3>
        <p>
          Thanks to
          <a href="https://www.netlify.com" target="_blank" rel="noopener">Netlify</a>
          for hosting the site and keeping the public icon finder easy to reach.
        </p>
        <a href="https://www.netlify.com" target="_blank" rel="noopener" class="about-panel__badge">
          <img
            src="https://www.netlify.com/assets/badges/netlify-badge-color-accent.svg"
            alt="Deploys by Netlify"
          />
        </a>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  appHeart as mdiHeart,
  appImport as mdiImport,
  appPartyPopper as mdiPartyPopper,
} from '@/assets/app-icons'
</script>
