import { boot } from 'quasar/wrappers'
import { createStore } from 'assets/store'

export default boot(({ app, router }) => {
  const store = createStore({ router })

  if (process.env.CLIENT) {
    store.loadStore()
  }

  app.use(store)
})
