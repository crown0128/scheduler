import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Schedules from '../views/Schedules.vue'
import Volunteers from '../views/Volunteers.vue'
import EditSchedule from '../views/EditSchedule.vue'
import EditVolunteer from '../views/EditVolunteer.vue'
import EditExistingVolunteer from '../views/EditExistingVolunteer.vue'
import NewVolunteer from '../components/NewVolunteer.vue'
import NotFound from '../components/NotFound.vue'
import RunSchedule from '../components/RunSchedule.vue'
// test

Vue.use(VueRouter)

// Client side routes, NOT api routes!

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },

  {
    path: '/schedules',
    name: 'Schedules',
    component: function () {
      return import('../views/Schedules.vue')
    }
  },

  {
    path: '/volunteers',
    name: 'Volunteers',
    component: function () {
      return import('../views/Volunteers.vue')
    }
  },

  {
    path: '/volunteers/volunteer/new',
    name: 'NewVolunteer',
    component: function () {
      return import('../components/NewVolunteer.vue')
    }
  },

  {
    path: '/schedules/:schedule',
    name: 'EditSchedule',
    component: function () {
      return import('../views/EditSchedule.vue')
    },
  },

  {
    path: '/schedules/run/:schedule',
    name: 'Run',
    component: function () {
      return import('../components/RunSchedule.vue')
    },
  },
  
  {
    path: '/volunteer/:id', 
    name: 'EditVolunteer',
    component: function () {
      return import('../views/EditVolunteer.vue')
    },
  },

  {
    path: '/volunteer/:id', 
    name: 'EditExistingVolunteer',
    component: function () {
      return import('../views/EditExistingVolunteer.vue')
    },
  },
  // {
  //   path: '/schedule/weeklyevents/:id', 
  //   name: 'EditWeeklyEvents',
  //   component: function () {
  //     return import('../components/EditWeeklyEvents.vue')
  //   }
  // },
  // {
  //   path: '/schedule/rolesneeded/:id', 
  //   name: 'EditRolesNeeded',
  //   component: function () {
  //     return import('../components/EditRolesNeeded.vue')
  //   }
  // },
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
