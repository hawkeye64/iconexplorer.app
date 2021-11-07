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
    cart: []
  })

  store.addItem = function (name, path) {
    const index = store.findItem(name)
    if (index === -1) {
      store.cart.push({ name, path })
      console.log('cart:', store.cart)
      return true
    }
    return false
  }

  store.removeItem = function (name) {
    const index = store.findItem(name)
    if (index > -1) {
      store.cart.splice(index, 1)
      return true
    }
    return false
  }

  // returns index
  store.findItem = function (name) {
    for (let index = 0; index < store.cart.length; ++index) {
      if (store.cart[ index ].name === name) {
        return index
      }
    }
    return -1 // not found
  }

  provide(
    storeKey,
    store
  )
}
