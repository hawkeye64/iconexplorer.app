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
        class="intersection-icon-box--inner row full-width justify-center items-center overflow-hidden ellipsis"
        :class="{
          'active-icon': isActiveIcon(name),
          'cart-icon': store.isCartIcon(name)
        }"
      >
        <q-icon
          :name="path"
          :size="store.iconSize"
          class="q-pa-xs row full-width justify-center items-center"
        />
        <div
          class="row full-width justify-center items-center ellipsis"
          style="font-size: 12px;"
        >
          {{ name }}
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
import { useStore } from 'assets/store.js'

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
    const store = useStore()

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
        case 'reactive':
        default:
          classes += 'col-xl-1 col-lg-2 col-md-3 col-sm-4 col-xs-6'
          break
      }

      return classes
    })

    return {
      store,
       onClick: function ({ path, name }) {
        emit('selected', { path, name })
      },
      isActiveIcon: function (name) {
        return props.selectedName === name
      },
      iconColumns
    }
  }
})
</script>

<style lang="sass">
.active-icon
  color: rgba(25, 118, 210, 0.65)

.cart-icon
  color: rgba(255, 0, 0, 0.65)
</style>