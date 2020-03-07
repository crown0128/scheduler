<template>

<div>
  
  <!-- card for one schedule with information -->
  <v-row text-center class="justify-center">
    <div class="v-card v-card--shaped v-sheet elevation-7 px-3 py-1 mb-2" supportingtext="true">

      <div class="v-card__text pb-0">
        <v-row>

          <v-col cols="11">

            <span class="schedule-title">
              Schedule:  {{ schedules[scheduleIndex].startDate | moment("MMM Do YYYY") }} through {{ schedules[scheduleIndex].endDate  | moment("MMM Do YYYY") }}
            </span>
            
            <!-- For information, just because we have it. :) -->
            <div class="v-card__text pa-0">
              (Number of times this schedule has been run:  {{schedules[scheduleIndex].version}})
            </div>
          </v-col>

          <v-col cols="1" text-left>
            <v-btn 
              fab dark x-small color="teal"
            >
              <v-icon dark>mdi-delete-circle</v-icon>
            </v-btn>
          </v-col>

        </v-row>
      </div>


      <v-row class="wide">

        <!-- Weekly events in the schedule on the left side (with button to edit) -->
        <v-col cols="6" class="v-card__text">

          <!-- List day of week and time of each weekly event -->
            <!-- @delete-weekly="deleteWeekly"
            @save-weekly="saveWeekly" -->
            <!-- v-on:chgWeekly='updWeekly($event)' -->
          <EditWeeklyEvents 
            v-if="doEdit.weekly"
            :schedules="schedules"
            :scheduleIndex="scheduleIndex"
            :doEdit="doEdit"
          />
          <WeeklyEvents v-else
            :schedules="schedules" 
            :scheduleIndex="scheduleIndex"
            :doEdit="doEdit"
          />
        </v-col>

        <!-- Roles needed in the schedule on the right side (with button to edit) -->
        <v-col cols="6" class="v-card__text pb-5">

          <!-- List day of week and time of each weekly event -->
            <!-- @delete-weekly="deleteWeekly"
            @save-weekly="saveWeekly" -->
            <!-- v-on:chgWeekly='updWeekly($event)' -->
          <EditRolesNeeded 
            v-if="doEdit.roles"
            :schedules="schedules"
            :scheduleIndex="scheduleIndex"
            :doEdit="doEdit"
          />
          <RolesNeeded v-else
            :schedules="schedules" 
            :scheduleIndex="scheduleIndex"
            :doEdit="doEdit"
          />

        </v-col>

      </v-row>

      <!-- Button to run the schedule to create a document with the volunteer assignments -->
      <v-row>
        <v-flex col-12 py-2>
          <!-- <v-col center-align> -->
            <v-btn block dark rounded class="teal">Run this Schedule to create a schedule document.</v-btn>
          <!-- </v-col> -->
        </v-flex>
      </v-row>

    </div>


  </v-row>


</div>
</template>


<script>
  import WeeklyEvents from '../components/WeeklyEvents';
  import EditWeeklyEvents from '../components/EditWeeklyEvents';
  import RolesNeeded from '../components/RolesNeeded';
  import EditRolesNeeded from '../components/EditRolesNeeded';

  export default {
    name: "Schedule",
    components: { EditWeeklyEvents, EditRolesNeeded, WeeklyEvents, RolesNeeded },
    props: ["scheduleIndex", "schedules"],
    data: function () {
      return {
        doEdit: {
          weekly: false,
          roles: false
        }
      };
    },

       // methods: {
    //   updWeekly: function(doWeekly) {
    //     this.doEditWeekly = doWeekly;
    //   }
      
    //   // rtnToSchedFromWkly: function(doEditWeekly) {
    //   //   this.doEditWeekly = false;
    //   // }
    // }
    
  };
</script>


<style scoped>

  .bg-lightteal {
    background-color: #c4fff9 !important;
    border-width: 0 !important;
  }

  .schedule-title {
    color:blue;
    text-decoration-line: underline;
    font-size: 1.6em;
    padding: 20px 0 0;
  }

  .weekly-event {
    font-size: 14px;
    background-color:  #c4fff9 !important;
    height: 20px;
  }
  
</style>