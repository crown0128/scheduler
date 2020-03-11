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
        console.log("In getVolunteers in NewVolunteer");
        axios.get('/api/volunteers')
        .then(response => {
          console.log("get volunteers axios done");
          this.volunteers = response.data;
          // this.volunteerNames = this.volunteers.map(volunteer => { 
          //   id: volunteer._id, 
          //   name: volunteer.firstName + " " + volunteer.lastName 
          // }); 
          console.log("this.volunteers");
          console.log(this.volunteers);
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
        console.log("in getVolunteers (NewVolunteer.vue");
        console.log("this.volunteerNames");
        console.log(this.volunteerNames);
      },


      getSchedules() {
        axios.get('/api/schedules')
        .then(response => {
          this.schedules = response.data;
          // console.log("schedules loaded from database.");
          // console.log(response.data);
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
              // console.log("forEach schedule... slot, this.timeSlots");
              // console.log(this.timeSlots);
              const slot = {
                index: nth++,
                scheduleName: schedule.name, 
                day: weeklyEvent.day,
                time: weeklyEvent.time
              };
              // console.log(slot);
              if (this.timeSlots.length === 0) {
                this.timeSlots = [slot]
              } else {
                this.timeSlots.push(slot);
              };
            });
            // console.log("in Volunteers.vue - getschedules:");
            // console.log(this.timeSlots);
          });
        });


        // deleteVolunteer(volunteer) {
        //   console.log("Delete" + volunteer.firstName);
        // },


      },

      updateVolunteerMode: function(newVolunteerMode) {
        this.volunteerMode = newVolunteerMode;
      },

      handleReturnToVolunteerList: function() {
        console.log("in updateVolunteerMode");
        this.volunteerMode = 'List';
      },
    },
    
  };

</script>


<style scoped>

</style>