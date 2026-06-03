import { computed, watch, type WritableComputedRef, type ComputedRef } from 'vue'
import { useIconStore } from '@/stores/icon-store'
import { useRouter } from 'vue-router'
import { flattenedIconSets, iconSets, type IconSet } from '@/icon-sets'
import {
  extrasJson,
  extrasModules,
  type IconJsonModule,
  type IconModule,
  type IconNamePayload,
  quasarExtrasSvgIconsJson,
  quasarExtrasSvgIconsModules,
} from './icon-modules'

export type Icon = {
  packageName: string
  iconSet: string
  iconName: string
  path: string
}

export type FilterRegex = {
  error: string | null
  pattern: string
  regex: RegExp | null
}

type IconNamesByPackage = Record<string, Record<string, string[]>>

// these keys get saved to LocalStorage
const savedKeys = ['iconSize', 'iconColumns', 'tooltips']

function normalizeIconNames(payload: IconNamePayload): string[] {
  if (Array.isArray(payload)) {
    return payload
  }

  if (typeof payload === 'string') {
    try {
      return normalizeIconNames(JSON.parse(payload) as IconNamePayload)
    } catch {
      return []
    }
  }

  return Object.keys(payload)
}

function getFilterPattern(value: string | (string | null)[] | null | undefined): string {
  if (Array.isArray(value)) {
    return value.find((item): item is string => typeof item === 'string') || ''
  }

  return value || ''
}

export function createFilterRegex(
  value: string | (string | null)[] | null | undefined,
  flags = 'i',
): FilterRegex {
  const pattern = getFilterPattern(value)

  if (pattern.length === 0) {
    return {
      error: null,
      pattern,
      regex: null,
    }
  }

  try {
    return {
      error: null,
      pattern,
      regex: new RegExp(pattern, flags),
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Invalid regular expression',
      pattern,
      regex: null,
    }
  }
}

export function useCommon(): {
  selected: WritableComputedRef<string>
  filter: WritableComputedRef<string | null>
  filterRegex: ComputedRef<FilterRegex>
  iconSet: ComputedRef<IconSet | undefined>
  selectedIconsFlattened: ComputedRef<Icon[]>
  relatedIconSets: ComputedRef<string[]>
  isCartIcon: (_name: string) => boolean
  loadIconNames: () => Promise<void>
  extrasModules: Record<string, () => Promise<IconModule>>
  quasarExtrasSvgIconsModules: Record<string, () => Promise<IconModule>>
} {
  const iconStore = useIconStore()
  const router = useRouter()

  // Changed the watch() call to use a single getter that returns an array of the saved keys.
  watch(
    () => savedKeys.map((key) => iconStore[key as keyof typeof iconStore]),
    () => {
      iconStore.saveStore()
    },
  )

  const selected = computed({
    get: () => {
      // Ensure that we always return a string.
      return getFilterPattern(router.currentRoute.value.query.selected)
    },
    set: (val: string) => {
      router
        .replace({
          query: {
            ...router.currentRoute.value.query,
            selected: val || null,
          },
        })
        .catch((error) => {
          console.error('Failed to replace route:', error)
        })
    },
  })

  const filter = computed({
    get: () => (router.currentRoute.value.query.filter || '') as string,
    set: (val: string) => {
      router
        .replace({
          query: {
            ...router.currentRoute.value.query,
            filter: val || null,
          },
        })
        .catch((error) => {
          console.error('Failed to replace route:', error)
        })
    },
  })

  const selectedIconsFlattened = computed<Icon[]>(() => {
    const icons = []
    for (const packageName in iconStore.cart) {
      for (const iconSet in iconStore.cart[packageName]) {
        for (const iconName in iconStore.cart[packageName][iconSet]) {
          const path = iconStore.cart[packageName][iconSet][iconName]
          icons.push({
            packageName,
            iconSet,
            iconName,
            path: path || '',
          })
        }
      }
    }
    return icons as Icon[]
  })

  const iconSet = computed(() => {
    const route = router.currentRoute.value
    return flattenedIconSets.find((iconSet) => iconSet.value === route.params.iconSet)
  })

  const filterRegex = computed(() => createFilterRegex(filter.value))

  const relatedIconSets = computed(() => {
    // Removed side effects (setting iconStore.searching) from this computed getter.
    const related: string[] = []
    const { regex } = filterRegex.value
    if (regex) {
      for (const pkg in iconStore.iconNames) {
        for (const iconSet in iconStore.iconNames[pkg]) {
          if (iconStore.iconNames[pkg][iconSet]!.some((icon) => regex.test(icon))) {
            related.push(iconSet)
          }
        }
      }
    }
    return related
  })

  function isCartIcon(name: string): boolean {
    if (selectedIconsFlattened.value) {
      for (let index = 0; index < selectedIconsFlattened.value.length; ++index) {
        if (selectedIconsFlattened.value[index] && selectedIconsFlattened.value[index]!.iconName) {
          if (selectedIconsFlattened.value[index]!.iconName === name) {
            return true
          }
        }
      }
    }
    return false
  }

  async function loadExtras(iconSet: IconSet): Promise<IconJsonModule | undefined> {
    const modulePath = `../../node_modules/@quasar/extras/exports/${iconSet.value}/icons.json`
    if (extrasJson[modulePath]) {
      return await extrasJson[modulePath]()
    }
  }

  async function loadSvgIcons(iconSet: IconSet): Promise<IconJsonModule | undefined> {
    const modulePath = `../../node_modules/quasar-extras-svg-icons/${iconSet.value}/icons.json`
    if (quasarExtrasSvgIconsJson[modulePath]) {
      return await quasarExtrasSvgIconsJson[modulePath]()
    }
  }

  async function loadIconNames(): Promise<void> {
    let totalIcons = 0
    const iconNamesByPackage: IconNamesByPackage = {}

    for (const iconPackage of iconSets) {
      for (const iconSet of iconPackage.children) {
        if (iconSet.icons === true) {
          if (iconPackage.label === '@quasar/extras') {
            const module = await loadExtras(iconSet)
            if (module && 'default' in module) {
              const iconNames = normalizeIconNames(module.default as IconNamePayload)
              if (!iconNamesByPackage[iconPackage.label]) iconNamesByPackage[iconPackage.label] = {}
              iconNamesByPackage[iconPackage.label]![iconSet.value] = iconNames
              totalIcons += iconNames.length
            }
          } else if (iconPackage.label === 'quasar-extras-svg-icons') {
            const module = await loadSvgIcons(iconSet)
            if (module && 'default' in module) {
              const iconNames = normalizeIconNames(module.default as IconNamePayload)
              if (!iconNamesByPackage[iconPackage.label]) iconNamesByPackage[iconPackage.label] = {}
              iconNamesByPackage[iconPackage.label]![iconSet.value] = iconNames
              totalIcons += iconNames.length
            }
          }
        }
      }
    }

    iconStore.iconNames = iconNamesByPackage
    iconStore.totalIcons = totalIcons
  }

  return {
    selected,
    filter,
    filterRegex,
    iconSet,
    selectedIconsFlattened,
    relatedIconSets,
    isCartIcon,
    loadIconNames,
    extrasModules,
    quasarExtrasSvgIconsModules,
  }
}
