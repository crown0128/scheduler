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
          // Get all role names from schedules, remove dups & alphabetize
          this.schedules.forEach((schedule, index) => {
            this.roles[index] = schedule.roles;
            this.roles[index] = this.roles[index].map(role => role.roleName);
          });
          // flatten array, so only one level deep
          this.roles = [].concat.apply([], this.roles);
          // remove duplicates
          this.roles = this.roles.filter((a, b) => this.roles.indexOf(a) === b);
          // sort the array
          this.roles = this.roles.sort();
          
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

              // make sure timesSlots is an array
              if (this.timeSlots.length === 0) {
                this.timeSlots = [slot]
              } else {
                this.timeSlots.push(slot);
              };

            });

          });

          // remove duplicate day/time combinations in timeslots
          this.timeSlots = this.timeSlots.filter((timeSlot, index, self) => 
            index === self.findIndex((t) => (
              t.day === timeSlot.day && t.time === timeSlot.time
            ))
          );

          console.log("NewVolunteer.vue... after duplicates removed...timeSlots");
          console.log(this.timeSlots);
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