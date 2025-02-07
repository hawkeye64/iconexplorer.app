<template>
  <div class="row justify-center text-grey-8 q-pr-sm q-py-sm overflow-hidden q-gutter-sm">
    <q-intersection
      v-for="(path, name) in icons"
      :key="name"
      once
      :class="iconColumns"
      @click.stop="onClick({ path, name })"
    >
      <q-card
        flat
        class="intersection-icon-box--inner row full-width justify-center items-center q-pa-xs svg-item-border"
        :class="{
          'active-icon': isActiveIcon(name),
          'cart-icon': common.isCartIcon(name),
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
              self="bottom middle"
              :offset="[10, 10]"
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
            @click.stop="iconSet && importToClipboard(name, iconSet.packageName, iconSet.value)"
          >
            <q-tooltip
              anchor="top middle"
              self="bottom middle"
              :offset="[10, 10]"
              class="primary my-tooltip"
            >
              Copy "import &#123; {{ name }} &#125; from '{{ iconSet.packageName }}/{{
                iconSet.value
              }}'" to clipboard
            </q-tooltip>
          </q-btn>
        </div>
        <q-icon
          :name="path"
          :size="iconStore.iconSize"
          class="q-pa-xs row full-width justify-center items-center"
          @touchstart.stop="onClick({ path, name })"
        />
        <div class="row full-width justify-center items-center" style="font-size: 16px">
          <span class="overflow-hidden ellipsis" v-html="common.filter ? getName(name) : name" />
        </div>
        <q-tooltip v-if="iconStore.tooltips" :delay="250" class="primary" style="font-size: 24px">
          {{ name }}
        </q-tooltip>
      </q-card>
    </q-intersection>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuasar, copyToClipboard } from 'quasar'
import { useIconStore } from 'stores/icon-store'
import { useCommon } from 'assets/useCommon'
import { mdiContentCopy, mdiImport } from '@quasar/extras/mdi-v7'

const props = defineProps({
  icons: {
    type: Object,
    required: true,
  },
  selectedName: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['selected'])

const iconStore = useIconStore()
const $q = useQuasar()
const common = useCommon()

const defaultIconSet = {
  label: '',
  value: '',
  packageName: '',
}

const iconSet = computed(() => common.iconSet.value || defaultIconSet)

const iconColumns = computed(() => {
  let classes = 'intersection-icon-box '

  switch (iconStore.iconColumns) {
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

function getName(name: string): string {
  if (common.filter.value) {
    const filterRe = new RegExp(common.filter.value, 'ig')
    const match = name.match(filterRe)
    if (match && Array.isArray(match)) {
      match.forEach((str) => {
        name = name.replace(str, `<mark>${str}</mark>`)
      })
    }
  }

  return name
}

function nameToClipboard(iconName: string): void {
  sendToClipboard(iconName)
}

function importToClipboard(iconName: string, packageName: string, iconSet: string): void {
  const inline = `import { ${iconName} } from '${packageName}/${iconSet}'`
  sendToClipboard(inline)
}

function sendToClipboard(data: string): void {
  copyToClipboard(data)
    .then(() => {
      $q.notify({
        message: `'${data}' copied to clipboard`,
        position: 'top',
        color: 'white',
        textColor: 'primary',
      })
    })
    .catch((error) => {
      console.error(error)
    })
}

function onClick({ path, name }: { path: string; name: string }): void {
  emit('selected', { path, name })
}

const isActiveIcon = (name: string): boolean => props.selectedName === name
</script>

<style lang="scss">
.active-icon {
  color: rgb(25, 118, 210);
}

.cart-icon {
  color: rgb(255, 0, 0);
}

.svg-item-border {
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.q-dark div,
.body--dark div {
  .svg-item-border {
    border: 1px solid rgba(255, 255, 255, 0.12);
  }
}
</style>
