<template>
  <v-container cols="12" text-center align="center" justify="center" class="pt-0">
    <h1 cols="12" text-center>Volunteers</h1>

<!-- ***** ADD A SEARCH BOX HERE, if time -->

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

  export default {
    name: 'Volunteers',

    data: function() {
      return {
        volunteers: [],
        search: '',
      };
    },

    created() {
      console.log("in created (in watch)");
        // return this.volunteers = this.getVolunteers();
      this.getVolunteers();
      // console.log("Volunteers (created):");
      // console.log(volunteers);
    },

    methods: {
      getVolunteers() {
        console.log("in getVolunteers");
        axios.get('/api/volunteers')
        .then(response => {
          console.log(".then");
          console.log(response.data);
          this.volunteers = response.data;
          
        // })
        // .then((response) => {
        //   console.log("Volunteers (getVolunteers):");
        //   // console.log(this.volunteers);
        //   console.log(this.volunteers);
        });
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