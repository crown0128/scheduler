<template>
  <v-container cols="12" text-center align="center" justify="center" class="pt-0">
    <h1 cols="12" text-center>Volunteers</h1>

    <!-- ***** ADD A SEARCH BOX HERE, if time -->
    <EditVolunteer
      :volunteers="volunteers"
      :volunteerIndex="-1"
      :volunteerMode="volunteerMode"
      :schedules="schedules"
      :roles="roles"
      :timeSlots="timeSlots"
    ></EditVolunteer>

    <template>


      <v-card-title>
      
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>

      </v-card-title>

      <v-data-table align="center" justify="center"
        :headers="headers"
        :items="volunteers"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:item.image="{ item }">
          <!-- <div class="p-2"> -->
          <v-btn icon  >
              <v-avatar>
                <v-img 
                  :src="require('../../public/images/' + item.image )" :alt="item.firstName" height="30px">
                </v-img>
              </v-avatar>
          </v-btn>
          <!-- </div> -->
        </template>

        <template #item.action>
          <v-btn class="mx-1 my-1" @click="editVolunteer(item.volunteer)" fab right dark x-small color="teal">
            <v-icon dark>mdi-pencil</v-icon>
          </v-btn>
          <v-btn class="mx-1 my-1" @click="deleteVolunteer(item.volunteer)" fab right dark x-small color="teal">
            <v-icon dark>mdi-delete-circle</v-icon>
          </v-btn>
        </template>
      </v-data-table>

    </template>

    <!-- NEW VOLUNTEER button -->
    <v-flex xs10 offset-xs1 py-2>
        <v-btn block dark rounded class="teal">Add a new volunteer</v-btn>
    </v-flex>

  </v-container>
</template>


<script>
  import axios from 'axios';
  import EditVolunteer from '../components/EditVolunteer';


  export default {
    name: 'Volunteers',
    components: { EditVolunteer },

    data: function() {
      return {
        volunteers: [],
        search: '',
        volunteerMode: "Add",
        schedules: [],
        roles: [],
        timeSlots: []
      };
    },

    created() {
      this.getVolunteers();
      this.getSchedules();

    },

    methods: {
      getVolunteers() {
        axios.get('/api/volunteers')
        .then(response => {

          this.volunteers = response.data;
          
        // })
        // .then((response) => {
        //   console.log("Volunteers (getVolunteers):");
        //   // console.log(this.volunteers);
        //   console.log(this.volunteers);
        });
      },

      getSchedules() {
        axios.get('/api/schedules')
        .then(response => {
          this.schedules = response.data;
          console.log("schedules loaded from database.");
          console.log(response.data);
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
          
          // Get all time slots from schedules, sort by schedule
          this.schedules.forEach((schedule, index) => {
    
            this.timeSlots[index] = schedule.name + ":  " + schedule.weeklyEvents[index].day + " at " + schedule.weeklyEvents[index].time;
          });
          // Shouldn't be duplicates, so sort & done.
          this.timeSlots = this.timeSlots.sort();
        })
      },
      // editVolunteer(volunteer) {
      //   console.log("Edit" + volunteer.firstName);
      // },

      // deleteVolunteer(volunteer) {
      //   console.log("Delete" + volunteer.firstName);
      // },

      // initialize() {
      //   // alert("in initialize");
      //   this.getVolunteers();
      // },

    },

    computed: {
      headers(){
        return [
          {
              text: 'Image',
              align: 'start',
              value: 'image',
              width: '100px',
              sortable: false
          },
          { text: 'Last Name', value: 'lastName', sortable: true },
          { text: 'First Name', value: 'firstName', sortable: true },
          { text: 'Roles', value: 'roles', sortable: true },
          { text: 'Actions', value: 'action', align: 'center', sortable: false },
        ];
      },
    }

  };

</script>


<style scoped>

</style>