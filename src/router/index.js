import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../views/Index.vue'

Vue.use(VueRouter)

  const routes = [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: index
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    }
]

const router = new VueRouter({
  routes
})

export default router
