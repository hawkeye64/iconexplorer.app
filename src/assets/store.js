import { inject, provide, reactive, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { storeKey } from './symbols.js'

export function useStore () {
  return inject(storeKey)
}

export function provideStore () {
  const $q = useQuasar()
  const makeReactive = process.env.SERVER !== true ? reactive : val => val
  const store = makeReactive({
    importedIcons: null,
    filter: '',
    iconSet: null,
    iconSize: '192px',
    iconColumns: 'normal',
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

  function saveStore () {
    if (initialized) {
      for (const key in savedKeys) {
        $q.localStorage.set(savedKeys[ key ], store[ savedKeys[ key ] ])
      }
    }
  }

  store.saveStore = saveStore

  function loadStore () {
    const keys = $q.localStorage.getAllKeys()
    for (const key in keys) {
      store[ keys[ key ] ] = $q.localStorage.getItem(keys[ key ])
      if (keys[ key ] === 'filter' && store.filter === 'null') store.filter = ''
    }
    initialized = true
  }

  store.loadStore = loadStore

  /*
    cart looks like this:
    {
      packageName: {
        iconSet: {
          iconName: path,
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

  // When not SSR, this becomes reactive (when injected into store)
  // but, on server, it's not reactive and need '.value' when accessing it
  // should not be a problem because adding/removing from the cart is user initiated
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

  provide(
    storeKey,
    store
  )

  return {
    loadStore
  }
}
