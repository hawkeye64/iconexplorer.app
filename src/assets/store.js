import { inject, reactive, computed, watch } from 'vue'
import { LocalStorage } from 'quasar'
import { flattenedIconSets } from 'src/icon-sets'
import { storeKey } from './symbols.js'

/**
 * @typedef {{ label: string, value: string, packageName: string, status: string }} IconSet
 */

/**
 * @typedef {Object} Store
 *
 * @property {IconSet} [iconSet]
 * @property {string} filter
 * @property {string} iconSize
 * @property {string} iconColumns
 *
 * @property {boolean} leftDrawerOpen
 * @property {boolean} rightDrawerOpen
 * @property {boolean} settingsDrawerOpen
 * @property {boolean} showIconDialog
 * @property {boolean} tooltips
 *
 * @property {{ [packageName: string]: { [iconSetName: string]: { [iconName: string]: string } } }} cart
 * @property {{ packageName: string, iconSet: string, iconName: string, path: string }} selectedIconsFlattened
 * @property {(iconName: string) => boolean} isCartIcon
 * @property {(packageName: string, iconSet: string, name: string) => string | null} findItem
 * @property {(packageName: string, iconSet: string, name: string) => boolean} removeItem
 * @property {(packageName: string, iconSet: string, name: string, path: string) => boolean} addItem
 *
 * @property {() => void} saveStore
 * @property {() => void} loadStore
 * @property {(app: import('vue').App) => void} install
 */

/**
 * @returns {Store}
 */
export function useStore () {
  return inject(storeKey)
}

/**
 * @param {{ router: import('vue-router').Router }}
 * @returns {Store}
 */
export function createStore ({ router }) {
  /** @type {Store} */
  const store = reactive({
    filter: '',
    iconSize: '148px',
    iconColumns: 'reactive',
    cart: {},
    leftDrawerOpen: false,
    rightDrawerOpen: false,
    settingsDrawerOpen: false,
    showIconDialog: false,
    tooltips: true
  })

  const savedKeys = [
    'filter',
    'iconSize',
    'iconColumns',
    'tooltips'
  ]

  let initialized = false

  watch(store, val => {
    saveStore()
  })

  const route = router.currentRoute

  store.iconSet = computed(() =>
    (route.value.params.iconSet
      ? flattenedIconSets.find(iconSet => iconSet.value === route.value.params.iconSet)
      : undefined)
  )

  function saveStore () {
    if (initialized) {
      for (const key in savedKeys) {
        LocalStorage.set(savedKeys[ key ], store[ savedKeys[ key ] ])
      }
    }
  }

  store.saveStore = saveStore

  function loadStore () {
    const keys = LocalStorage.getAllKeys()
    for (const key in keys) {
      store[ keys[ key ] ] = LocalStorage.getItem(keys[ key ])
      if (keys[ key ] === 'filter' && store.filter === 'null') store.filter = ''
    }
    initialized = true
  }

  store.loadStore = loadStore

  /*
    cart looks like this:
    {
      [packageName]: {
        [iconSet]: {
          [iconName]: path,
          ...
        },
        ...
      }
    }
  */

  store.addItem = function (packageName, iconSet, name, path) {
    const item = store.findItem(packageName, iconSet, name)
    if (!item) {
      if (!store.cart[ packageName ]) store.cart[ packageName ] = {}
      if (!store.cart[ packageName ][ iconSet ]) store.cart[ packageName ][ iconSet ] = {}
      store.cart[ packageName ][ iconSet ][ name ] = path

      return true
    }
    return false
  }

  store.removeItem = function (packageName, iconSet, name) {
    if (store.cart[ packageName ]) {
      if (store.cart[ packageName ][ iconSet ]) {
        if (store.cart[ packageName ][ iconSet ][ name ]) {
          delete store.cart[ packageName ][ iconSet ][ name ]
          // should parents be removed?
          if (Object.keys(store.cart[ packageName ][ iconSet ]).length === 0) {
            delete store.cart[ packageName ][ iconSet ]
            if (Object.keys(store.cart[ packageName ]).length === 0) {
              delete store.cart[ packageName ]
            }
          }
          return true
        }
      }
    }
    return false
  }

  store.removeAll = function () {
    const keys = Object.keys(store.cart)
    for (let index = 0; index < keys.length; ++index) {
      delete store.cart[ keys[ index ] ]
    }
  }

  // returns store item or null
  store.findItem = function (packageName, iconSet, name) {
    if (store.cart[ packageName ]) {
      if (store.cart[ packageName ][ iconSet ]) {
        if (store.cart[ packageName ][ iconSet ][ name ]) {
          return store.cart[ packageName ][ iconSet ][ name ]
        }
      }
    }

    return null // not found
  }

  store.selectedIconsFlattened = computed(() => {
    const icons = [];
    for (const packageName in store.cart) {
      for (const iconSet in store.cart[ packageName ]) {
        for (const iconName in store.cart[ packageName ][ iconSet ]) {
          const path = store.cart[ packageName ][ iconSet ][ iconName ]
          icons.push({
            packageName,
            iconSet,
            iconName,
            path
          })
        }
      }
    }

    return icons
  })

  store.isCartIcon = function (name) {
    for (let index = 0; index < store.selectedIconsFlattened.length; ++index) {
      if (store.selectedIconsFlattened[ index ].iconName === name) {
        return true
      }
    }
    return false
  }

  // Vue plugin install method
  store.install = (app) => {
    app.provide(storeKey, store)
  }

  return store
}
