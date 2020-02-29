import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Volunteers from '../views/Volunteers.vue'
import Schedules from '../views/Schedules.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/volunteers',
    name: 'Volunteers',
    // route level code-splitting
    // this generates a separate chunk (volunteers.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "volunteers" */ '../views/Volunteers.vue')
    }
  },
  {
    path: '/schedules',
    name: 'Schedules',
    // route level code-splitting
    // this generates a separate chunk (schedules.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "Schedules" */ '../views/Schedules.vue')
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
