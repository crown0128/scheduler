<template>

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


  export default {
    name: 'NewVolunteer',
    components: { EditVolunteer },

    data: function() {
      return {
        volunteers: [],
        // volunteerMode: "List",
        schedules: [],
        roles: [],
        timeSlots: [],
        volunteerNames: [],
        // volunteerIndex: -1
      };
    },

    created() {
      this.getVolunteers();
      this.getSchedules();
    },

    // beforeUpdate() {
    //   this.volunteerMode = 'List';

    // },

    methods: {
      getVolunteers() {
        axios.get('/api/volunteers')
        .then(response => {
          this.volunteers = response.data;
          // this.volunteerNames = this.volunteers.map(volunteer => { 
          //   id: volunteer._id, 
          //   name: volunteer.firstName + " " + volunteer.lastName 
          // }); 

          this.volunteers.forEach((volunteer, i) => {
            const newVol = {
              id: volunteer._id,
              name: volunteer.firstName + " " + volunteer.lastName
            };
            this.volunteerNames.push(newVol);
            // this.volunteerNames = this.volunteerNames.push(newVol);
            // alphabetize volunteer names
            this.volunteerNames.sort();
          })
        });

      },


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

</style>