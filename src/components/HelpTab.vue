<template>
  <div class="column justify-center items-start q-ma-md">
    <div class="row justify-start full-width">
      <div class="text-left" style="max-width: 80%">
        <q-icon :name="mdiArrowCollapseLeft" color="primary" />Select an icon set in the left drawer
        to browse its icons, or enter a search filter at the top of the drawer.
      </div>
    </div>

    <q-markdown :src="helpMarkdown" />
  </div>
</template>

<script setup lang="ts">
import { appArrowCollapseLeft as mdiArrowCollapseLeft } from '@/assets/app-icons'

const helpMarkdown = `> Note: These icons have been **flattened** and get reconstituted via the [QIcon](https://quasar.dev/vue-components/icon#svg-icons) component.

## Browsing Icon Sets

To browse an icon set, simply click the icon set in the left drawer. Some icon sets are large and may take a bit of time to load.

::: tip
The icon set list is generated from the installed \`@quasar/extras\` and \`quasar-extras-svg-icons\` packages so new sets, such as Font Awesome v7, are picked up as packages are updated.
:::

Some icon sets are richer than they first appear. As you browse, you will find outline, solid, duotone, color, flag, weather, medical, and other purpose-built variants.

Take your time to explore and search. We hope we have made this website a good experience.

## Searching

You can search icon sets by adding search criteria in the search bar (top left).

When searching, all icon sets will be searched and only those with a **match** will show up.

::: tip
The filter bar accepts regular expressions. For instance, in the simplest form, you can search for a single word, such as "**map**". But, you can do a multiple word search by adding a "**|**" between words. Now, we can search for "**map|pin**" at the same time. However, you may get false-positives with words like "shop**pin**g" or "s**pin**ner". With regular expressions, you can filter these out. We can create a search like this "**(?!pint|ping|maple)(pin|map)**". The first part (in parentheses) is using a regular expression look-ahead to filter out what we do not want, before looking for what we do want. Words containing "**pint**", "**ping**" or "**maple**" are skipped before looking for "**pin**" and "**map**".
:::

::: tip
To show all icon sets again, just clear the search bar.
:::

## Selecting an Icon

When you select an icon, a bottom drawer will be displayed. Here you can play with a color palette (even invert it) to see how the icon will look. Plus, there are multiple ways to export it, depending on your needs.

More importantly, this is where you can add an icon to your **library**.

## The Library

Once one or more icons are added to your library, you can open the **Library** panel by clicking the shopping cart on the right of the top header bar. This opens the right-side drawer. From there, you can copy every selected icon at once. The **Imports** button groups icons by package and icon set, then copies ready-to-paste import statements to your clipboard:

\`\`\`js
import { fabGithub, fabXTwitter } from '@quasar/extras/fontawesome-v7'
import { mdiHeartBroken, mdiHeart, mdiClose, mdiPlus } from '@quasar/extras/mdi-v7'
import { uiwSearch } from 'quasar-extras-svg-icons/uiw-icons'
\`\`\`

Use the **Inline** button when you want the flattened SVG constants instead of package imports.
`
</script>
