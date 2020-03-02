<template>
<div>

  <!-- One card for a volunteer with their information -->
  <v-row text-center class="justify-center">
    <v-col cols="8">
      <div class="v-card v-card--shaped v-sheet elevation-7 px-3 py-1 mb-2" supportingtext="true">
        <v-row>

          <!-- image -->
          <v-col cols="1" class='offset-lg-1'>
              <v-btn icon  class="mt-4">
                  <v-avatar>
                      <img :src="'images/' + volunteer.image" >
                  </v-avatar>
              </v-btn>
          </v-col> 

          <!-- Name (first & last) -->
          <v-col cols="3">
              <div class="v-card__text pb-0 text-left">
                  <span class="volunteer-name">
                      {{volunteer.firstName}} {{volunteer.lastName}}
                  </span>
              </div>
          </v-col>

          <!-- Roles they can do -->
          <v-col cols="4">
            <v-list
              v-for="(role, i) in volunteer.roles"
              class="py-0 px-4 role"
              :key="i"
              :role="role">
              <v-list-item class="pa-0">
                {{ role }}            
              </v-list-item>
            </v-list>
          </v-col>

          <!-- Edit & delete buttons -->
          <v-col cols="1" class="v-card__text">
            <div class="row">
              <div class="col-12 pa-0">
                <h2 class="col-12 py-0 pl-12">
                  <!-- edit button -->
                  <v-btn class="mx-0 my-1" fab right dark x-small color="teal">
                    <v-icon dark>mdi-pencil</v-icon>
                  </v-btn>
                  <!-- delete button -->
                  <v-btn class="mx-0 my-1" fab right dark x-small color="teal">
                    <v-icon dark>mdi-delete-circle</v-icon>
                  </v-btn>
                </h2>
              </div>
            </div>
          </v-col>
            
        </v-row>
      </div>
    </v-col>
  </v-row>

</div>
</template>


<script>
  import EditVolunteer from '../components/EditVolunteer';

  export default {
    name: "Volunteer",
    components: { EditVolunteer },
    props: ["volunteer"],
  };
</script>


<style scoped>

  /* .bg-lightteal {
    background-color: #c4fff9 !important;
    border-width: 0 !important;
  } */

  .volunteer-name {
    color:blue;
    font-size: 1.25em;
    padding: 20px 0 0;
    text-align: left;
  }

  .role {
    font-size: 16px;
    background-color:  #c4fff9 !important;
    height: 20px;
  }

</style>