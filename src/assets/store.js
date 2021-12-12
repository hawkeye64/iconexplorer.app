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
 * @property {number} totalIcons
 * @property {boolean} searching
 * @property {boolean} loading
 * @property {{ [packageName: string]: { [iconSetName: string]: [ [iconName: string]: string ] } }} iconNames
 * @property {{ [ [iconSetName: string]: string ] }} relatedIconSets
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

import { iconSets } from 'src/icon-sets'

function isObject (obj) {
  return obj === Object(obj);
}

function isArray (arr) {
  return arr && Array.isArray(arr) && arr.constructor === Array
}

/**
 * @param {{ router: import('vue-router').Router }}
 * @returns {Store}
 */
export function createStore ({ router }) {
  /** @type {Store} */
  const store = reactive({
    iconSize: '148px',
    iconColumns: 'responsive',
    cart: {},
    leftDrawerOpen: false,
    rightDrawerOpen: false,
    settingsDrawerOpen: false,
    showIconDialog: false,
    tooltips: true,
    totalIcons: 0,
    iconNames: {},
    searching: false,
    loading: false
  })

  // these keys get saved to LocalStorage
  const savedKeys = [
    'iconSize',
    'iconColumns',
    'tooltips'
  ]

  let initialized = false

  watch(savedKeys.map((key) => (() => store[ key ])), () => {
    saveStore()
  })

  const route = router.currentRoute

  store.iconSet = computed(() =>
    (route.value.params.iconSet
      ? flattenedIconSets.find(iconSet => iconSet.value === route.value.params.iconSet)
      : undefined)
  )

  router.beforeEach((to, from) => {
    if (to.query.filter === undefined && from.query.filter !== undefined) {
      to.query.filter = to.query.filter || from.query.filter
    
      return to
    }
  })

  store.filter = computed({
    get: () => route.value.query.filter || '',
    set: val => {
      router.replace({
        query: {
          ...route.value.query,
          filter: val || null
        }
      })
    }
  })

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
    if (store.cart[ packageName ]
      && store.cart[ packageName ][ iconSet ]
      && store.cart[ packageName ][ iconSet ][ name ]) {
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
    if (store.cart[ packageName ]
      && store.cart[ packageName ][ iconSet ]
      && store.cart[ packageName ][ iconSet ][ name ]) {
      return store.cart[ packageName ][ iconSet ][ name ]
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

  store.relatedIconSets = computed(() => {
    store.searching = true
    const related = []
    const filt = store.filter
    if (filt) {
      const re = new RegExp(filt, 'i')
      for (const pkg in store.iconNames) {
        for (const iconSet in store.iconNames[ pkg ]) {
          // 'every' stops on the first returned false
          // we are not looking for icons here, just the icon set
          // that contain at least one matching icon
          store.iconNames[ pkg ][ iconSet ].every(icon => {
            // the regex removes the prefix for more accurate matching
            if (icon && typeof icon === 'string' && re.test(String(icon).replace(/^[a-z]+/, ''))) {
              re.lastIndex = 0
              // add icon set name
              related.push(iconSet)
              return false // 'every' stops on first false
            }
            if (re.lastIndex) re.lastIndex = 0
            return true
          })
        }
      }
    }

    store.searching = false
    return related
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

  async function loadExtras (iconSet) {
    return await import(
      /* webpackChunkName: "[request]" */
      /* webpackInclude: /icons\.json$/ */
      /* webpackExclude: /(mdi-v4|mdi-v5|ionicons-v4|ionicons-v5)/ */
      '@quasar/extras/' + iconSet.value + '/icons.json'
    )
  }

  async function loadSvgIcons (iconSet) {
    return await import(
      /* webpackChunkName: "[request]" */
      /* webpackInclude: /icons\.json$/ */
      'quasar-extras-svg-icons/' + iconSet.value + '/icons.json'
    )
  }

  async function loadIconNames () {
    for (const iconPackage of iconSets) {
      for (const iconSet of iconPackage.children) {
        if (iconSet.icons === true) {
          if (iconPackage.label === '@quasar/extras') {
            const jsonFile = await loadExtras(iconSet)
            if (!isObject(store.iconNames[ iconPackage.label ])) store.iconNames[ iconPackage.label ] = {}
            if (!isArray(store.iconNames[ iconPackage.label ][ iconSet.value ])) store.iconNames[ iconPackage.label ][ iconSet.value ] = []
            Object.keys(jsonFile).forEach(key => {
              store.totalIcons++
              store.iconNames[ iconPackage.label ][ iconSet.value ].push(jsonFile[ key ])
            })
          }
          else if (iconPackage.label === 'quasar-extras-svg-icons') {
            const jsonFile = await loadSvgIcons(iconSet)
            if (!isObject(store.iconNames[ iconPackage.label ])) store.iconNames[ iconPackage.label ] = {}
            if (!isArray(store.iconNames[ iconPackage.label ][ iconSet.value ])) store.iconNames[ iconPackage.label ][ iconSet.value ] = []
            Object.keys(jsonFile).forEach(key => {
              store.totalIcons++
              store.iconNames[ iconPackage.label ][ iconSet.value ].push(jsonFile[ key ])
            })
          }
        }
      }
    }
  }

  loadIconNames()

  return store
}
