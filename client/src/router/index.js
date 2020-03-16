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

Vue.use(VueRouter)

// Client side routes, NOT api routes!

const routes = [
  // for home page
  {
    path: '/',
    name: 'Home',
    component: Home
  },

  // to get all schedules from schedules table
  {
    path: '/schedules',
    name: 'Schedules',
    component: function () {
      return import('../views/Schedules.vue')
    }
  },

  // to get all volunteers from the volunteers table
  {
    path: '/volunteers',
    name: 'Volunteers',
    component: function () {
      return import('../views/Volunteers.vue')
    }
  },

  // to insert a new volunteer to the volunteers table
  {
    path: '/volunteers/volunteer/new',
    name: 'NewVolunteer',
    component: function () {
      return import('../components/NewVolunteer.vue')
    }
  },

  // to update a schedule in the schedules table
  {
    path: '/schedules/:schedule',
    name: 'EditSchedule',
    component: function () {
      return import('../views/EditSchedule.vue')
    },
  },

  // to generate a slate of volunteer assignments
  {
    path: '/schedules/run/:schedule',
    name: 'Run',
    component: function () {
      return import('../components/RunSchedule.vue')
    },
  },
  
  // to insert a volunteer in the volunteers table
  {
    path: '/volunteer/:id', 
    name: 'EditVolunteer',
    component: function () {
      return import('../views/EditVolunteer.vue')
    },
  },

  // to update a volunteer in the volunteers table
  {
    path: '/volunteer/:id', 
    name: 'EditExistingVolunteer',
    component: function () {
      return import('../views/EditExistingVolunteer.vue')
    },
  },
  
  // component with error message if unexpected path called.
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
