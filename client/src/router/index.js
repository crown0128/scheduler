import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Volunteers from '../views/Volunteers.vue'
import Schedules from '../views/Schedules.vue'
import NotFound from '../components/NotFound.vue'
// test
import EditVolunteer from '../components/EditVolunteer'

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
  },
  {
    path: '/volunteer/:id', 
    name: 'EditVolunteer',
    component: function () {
      return import('../components/EditVolunteer.vue')
    }
  },
  {
    path: '/schedule/weeklyevents/:id', 
    name: 'EditWeeklyEvents',
    component: function () {
      return import('../components/EditWeeklyEvents.vue')
    }
  },
  {
    path: '/schedule/rolesneeded/:id', 
    name: 'EditRolesNeeded',
    component: function () {
      return import('../components/EditRolesNeeded.vue')
    }
  },
  {
    path: '*', 
    name: 'NotFound',
    component: function () {
      return import('../components/NotFound.vue')
    }
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
