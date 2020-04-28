<template>
  <v-container cols="12" text-center align="center" justify="center" class="pt-0 my-0">
    <v-row>
      <!-- header -->
      <v-col cols="10" offset="1" class="my-0 pb-0">
        <h1 cols="12" text-center>Volunteers</h1>
      </v-col>

      <v-col cols="1" class="pb-0">

        <!-- go back to volunteers list page button -->
        <v-btn 
          v-if="((volunteerMode==='Add')||(volunteerMode==='Edit'))"
          class="mx-1 my-1" 
          @click="handleReturnToVolunteerList();" 
          fab right dark x-small 
          color="teal"
        >
          <v-icon dark>mdi-arrow-left</v-icon>
        </v-btn>
      </v-col>

    </v-row>

    <!-- NEW VOLUNTEER button; uses NewVolunteer component -->
    <v-flex v-if="volunteerMode==='List'" xs10 offset-xs1 py-2>
        <router-link to="/volunteers/volunteer/new" class="no-underscore">
          <v-btn block dark rounded class="teal">Click here to add a new volunteer</v-btn>
        </router-link>
    </v-flex>

    <!-- get component to edit a volunteer -->
    <EditVolunteer
      v-on:updatevolunteerMode="updatevolunteerMode($event)"
      v-if="((volunteerMode==='Add')||(volunteerMode==='Edit'))"
      :volunteers="this.volunteers"
      :volunteerIndex="-1"
      :volunteerMode="this.volunteerMode"
      :schedules="this.schedules"
      :roles="this.roles"
      :timeSlots="this.timeSlots"
      :volunteerNames="this.volunteerNames"
    ></EditVolunteer>

    <!-- get component to display volunteer list -->
    <VolunteerList
      v-on:updatevolunteerMode="updatevolunteerMode($event)"
      v-if="volunteerMode==='List'"
      :volunteers="this.volunteers"
      :volunteerIndex="this.volunteerIndex"
      :volunteerMode="this.volunteerMode"
      :roles="this.roles"
      :timeSlots="this.timeSlots"
    ></VolunteerList>

  </v-container>
</template>


<script>
  import axios from 'axios';
  import VolunteerList from '../components/VolunteerList';
  import EditVolunteer from './EditVolunteer';
  import NewVolunteer from '../components/NewVolunteer';
  import fcns from '../js/fcns.js';


  export default {
    name: 'Volunteers',

    components: { VolunteerList, EditVolunteer, NewVolunteer },

    data: function() {
      return {
        volunteers: [],
        volunteerMode: "List",
        schedules: [],
        roles: [],
        timeSlots: [],
        volunteerNames: [],
        volunteerIndex: -1
      };
    },

    created() {
      // get volunteers and schedules from respective tables
      this.getVolunteers();
      this.getSchedules();
    },


    methods: {

      // axios call to get volunteers
      getVolunteers() {
        axios.get('/api/volunteers')
        .then(response => {
          this.volunteers = response.data;
          // extract volunteer names from volunteers to display in component
          this.volunteerNames = fcns.getVolunteerNames(this.volunteers);
        })
        .catch(err => {
          console.log("Error in getVolunteers (Volunteers.vue):");
          console.log(err);
        });
      },


      // axios call to get schedules
      getSchedules() {
        axios.get('/api/schedules')
        .then(response => {
          this.schedules = response.data;
        })
        .then(response => {
          // Get all role names from schedules, remove dups & alphabetize
          this.schedules.forEach((schedule, index) => {
            this.roles[index] = schedule.roles;
            this.roles[index] = this.roles[index].map(role => role.roleName);
          });
          // flatten array, so only one level deep
          this.roles = [].concat.apply([], this.roles);
          // remove duplicates
          this.roles = this.roles.filter((a, b) => this.roles.indexOf(a) === b);
          
          let nth = 0;
          // Get all time slots from schedules, sort by schedule
          this.schedules.forEach((schedule, index) => {
            schedule.weeklyEvents.forEach((weeklyEvent, i) => {
              const slot = {
                index: nth++,
                scheduleName: schedule.name, 
                day: weeklyEvent.day,
                time: weeklyEvent.time
              };

              // make sure timeSlots is an array
              if (this.timeSlots.length === 0) {
                this.timeSlots = [slot]
              } else {
                this.timeSlots.push(slot);
              };
            });

          });

          // remove duplicate day/time combinations
          this.timeSlots = this.timeSlots.filter((timeSlot, index, self) => 
            index === self.findIndex((t) => (
              t.day === timeSlot.day && t.time === timeSlot.time
            ))
          );
        });

      },

      updateVolunteerMode: function(newVolunteerMode) {
        this.volunteerMode = newVolunteerMode;
      },

      handleReturnToVolunteerList: function() {
        this.volunteerMode = 'List';
      },

    },
    
  };

</script>


<style scoped>

/* get rid of underscore on routes icons/text */
.no-underscore { 
  text-decoration: none !important;
}

</style>