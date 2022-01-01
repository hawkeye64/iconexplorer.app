<template>
  <div class="row justify-center text-grey-8 q-pr-sm q-py-sm overflow-hidden">
    <q-intersection
      v-for="(path, name) in icons"
      :key="name"
      once
      :class="iconColumns"
      @click="onClick({ path, name })"
    >
      <q-card
        class="intersection-icon-box--inner row full-width justify-center items-center q-pa-xs"
        :class="{
          'active-icon': isActiveIcon(name),
          'cart-icon': store.isCartIcon(name)
        }"
      >
        <div class="full-width row justify-between items-center">
          <q-btn
            size="sm"
            :icon="mdiContentCopy"
            flat
            padding="0"
            color="grey-13"
            @click.stop="nameToClipboard(name)"
          >
            <q-tooltip
              anchor="top middle"
              self="top middle"
              class="primary my-tooltip"
            >
              Copy name "{{ name }}" to clipboard
            </q-tooltip>
          </q-btn>
          <q-btn
            size="sm"
            :icon="mdiImport"
            flat
            padding="0"
            color="grey-13"
            @click.stop="importToClipboard(name, store.iconSet.packageName, store.iconSet.value)"
          >
            <q-tooltip
              anchor="top middle"
              self="top middle"
              class="primary my-tooltip"
            >
              Copy "import &#123; {{ name }} &#125; from '{{ store.iconSet.packageName }}/{{ store.iconSet.value }}'" to clipboard
            </q-tooltip>
          </q-btn>
        </div>
        <q-icon
          :name="path"
          :size="store.iconSize"
          class="q-pa-xs row full-width justify-center items-center"
        />
        <div
          class="row full-width justify-center items-center"
          style="font-size: 16px;"
        >
          <span
            class="overflow-hidden ellipsis"
            v-html="store.filter ? getName(name) : name"
          />
        </div>
        <q-tooltip
          v-if="store.tooltips"
          :delay="250"
          class="primary"
          style="font-size: 24px;"
        >
          {{ name }}
        </q-tooltip>
      </q-card>
    </q-intersection>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useQuasar, copyToClipboard } from 'quasar'
import { useStore } from 'assets/store.js'
import { mdiContentCopy, mdiImport } from '@quasar/extras/mdi-v6'

export default defineComponent({
  name: 'SvgIconViewer',

  props: {
    icons: {
      type: Object,
      required: true
    },
    selectedName: {
      type: String,
      required: true
    }
  },

  emits: [
    'selected'
  ],

  setup (props, { emit }) {
    const store = useStore(),
      $q = useQuasar()

    const iconColumns = computed(() => {
      let classes = 'intersection-icon-box '

      switch (store.iconColumns) {
        case '1':
          classes += 'col-12'
          break
        case '2':
          classes += 'col-6'
          break
        case '3':
          classes += 'col-4'
          break
        case '4':
          classes += 'col-3'
          break
        case '6':
          classes += 'col-2'
          break
        case '12':
          classes += 'col-1'
          break
        case 'responsive':
        default:
          classes += 'col-xl-1 col-lg-2 col-md-3 col-sm-4 col-xs-6'
          break
      }

      return classes
    })

    function getName (name) {
      if (store.filter) {
        const filterRe = new RegExp(store.filter, 'ig')
        const match = name.match(filterRe)
        if (match && Array.isArray(match)) {
          match.forEach(str => {
            name = name.replace(str, `<mark>${ str }</mark>`)
          })
        }
      }

      return name
    }

    function nameToClipboard (iconName) {
      sendToClipboard(iconName)
    }

    function importToClipboard (iconName, packageName, iconSet) {
      const inline = `import { ${ iconName } } from '${ packageName }/${ iconSet }'`
      sendToClipboard(inline)
    }

    function sendToClipboard (data) {
      copyToClipboard(data)
        .then(() => {
          $q.notify({
            message: `'${ data }' copied to clipboard`,
            position: 'top',
            // icon: icon.path,
            color: 'white',
            textColor: 'primary'
          })
        })

    }

    return {
      store,
       onClick: function ({ path, name }) {
        emit('selected', { path, name })
      },
      isActiveIcon: function (name) {
        return props.selectedName === name
      },
      iconColumns,
      getName,
      mdiContentCopy,
      mdiImport,
      nameToClipboard,
      importToClipboard
    }
  }
})
</script>

<style lang="sass">
.active-icon
  color: rgb(25, 118, 210)

.cart-icon
  color: rgb(255, 0, 0)
</style>