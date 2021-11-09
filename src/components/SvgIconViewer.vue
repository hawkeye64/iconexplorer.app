<template>
  <div class="row justify-center">
    <q-intersection
      v-for="(path, name) in icons"
      :key="name"
      once
      class="intersetion-icon-box col-xl-1 col-lg-2 col-md-3 col-sm-4 col-xs-6"
      @click="onClick({ path, name })"
    >
      <div
        class="intersetion-icon-box--inner row full-width justify-center items-center overflow-hidden ellipsis"
        :class="{
          'active-icon': isActiveIcon(name),
          'cart-icon': store.isCartIcon(name)
        }"
      >
        <q-icon
          :name="path"
          size="60px"
          class="q-pa-xs row full-width justify-center items-center"
        />
        <div
          class="row full-width justify-center items-center ellipsis"
          style="font-size: 10px;"
        >
          {{ name }}
        </div>
        <q-tooltip
          :delay="250"
          class="primary"
          style="font-size: 24px;"
        >
          {{ name }}
        </q-tooltip>
      </div>
    </q-intersection>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
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

    return {
      store,
       onClick: function ({ path, name }) {
        emit('selected', { path, name })
      },
      isActiveIcon: function (name) {
        return props.selectedName === name
      }
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