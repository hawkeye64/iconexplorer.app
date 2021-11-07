const hasSymbol = typeof Symbol === 'function'
  && typeof Symbol.toStringTag === 'symbol'

export const storeKey = hasSymbol === true
  ? Symbol('_store_')
  : '_store_'
