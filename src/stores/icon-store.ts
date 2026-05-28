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
const savedKeys = ['iconSize', 'iconColumns', 'tooltips'] as const
type SavedKey = (typeof savedKeys)[number]

function isSavedKey(key: string): key is SavedKey {
  return (savedKeys as readonly string[]).includes(key)
}

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
      this.cart = {}
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
          LocalStorage.set(key, this[key])
        }
      }
    },
    loadStore() {
      const keys = LocalStorage.getAllKeys()
      for (const key of keys) {
        if (isSavedKey(key) !== true) {
          continue
        }

        const value = LocalStorage.getItem(key)

        switch (key) {
          case 'iconSize':
            if (typeof value === 'string') this.iconSize = value
            break
          case 'iconColumns':
            if (typeof value === 'string') this.iconColumns = value
            break
          case 'tooltips':
            if (typeof value === 'boolean') this.tooltips = value
            break
        }
      }
      this.initialized = true
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useIconStore, import.meta.hot))
}
