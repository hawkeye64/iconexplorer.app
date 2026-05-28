<template>
  <div class="text-grey-8">
    <q-virtual-scroll
      :key="virtualGridKey"
      class="svg-icon-virtual-scroll q-pr-sm q-py-sm"
      scroll-target="body"
      :items="iconRows"
      :virtual-scroll-item-size="virtualRowSize"
      :virtual-scroll-slice-size="24"
      :virtual-scroll-slice-ratio-before="1"
      :virtual-scroll-slice-ratio-after="2"
    >
      <template #default="{ item: row, index }">
        <div
          :key="index"
          class="row justify-center q-col-gutter-sm svg-icon-row"
          :style="{ minHeight: `${virtualRowSize}px` }"
        >
          <div
            v-for="{ path, name } in row"
            :key="name"
            :class="cellColumns"
            class="intersection-icon-box"
            @click.stop="onClick({ path, name })"
          >
            <q-card
              flat
              class="intersection-icon-box--inner row full-width justify-center items-center q-pa-xs svg-item-border"
              :class="{
                'active-icon': isActiveIcon(name),
                'cart-icon': common.isCartIcon(name),
              }"
              :style="{ minHeight: `${iconCardHeight}px` }"
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
                  @click.stop="
                    iconSet && importToClipboard(name, iconSet.packageName, iconSet.value)
                  "
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
                <span
                  class="overflow-hidden ellipsis"
                  v-html="common.filter ? getName(name) : name"
                />
              </div>
              <q-tooltip
                v-if="iconStore.tooltips"
                :delay="250"
                class="primary"
                style="font-size: 24px"
              >
                {{ name }}
              </q-tooltip>
            </q-card>
          </div>
        </div>
      </template>
    </q-virtual-scroll>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuasar, copyToClipboard } from 'quasar'
import { useIconStore } from '@/stores/icon-store'
import { createFilterRegex, useCommon } from '@/assets/useCommon'
import { mdiContentCopy, mdiImport } from '@quasar/extras/mdi-v7'

type IconEntry = {
  name: string
  path: string
}

const props = defineProps<{
  icons: Record<string, string>
  selectedName: string
}>()

const emit = defineEmits<{
  selected: [payload: IconEntry]
}>()

const iconStore = useIconStore()
const $q = useQuasar()
const common = useCommon()

const defaultIconSet = {
  label: '',
  value: '',
  packageName: '',
}

const iconSet = computed(() => common.iconSet.value || defaultIconSet)

const columnCount = computed(() => {
  switch (iconStore.iconColumns) {
    case '1':
      return 1
    case '2':
      return 2
    case '3':
      return 3
    case '4':
      return 4
    case '6':
      return 6
    case '12':
      return 12
    case 'responsive':
    default:
      if ($q.screen.xl) return 12
      if ($q.screen.lg) return 6
      if ($q.screen.md) return 4
      if ($q.screen.sm) return 3
      return 2
  }
})

const cellColumns = computed(() => {
  return `col-${12 / columnCount.value}`
})

const iconEntries = computed<IconEntry[]>(() => {
  return Object.entries(props.icons).map(([name, path]) => ({
    name,
    path,
  }))
})

const iconRows = computed<IconEntry[][]>(() => {
  const rows: IconEntry[][] = []
  const columns = columnCount.value

  for (let index = 0; index < iconEntries.value.length; index += columns) {
    rows.push(iconEntries.value.slice(index, index + columns))
  }

  return rows
})

const iconPixelSize = computed(() => {
  const value = iconStore.iconSize
  const parsed = Number.parseInt(value, 10)

  if (Number.isFinite(parsed)) {
    return parsed
  }

  const namedSizes: Record<string, number> = {
    xs: 18,
    sm: 24,
    md: 32,
    lg: 38,
    xl: 46,
  }

  return namedSizes[value] ?? 32
})

const iconCardHeight = computed(() => {
  return Math.max(iconPixelSize.value + 80, 120)
})

const virtualRowSize = computed(() => {
  return iconCardHeight.value + 16
})

const virtualGridKey = computed(() => {
  return `${columnCount.value}:${virtualRowSize.value}:${iconEntries.value.length}`
})

function getName(name: string): string {
  if (common.filter.value) {
    const filterRe = createFilterRegex(common.filter.value, 'ig').regex

    if (filterRe === null) {
      return name
    }

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
