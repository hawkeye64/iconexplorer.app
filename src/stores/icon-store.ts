import { defineStore, acceptHMRUpdate } from 'pinia'
import { LocalStorage } from 'quasar'

type Cart = {
  [packageName: string]: {
    [iconSet: string]: {
      [iconName: string]: string
    }
  }
}

type IconNames = Record<string, Record<string, string[]>>

// these keys get saved to LocalStorage
const savedKeys = ['iconSize', 'iconColumns', 'tooltips']

export const useIconStore = defineStore('icon-store', {
  state: () => ({
    iconSize: '92px',
    iconColumns: 'responsive',
    cart: {} as Cart,
    leftDrawerOpen: false,
    rightDrawerOpen: false,
    settingsDrawerOpen: false,
    showIconDialog: false,
    tooltips: true,
    totalIcons: 0,
    iconNames: {} as IconNames,
    searching: false,
    loading: false,
    initialized: false,
  }),
  getters: {},
  actions: {
    addItem(packageName: string, iconSet: string, name: string, path: string) {
      const item = this.findItem(packageName, iconSet, name)
      if (!item) {
        if (!this.cart[packageName]) this.cart[packageName] = {}
        if (!this.cart[packageName][iconSet]) this.cart[packageName][iconSet] = {}
        this.cart[packageName][iconSet][name] = path
        return true
      }
      return false
    },
    removeItem(packageName: string, iconSet: string, name: string) {
      if (
        this.cart[packageName] &&
        this.cart[packageName][iconSet] &&
        this.cart[packageName][iconSet][name]
      ) {
        delete this.cart[packageName][iconSet][name]
        if (Object.keys(this.cart[packageName][iconSet]).length === 0) {
          delete this.cart[packageName][iconSet]
          if (Object.keys(this.cart[packageName]).length === 0) {
            delete this.cart[packageName]
          }
        }
        return true
      }
      return false
    },
    removeAll() {
      const keys = Object.keys(this.cart)
      for (let index = 0; index < keys.length; ++index) {
        // @ts-expect-error ignore for now
        delete this.cart[keys[index]]
      }
    },
    findItem(packageName: string, iconSet: string, name: string) {
      if (
        this.cart[packageName] &&
        this.cart[packageName][iconSet] &&
        this.cart[packageName][iconSet][name]
      ) {
        return this.cart[packageName][iconSet][name]
      }
      return null
    },
    saveStore() {
      if (this.initialized) {
        for (const key of savedKeys) {
          // @ts-expect-error ignore for now
          LocalStorage.set(key, this[key])
        }
      }
    },
    loadStore() {
      const keys = LocalStorage.getAllKeys()
      for (const key of keys) {
        // @ts-expect-error ignore for now
        this[key] = LocalStorage.getItem(key)
      }
      this.initialized = true
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useIconStore, import.meta.hot))
}
