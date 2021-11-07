<template>
  <div class="row justify-center">
    <q-intersection
      v-for="(path, name) in icons"
      :key="name"
      once
      class="intersetion-icon-box col-xl-1 col-lg-2 col-md-3 col-sm-4 col-xs-6"
      @click="onClick(path, name)"
    >
      <div class="intersetion-icon-box--inner row full-width justify-center items-center overflow-hidden ellipsis">
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
          :delay="1000"
          class="primary"
        >
          {{ name }}
        </q-tooltip>
      </div>
    </q-intersection>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SvgIconViewer',

  props: {
    icons: {
      type: Object,
      required: true
    }
  },

  emits: [
    'selected'
  ],

  setup (props, { emit }) {
    return {
       onClick: function (path, name) {
        emit('selected', { path, name })
      }
    }
  }
})
</script>