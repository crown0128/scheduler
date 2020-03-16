<template>

<div>
  
  <!-- card for one schedule with information -->
  <v-row text-center class="justify-center">
    <div class="v-card v-card--shaped v-sheet elevation-7 px-3 py-1 mb-2 sched-width" supportingtext="true">

      <div class="v-card__text pb-0">
        <v-row>

          <!-- Title for component is the schedule name -->
          <v-col cols="12">
            <span class="schedule-title">
              {{schedules[scheduleIndex].name}}
            </span>
            
            <!-- For information, just because we have it. And it might be helpful to the user. :) -->
            <!-- add 7 hours so possible time zone differences don't change the date -->
            <h1 class="v-card__text pa-0 mt-1 font-s">
              {{ schedules[scheduleIndex].startDate | moment("add", "7 hours", "MMM Do YYYY") }} through {{ schedules[scheduleIndex].endDate  | moment("add", "7 hours", "MMM Do YYYY") }}
            </h1>
          </v-col>

        </v-row>
      </div>


      <v-row class="wide">

        <!-- Weekly events in the schedule on the left side (with button to edit) -->
        <v-col cols="6" class="v-card__text">

          <!-- Let user add new day of week and time of day for a new weekly event in the schedule -->
          <EditWeeklyEvents 
            v-if="flags.edittingWeeklyEvents"
            :schedules="schedules"
            :scheduleIndex="scheduleIndex"
            :flags="flags"
          />
          <!-- List day of week and time of each weekly event -->
          <WeeklyEvents v-else
            :schedules="schedules" 
            :scheduleIndex="scheduleIndex"
            :flags="flags"
          />
        </v-col>

        <!-- Roles needed in the schedule on the right side (with button to edit) -->
        <v-col cols="6" class="v-card__text pb-5">

          <!-- List roles needed for the schedule -->
          <EditRolesNeeded 
            v-if="flags.edittingRoles"
            :schedules="schedules"
            :scheduleIndex="scheduleIndex"
            :flags="flags"
          />
          <!-- Let user add new roles -->
          <RolesNeeded v-else
            :schedules="schedules" 
            :scheduleIndex="scheduleIndex"
            :flags="flags"
          />

        </v-col>

      </v-row>

      <!-- Button to run the schedule to create a document with the volunteer assignments -->
      <v-row>
        <v-flex col-12 py-2>
          <router-link :to="{ name: 'Run', params: { schedule: schedules[scheduleIndex] }}" class="no-underscore">
            <v-btn block dark rounded class="teal">Click here to generate a slate of volunteer assignments.</v-btn>
          </router-link>
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
  import RunSchedule from '../components/RunSchedule';
  import axios from 'axios';

  export default {
    name: "Schedule",

    components: { EditWeeklyEvents, EditRolesNeeded, WeeklyEvents, RolesNeeded, RunSchedule },

    props: ["scheduleIndex", "schedules", "schedMode"],

    data: function () {
      return {
        flags: {
          edittingWeeklyEvents: false,
          edittingRoles: false,
          addingNewSchedule: false
        }
      };
    },

    methods: {

    }
    
  };

</script>


<style scoped>

  /* Tweak color and spacing */

  .bg-lightteal {
    background-color: #c4fff9 !important;
    border-width: 0 !important;
  }

  .schedule-title {
    color:blue;
    /* text-decoration-line: underline; */
    font-size: 1.6em;
    padding: 20px 0 0;
  }

  .weekly-event {
    font-size: 14px;
    background-color:  #c4fff9 !important;
    height: 20px;
  }

  .sched-width {
    width: 100%;
  }

  .font-s {
    font-size: 20px;
  }
 
</style>