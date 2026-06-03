<template>
  <section class="info-panel help-panel">
    <div class="info-panel__header">
      <p class="info-panel__eyebrow">How to use it</p>
      <h2>Find an icon, preview it, then copy exactly what your app needs.</h2>
      <p>
        Select an icon set in the left drawer to browse its icons, or use the filter bar to search
        across every generated set.
      </p>
    </div>

    <div class="help-panel__notice">
      <q-icon :name="mdiAlertCircleOutline" size="28px" />
      <p>
        These icons are flattened and reconstituted through Quasar's
        <a href="https://quasar.dev/vue-components/icon#svg-icons" target="_blank" rel="noopener">
          QIcon SVG support</a
        >.
      </p>
    </div>

    <div class="info-panel__grid">
      <article>
        <q-icon :name="mdiArrowCollapseLeft" size="30px" />
        <h3>Browse icon sets</h3>
        <p>
          Choose a set from the left drawer. Large sets may take a moment to load, especially when
          they include outline, solid, duotone, weather, medical, flag, or brand variants.
        </p>
        <p>
          The list is generated from installed <strong>@quasar/extras</strong> and
          <strong>quasar-extras-svg-icons</strong> packages, so newly released sets are picked up as
          dependencies are updated.
        </p>
      </article>

      <article>
        <q-icon :name="mdiSearch" size="30px" />
        <h3>Search with regular expressions</h3>
        <p>
          Type a word like <code>map</code>, combine terms with <code>map|pin</code>, or use a
          narrower expression such as <code>(?!pint|ping|maple)(pin|map)</code> to avoid false
          positives.
        </p>
        <p>Clear the search bar to show all icon sets again.</p>
      </article>

      <article>
        <q-icon :name="mdiCartHeart" size="30px" />
        <h3>Select and collect</h3>
        <p>
          Open an icon to preview palette colors, invert contrast, export one-off snippets, or add
          it to your library for a grouped copy workflow.
        </p>
      </article>
    </div>

    <article class="help-panel__library">
      <div>
        <q-icon :name="mdiImport" size="32px" />
        <h3>The library copies grouped imports</h3>
        <p>
          Once icons are in your library, open the cart drawer and use <strong>Imports</strong> to
          copy package-aware import statements. Use <strong>Inline</strong> when you want flattened
          SVG constants instead.
        </p>
      </div>

      <pre><code>import { fabGithub, fabXTwitter } from '@quasar/extras/fontawesome-v7'
import { mdiHeartBroken, mdiHeart, mdiClose, mdiPlus } from '@quasar/extras/mdi-v7'
import { uiwSearch } from 'quasar-extras-svg-icons/uiw-icons'</code></pre>
    </article>
  </section>
</template>

<script setup lang="ts">
import {
  appAlertCircleOutline as mdiAlertCircleOutline,
  appArrowCollapseLeft as mdiArrowCollapseLeft,
  appCartHeart as mdiCartHeart,
  appImport as mdiImport,
  appSearch as mdiSearch,
} from '@/assets/app-icons'
</script>
