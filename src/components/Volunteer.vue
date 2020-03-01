<template>
<div>

  <v-row text-center class="justify-center">
    <v-col cols="8">
      <div class="v-card v-card--shaped v-sheet elevation-7 px-3 py-1 mb-2" supportingtext="true">
        <v-row>
          <v-col cols="1" class='offset-lg-1'>
              <v-btn icon  class="mt-4">
                  <v-avatar>
                      <!-- <img :src="'../assets/images/' + volunteer.image" /> -->
                      <img :src="'images/' + volunteer.image" >
                      <!-- <img :src="getURL('cuteface2.jpg')" > -->
                  
                          <!-- :src= "volunteer.image" -->
                      <!-- <v-img src="..\assets\images\cuteface2.jpg" aspect-ratio="1" height="100px"></v-img> -->
                  </v-avatar>
              </v-btn>
          </v-col> 

          <v-col cols="3">
              <div class="v-card__text pb-0 text-left">
                  <span class="volunteer-name">
                      {{volunteer.firstName}} {{volunteer.lastName}}
                  </span>
              </div>
          </v-col>

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

          <v-col cols="1" class="v-card__text">
            <div class="row">
              <div class="col-12 pa-0">
                <h2 class="col-12 py-0 pl-12">
                  <v-btn class="mx-0 my-1" fab right dark x-small color="teal">
                    <v-icon dark>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn class="mx-0 my-1" fab right dark x-small color="teal">
                    <v-icon dark>mdi-delete-circle</v-icon>
                  </v-btn>
                </h2>
              </div>
            </div>
          </v-col>
            
            <!-- <v-list
              v-for="(weeklyEvent, i) in schedule.weeklyEvents"
              class="pl-12 py-0 weekly-event"
              :key="i"
              :weeklyEvent="weeklyEvent">
              <v-list-item class="pa-0">
                {{ weeklyEvent.day }} at {{ weeklyEvent.time }}            
              </v-list-item>
            </v-list> -->

          <!-- <v-col cols="6" class="v-card__text pb-5">
            <div class="row">
              <div class="col-12 pa-0">
                <h2 class="text-left col-12 py-0"> -->
                  <!-- Roles needed
                  <v-btn class="mr-0 ml-3" fab dark x-small color="teal">
                    <v-icon dark>mdi-pencil</v-icon>
                  </v-btn> -->
                <!-- </h2>
              </div>
            </div>
          </v-col> -->

            <!-- <v-list
              v-for="(role, i) in schedule.roles"
              class="py-0 px-4 weekly-event"
              :key="i"
              :role="role">
              <v-list-item class="pa-0">
                {{ role }}            
              </v-list-item>
            </v-list> -->

        </v-row>
      </div>
    </v-col>
  </v-row>


</div>
</template>

<script>
export default {
  name: "Volunteer",
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