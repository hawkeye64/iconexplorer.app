import { inject, provide, ref, reactive } from 'vue'
import { storeKey } from './symbols.js'

export function useStore () {
  return inject(storeKey)
}

export function provideStore () {
  const makeRef = process.env.SERVER !== true ? ref : val => val
  const makeReactive = process.env.SERVER !== true ? reactive : val => val
  const store = makeReactive({
    importedIcons: null,
    filter: '',
    iconSet: null,
    iconSize: '128px',
    cart: {},
    leftDrawerOpen: false,
    rightDrawerOpen: false,
    showIconDialog: false
  })

  /*
    cart looks like this:
    {
      packageName: {
        importName: path,
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
      console.log('cart:', store.cart)
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

  provide(
    storeKey,
    store
  )
}
