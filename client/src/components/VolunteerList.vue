<template>
<div>

    <v-card-title my-0 py-0>
    
    <v-spacer></v-spacer>
    <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
        class="pt-0"
    ></v-text-field>

    </v-card-title>

    <v-data-table align="center" justify="center"
    :headers="headers"
    :items="volunteers"
    :search="search"
    class="elevation-1"
    >
    <template v-slot:item.image="{ item }">
        <v-btn icon  >
            <v-avatar class="image-size">
                <v-img
                    :src="require('../../public/images/' + item.image )" :alt="item.firstName">
                </v-img>
            </v-avatar>
        </v-btn>


    </template>
    <template v-slot:item.action="{ item }">

        <router-link 
            :to="{ name: 'EditExistingVolunteer', params: { volunteers: volunteers, id: item._id, roles: roles, timeSlots: timeSlots }}"
            class="no-underscore"
            ><v-btn class="mx-1 my-1" fab right dark x-small color="teal">
                <v-icon dark>mdi-pencil</v-icon>
            </v-btn>
        </router-link>

        <v-btn class="mx-1 my-1" @click="handleDeleteVolunteer(item._id)" fab right dark x-small color="teal">
            <v-icon dark>mdi-delete-circle</v-icon>
        </v-btn>


    </template>


    </v-data-table>

</div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'VolunteerList',
    props: ["volunteers", "volunteerIndex", "volunteerMode", "roles", "timeSlots"],

    data: function() {
        return {
            search: '',
            item: '',
            id: ''
        };
    },

    created() {
        console.log(this.roles); // need to reference to pass through?
        console.log(this.timeSlots); // need to reference to pass through?
    },

    methods: {

        handleDeleteVolunteer: function(id) {

            this.volunteers = this.volunteers.filter( volunteer => 
                volunteer._id != id);
            this.deleteVolunteer(id);
            return this.volunteers;
        },

        deleteVolunteer: function(id) {
            axios.delete(`/api/volunteers/id/${id}`)
            .then(response => {
                console.log(response)
            })
            .catch(err => {
                console.log(err)
            });
        },

    },

    computed: {
      headers(){
        return [
          {
              text: ' ',
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
}
</script>

<style scoped>

.image-size {
    height: 40px !important;
    min-width: 40px !important;
    width: 40px !important;
}

.no-underscore { 
  text-decoration: none !important;
}

</style>

