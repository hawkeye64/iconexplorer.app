<template>
  <div
    class="column justify-center items-start q-ma-md"
  >
    <div class="row justify-start full-width">
      <div
        class="text-left"
        style="max-width: 80%;"
      >
        <q-icon
          :name="mdiArrowCollapseLeft"
          color="primary"
        />Select an icon set in the left drawer to browse the icons for that icon set. Or, enter a search filter (top of left drawer)
      </div>
    </div>

    <!-- eslint-disable vue/html-indent -->
    <q-markdown>
> Note: These icons have been **flattened** and get reconstituted via the [QIcon](https://quasar.dev/vue-components/icon#svg-icons) component.

## Browsing Icon Sets

To browse an icon set, simply click the icon set in the left drawer. Some icons sets are large and may take a bit of time to load.

::: tip
If the icon set, on the left, includes a version number, then this is when it was added to its respective icon package (either @quasar/extras or quasar-extras-svg-icons)
:::

You should also be aware that some icon-sets are more than they appear. If you browse them, you will find some have outlined, solid, duo-tones, etc.

We even host colored, flags, weather and medical icons. Take your time to explore and search. We hope we have made this web site a good experience.

## Searching

You can search icon sets by adding search criteria in the search bar (top left). 

When searching, all icon sets will be searched and only those with a **match** will show up.
::: tip
The filter bar accepts regular expressions. For instance, in the simplist form, you can search for a single word, such as "**map**". But, you can do a multiple word search by adding a "**|**" between words. Now, we can seach for "**map|pin**" at the same time. However, you may get false-positives with words like "shop**pin**g" or "s**pin**ner". With regular expressions, you can filter these out. We can create a search like this "**(?!pint|ping|maple)(pin|map)**". The first part (in parentheses) is using a regular expression look-ahead to filter out what we do not want, before looking for what we do want. Words containing "**pint**", "**ping**" or "**maple**" are skipped before looking for "**pin**" and "**map**".
:::

::: tip
To show all icon sets again, just clear the search bar.
:::

## Selecting an Icon

When you select an icon, a bottom drawer will be displayed. Here you can play with a color palette (even invert it) to see how the icon will look. Plus, there are multiple ways to export it, depending on your needs.

More importantly, this is where you can add an icon to your **library**.

## The Library

Once one or more icons are added to your library, you can open the **Library** panel by clicking the shopping cart on the right of the top header bar. This opens the right-side drawer. This allows you to do massive exports, where the icons are conglomerated into their respective imports, all at once. Ths means, if you select multiple icons, from different icon sets, then clicking the **import** button will put it onto the clipboard and all you have to do is paste it into your code:

```js
import { fabGithub, fabTwitter } from '@quasar/extras/fontawesome-v5'
import { mdiHeartBroken, mdiHeart, mdiClose, mdiPlus } from '@quasar/extras/mdi-v6'
import { uiwSearch } from 'quasar-extras-svg-icons/uiw-icons'
```
    </q-markdown>
    <!-- eslint-enable vue/html-indent -->
  </div>
</template>

<script>
import { mdiArrowCollapseLeft } from '@quasar/extras/mdi-v6'

export default {
  name: 'Help',
  setup () {
    return {
      mdiArrowCollapseLeft
    }
  }
}
</script>
