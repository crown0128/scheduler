<template>
  <v-container cols="12" text-center align="center" justify="center" class="pt-0">
    <v-row>
      <v-col cols="10" offset="1">
        <h1 cols="12" text-center>Volunteers</h1>
      </v-col>

      <v-col cols="1">

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

    <EditVolunteer
      v-on:updatevolunteerMode="updatevolunteerMode($event)"
      v-if="((volunteerMode==='Add')||(volunteerMode==='Edit'))"
      :volunteers="volunteers"
      :volunteerIndex="-1"
      :volunteerMode="volunteerMode"
      :schedules="schedules"
      :roles="roles"
      :timeSlots="timeSlots"
      :volunteerNames="volunteerNames"
    ></EditVolunteer>

    <VolunteerList
      v-on:updatevolunteerMode="updatevolunteerMode($event)"
      v-if="volunteerMode==='List'"
      :volunteers="volunteers"
      :volunteerIndex="volunteerIndex"
      :volunteerMode="volunteerMode"
    ></VolunteerList>

    <!-- NEW VOLUNTEER button -->
    <v-flex v-if="volunteerMode==='List'" xs10 offset-xs1 py-2>
        <router-link to="/volunteers/volunteer/new">
          <v-btn block dark rounded class="teal">Add a new volunteer</v-btn>
        </router-link>
    </v-flex>
  </v-container>
</template>


<script>
  import axios from 'axios';
  import VolunteerList from '../components/VolunteerList';
  import EditVolunteer from './EditVolunteer';
  import NewVolunteer from '../components/NewVolunteer';


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
      this.getVolunteers();
      this.getSchedules();
    },

    // beforeUpdate() {
    //   this.volunteerMode = 'List';

    // },

    methods: {
      getVolunteers() {
        // console.log("In getVolunteers");
        axios.get('/api/volunteers')
        .then(response => {
          // console.log("get volunteers axios done");
          this.volunteers = response.data;
          // this.volunteerNames = this.volunteers.map(volunteer => { 
          //   id: volunteer._id, 
          //   name: volunteer.firstName + " " + volunteer.lastName 
          // }); 
          // console.log("this.volunteers");
          // console.log(this.volunteers);
          this.volunteers.forEach((volunteer, i) => {
            // console.log("foreach: volunteer for " + i);
            // console.log(volunteer);
            const newVol = {
              id: volunteer._id,
              name: volunteer.firstName + " " + volunteer.lastName
            };
            // console.log("before push: volunteerNames, newVol");
            // console.log(this.volunteerNames);
            // console.log(newVol);
            this.volunteerNames.push(newVol);
            // this.volunteerNames = this.volunteerNames.push(newVol);
            // console.log("after push: volunteerNames, newVol");
            // console.log(this.volunteerNames);
            // alphabetize volunteer names
            this.volunteerNames.sort();
          })
        });
        // console.log("in getVolunteers");
        // console.log("volunteerNames");
        // console.log(this.volunteerNames);
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
        // console.log("in updateVolunteerMode");
        this.volunteerMode = 'List';
      },

      handleNewVolunteer: function() {
        // console.log("in handleNewVolunteer in Volunteers.vue");

      }
    },
    
  };

</script>


<style scoped>

</style>