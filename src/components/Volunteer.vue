<template>

<div>

  <v-row text-center class="justify-center">
    <v-col cols="12">
    <div class="v-card v-card--shaped v-sheet elevation-7 px-3 py-1 mb-2" supportingtext="true">
        <v-row>
        <v-col cols="1">
            <v-btn icon>
                <v-avatar>
                    <!-- <v-img 
                        aspect-ratio="1"
                        height="100px"
                        :image={{ volunteer.image }}
                        alt="pic">
                    </v-img> -->
                    <v-img src="..\assets\images\cuteface2.jpg" aspect-ratio="1" height="100px"></v-img>
                </v-avatar>
            </v-btn>
        </v-col> 

        <v-col cols="3">
            <div class="v-card__text pb-0">
                <span class="volunteer-name">
                    {{volunteer.firstName}} {{volunteer.lastName}}
                </span>
                <v-btn class="mr-0 ml-3" fab dark x-small color="teal">
                <v-icon dark>mdi-delete-circle</v-icon>
                </v-btn>
            </div>
        </v-col>

      <!-- <div class="v-card__text pa-1">
          <v-btn color="secondary" fab x-small dark>
              <v-img src={{ volunteer.image}}></v-img>
        </v-btn>
      </div> -->
        </v-row>

      <v-row>
        <v-col cols="6" class="v-card__text">

          <div class="row">
            <div class="col-12 pa-0">
              <h2 class="text-left col-12 py-0 pl-12">
                <!-- Weekly events
                <v-btn class="mr-0 ml-3" fab dark x-small color="teal">
                  <v-icon dark>mdi-pencil</v-icon>
                </v-btn> -->
              </h2>
            </div>
          </div>
          
          <!-- <v-list
            v-for="(weeklyEvent, i) in schedule.weeklyEvents"
            class="pl-12 py-0 weekly-event"
            :key="i"
            :weeklyEvent="weeklyEvent">
            <v-list-item class="pa-0">
              {{ weeklyEvent.day }} at {{ weeklyEvent.time }}            
            </v-list-item>
          </v-list> -->
        </v-col>

        <v-col cols="6" class="v-card__text pb-5">

          <div class="row">
            <div class="col-12 pa-0">
              <h2 class="text-left col-12 py-0">
                <!-- Roles needed
                <v-btn class="mr-0 ml-3" fab dark x-small color="teal">
                  <v-icon dark>mdi-pencil</v-icon>
                </v-btn> -->
              </h2>
            </div>
          </div>

          <!-- <v-list
            v-for="(role, i) in schedule.roles"
            class="py-0 px-4 weekly-event"
            :key="i"
            :role="role">
            <v-list-item class="pa-0">
              {{ role }}            
            </v-list-item>
          </v-list> -->

        </v-col>

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


</style>