<template>

    <!-- re-use EditVolunteer component with different parameters -->
    <EditVolunteer
      :volunteers="this.volunteers"
      :volunteerIndex="-1"
      :volunteerMode="'Add'"
      :schedules="this.schedules"
      :roles="this.roles"
      :timeSlots="this.timeSlots"
      :volunteerNames="this.volunteerNames"
    ></EditVolunteer>

</template>


<script>
  import axios from 'axios';
  import EditVolunteer from '../views/EditVolunteer';
  import fcns from '../js/fcns.js';  // added 4/26/2020

  export default {
    name: 'NewVolunteer',
    components: { EditVolunteer },

    data: function() {
      return {
        volunteers: [],
        schedules: [],
        roles: [],
        timeSlots: [],
        volunteerNames: [],
      };
    },

    created() {
      // get the volunteers and schedules to display on the page
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
            console.log("Error in getVolunteers (NewVolunteer.vue):");
            console.log(err);
          });
        },

      // do axios call to get all the schedules from the schedules table
      getSchedules() {
        axios.get('/api/schedules')
        .then(response => {
          this.schedules = response.data;
        })
        .then(response => {
          // get unique role names & time slots from schedules
          [this.roles, this.timeSlots] = fcns.getRolesAndTimeSlots(this.schedules, this.roles);
        })
        .catch(err => {
          console.log("Error in getSchedules (NewVolunteer.vue):");
          console.log(err);
        });

      },

      // so we know if we're adding, editting or listing volunteers.
      // Used to show appropriate component
      updateVolunteerMode: function(newVolunteerMode) {
        this.volunteerMode = newVolunteerMode;
      },

      // when returning to volunteer list, mode must be "list"
      handleReturnToVolunteerList: function() {
        this.volunteerMode = 'List';
      },
    },
    
  };

</script>


<style scoped>

</style>