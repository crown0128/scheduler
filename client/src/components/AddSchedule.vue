<template>

<div>
  
  <!-- card for one schedule with information -->
  <v-row text-center class="justify-center">
    <div class="v-card v-card--shaped v-sheet elevation-7 px-3 py-1 mb-2" id="addsched" supportingtext="true">


      <v-row>
        <GetSchedDates
          v-if="!doEdit.haveSchedDates"
          :doEdit="doEdit"
          :schedules="schedules"
          :scheduleIndex="scheduleIndex"
        />
      </v-row>

      <v-row class="wide" v-if="doEdit.haveSchedDates">
      <div class="v-card__text pb-0">
        <h2 >

          <span class="title mr-3">
            Choose the weekly times and roles needed for the new schedule.  Click the save icon to save.
          </span>
          <div>
            {{ schedules[scheduleIndex].startDate | moment("MMM Do, YYYY") }} through {{ schedules[scheduleIndex].endDate | moment("MMM Do, YYYY") }}
            
          </div>

        </h2>
      </div>

        <!-- Weekly events in the schedule on the left side (with button to edit) -->
        <v-col cols="6" class="v-card__text ml-5">


          <!-- List day of week and time of each weekly event -->
            <!-- @delete-weekly="deleteWeekly"
            @save-weekly="saveWeekly" -->
            <!-- v-on:chgWeekly='updWeekly($event)' -->
          <EditWeeklyEvents 
            :scheduleIndex="scheduleIndex"
            :schedules="schedules"
            :doEdit="doEdit"
          />
          <!-- <WeeklyEvents
            v-if="schedule.weeklyEvents.length > 0"
            :schedules="schedules" 
            :scheduleIndex="scheduleIndex"
            :doEdit="doEdit"
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
            :doEdit="doEdit"
          />
          <!-- <RolesNeeded v-else
            :key="key"
            :schedules="schedules"
            :doEdit="doEdit"
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
        doEdit: {
          weekly: true,
          roles: true,
          haveSchedDates: false
        },
        scheduleIndex: this.schedules.length,
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