import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    redirect: '/map'
  },
  {
    path: '/sellerpage',
    name: 'SellerPage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/SellerPage.vue')
  },
  {
    path: '/trend',
    name: 'TrendPage',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/TrendPage.vue')
  },
  {
    path: '/map',
    name: 'MapPage',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/MapPage.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
