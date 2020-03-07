<template>

<div>
  
  <!-- card for one schedule with information -->
  <v-row text-center class="justify-center">
    <div class="v-card v-card--shaped v-sheet elevation-7 px-3 py-1 mb-2" id="addsched" supportingtext="true">


      <v-row>
        <GetSchedDates
          v-if="!flags.haveSchedDates"
          :flags="flags"
          :schedules="schedules"
          :scheduleIndex="scheduleIndex"
        />
      </v-row>

      <v-row class="wide" v-if="flags.haveSchedDates">

        <v-col cols="10" offset="1">
          <h2 >

            <span class="title mr-3">
              Choose the weekly times and roles needed for the new schedule.  Click the save icon to save.
            </span>
            <div>
              {{ schedules[scheduleIndex].startDate | moment("MMM Do, YYYY") }} through {{ schedules[scheduleIndex].endDate | moment("MMM Do, YYYY") }}
            </div>

          </h2>
        </v-col>
        <v-col cols="1">
          <v-btn
            class="mr-0 ml-3" 
            fab dark x-small 
            color="teal"
          >
            <!-- @click=" " -->
            <v-icon dark>mdi-arrow-left</v-icon>
          </v-btn>
        </v-col>

        <!-- Weekly events in the schedule on the left side (with button to edit) -->
        <v-col cols="6" class="v-card__text ml-5">


          <!-- List day of week and time of each weekly event -->
            <!-- @delete-weekly="deleteWeekly"
            @save-weekly="saveWeekly" -->
            <!-- v-on:chgWeekly='updWeekly($event)' -->
          <EditWeeklyEvents 
            :scheduleIndex="scheduleIndex"
            :schedules="schedules"
            :flags="flags"
          />
          <!-- <WeeklyEvents
            v-if="schedule.weeklyEvents.length > 0"
            :schedules="schedules" 
            :scheduleIndex="scheduleIndex"
            :flags="flags"
          /> -->
        </v-col>

        <!-- Roles needed in the schedule on the right side (with button to edit) -->
        <v-col cols="5" class="v-card__text">

          <!-- List day of week and time of each weekly event -->
            <!-- @delete-weekly="deleteWeekly"
            @save-weekly="saveWeekly" -->
            <!-- v-on:chgWeekly='updWeekly($event)' -->
          <EditRolesNeeded 
            :scheduleIndex="scheduleIndex"
            :schedules="schedules"
            :flags="flags"
          />
          <!-- <RolesNeeded v-else
            :key="key"
            :schedules="schedules"
            :flags="flags"
          /> -->

        </v-col>

      </v-row>

    </div>


  </v-row>


</div>
</template>


<script>
  import WeeklyEvents from './WeeklyEvents';
  import EditWeeklyEvents from './EditWeeklyEvents';
  import RolesNeeded from './RolesNeeded';
  import EditRolesNeeded from './EditRolesNeeded';
  import GetSchedDates from './GetSchedDates';

  export default {
    name: "AddSchedule",
    components: { EditWeeklyEvents, EditRolesNeeded, WeeklyEvents, RolesNeeded, GetSchedDates },
    props: ["schedules", "addSched"],
    data: function () {
      return {
        flags: {
          edittingWeeklyEvents: true,
          edittingRoles: true,
          haveSchedDates: false,
          addingNewSchedule: true,
        },
        scheduleIndex: this.schedules.length,
      };
    },

       // methods: {
    //   updWeekly: function(doWeekly) {
    //     this.flagsWeekly = doWeekly;
    //   }
      
    //   // rtnToSchedFromWkly: function(flagsWeekly) {
    //   //   this.flagsWeekly = false;
    //   // }
    // }
    
  };
</script>


<style scoped>

  .bg-lightteal {
    background-color: #c4fff9 !important;
    border-width: 0 !important;
  }

  .title {
    color:blue;
    text-decoration-line: none;
    font-size: 3em;
    padding: 20px 0 0;
  }

  .weekly-event {
    font-size: 14px;
    background-color:  #c4fff9 !important;
    height: 20px;
  }
  
</style>