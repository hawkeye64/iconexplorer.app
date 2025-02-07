import { computed, watch, type WritableComputedRef, type ComputedRef } from 'vue'
import { useIconStore } from 'stores/icon-store'
import { useRouter } from 'vue-router'
import { flattenedIconSets, iconSets } from 'src/icon-sets'

export type IconSet = {
  label: string
  value: string
  packageName: string
  icons?: boolean
  status?: string
}

export type Icon = {
  packageName: string
  iconSet: string
  iconName: string
  path: string
}

// these keys get saved to LocalStorage
const savedKeys = ['iconSize', 'iconColumns', 'tooltips']

const extrasJson = import.meta.glob('../../node_modules/@quasar/extras/**/*/icons.json')
const extrasModules = import.meta.glob('../../node_modules/@quasar/extras/**/*/*.mjs')

const quasarExtrasSvgIconsJson = import.meta.glob(
  '../../node_modules/quasar-extras-svg-icons/**/*/icons.json',
)
const quasarExtrasSvgIconsModules = import.meta.glob(
  '../../node_modules/quasar-extras-svg-icons/**/*/*.mjs',
)

export function useCommon(): {
  selected: WritableComputedRef<string>
  filter: WritableComputedRef<string | null>
  iconSet: ComputedRef<IconSet | undefined>
  selectedIconsFlattened: ComputedRef<Icon[]>
  relatedIconSets: ComputedRef<string[]>
  isCartIcon: (_name: string) => boolean
  loadIconNames: () => Promise<void>
  extrasModules: Record<string, () => Promise<any>>
  quasarExtrasSvgIconsModules: Record<string, () => Promise<any>>
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
      return (router.currentRoute.value.query.selected || '') as unknown as string
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

  const relatedIconSets = computed(() => {
    // Removed side effects (setting iconStore.searching) from this computed getter.
    const related: string[] = []
    const filt: string | null = Array.isArray(filter.value) ? filter.value[0] || null : filter.value
    if (filt) {
      const re = new RegExp(filt, 'i')
      for (const pkg in iconStore.iconNames) {
        for (const iconSet in iconStore.iconNames[pkg]) {
          if (iconStore.iconNames[pkg][iconSet]!.some((icon) => re.test(icon))) {
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

  async function loadExtras(iconSet: IconSet): Promise<any> {
    const modulePath = `../../node_modules/@quasar/extras/${iconSet.value}/icons.json`
    if (extrasJson[modulePath]) {
      return await extrasJson[modulePath]()
    }
  }

  async function loadSvgIcons(iconSet: IconSet): Promise<any> {
    const modulePath = `../../node_modules/quasar-extras-svg-icons/${iconSet.value}/icons.json`
    if (quasarExtrasSvgIconsJson[modulePath]) {
      return await quasarExtrasSvgIconsJson[modulePath]()
    }
  }

  async function loadIconNames(): Promise<void> {
    for (const iconPackage of iconSets) {
      for (const iconSet of iconPackage.children) {
        if (iconSet.icons === true) {
          if (iconPackage.label === '@quasar/extras') {
            const module = await loadExtras(iconSet)
            if (module && 'default' in module) {
              const jsonFile = module.default
              if (!iconStore.iconNames[iconPackage.label])
                iconStore.iconNames[iconPackage.label] = {}
              if (!iconStore.iconNames[iconPackage.label]![iconSet.value])
                iconStore.iconNames[iconPackage.label]![iconSet.value] = []
              iconStore.totalIcons += jsonFile.length
              iconStore.iconNames[iconPackage.label]![iconSet.value]!.push(...jsonFile)
            }
          } else if (iconPackage.label === 'quasar-extras-svg-icons') {
            const module = await loadSvgIcons(iconSet)
            if (module && 'default' in module) {
              const jsonFile = module.default
              if (!iconStore.iconNames[iconPackage.label])
                iconStore.iconNames[iconPackage.label] = {}
              if (!iconStore.iconNames[iconPackage.label]![iconSet.value])
                iconStore.iconNames[iconPackage.label]![iconSet.value] = []
              iconStore.totalIcons += jsonFile.length
              iconStore.iconNames[iconPackage.label]![iconSet.value]!.push(...jsonFile)
            }
          }
        }
      }
    }
  }

  return {
    selected,
    filter,
    iconSet,
    selectedIconsFlattened,
    relatedIconSets,
    isCartIcon,
    loadIconNames,
    extrasModules,
    quasarExtrasSvgIconsModules,
  }
}
