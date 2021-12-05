// import { iconSets } from 'src/icon-sets'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // TODO: Display a landing page of some sort, maybe some instructions that says "select an icon set to get started", and use a separate component
      { path: '', name: 'index', component: () => import('pages/Index.vue') },
      { path: 'icons/:iconSet', name: 'icons', component: () => import('pages/Index.vue') },
      // { path: 'icon-set/:iconSet?', name: 'index', component: () => import('pages/IconSet.vue') },

      // ...iconSets.flatMap(({ children }) => children.map(({ value }) => ({ path: value })))
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
