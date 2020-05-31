<template>

<!-- Weekly events header with edit icon -->
<div>
  <div class="row">
    <div class="col-12 pa-0">
      <h2 class="text-left col-12 py-0 pl-12">
        Weekly events
        <v-btn 
          class="mr-0 ml-3" 
          fab dark x-small 
          color="teal"
          @click="editWeeklyEvents(flags)"
        >
          <v-icon dark>mdi-pencil</v-icon>
        </v-btn>
        Edit
      </h2>
    </div>
  </div>
  
  <!-- List day of week and time of each weekly event -->
  <v-list
      v-for="(weeklyEvent, i) in schedules[scheduleIndex].weeklyEvents"
      class="pl-12 py-2 weekly-event"
      :key="i"
      :weeklyEvent="weeklyEvent">
          <v-list-item class="pa-0">
              {{ weeklyEvent.day }} at {{ timeToDate(weeklyEvent.time) | moment( "h:mm a") }}            
          </v-list-item>
  </v-list>

</div>
</template>


<script>
  export default {
    name: "WeeklyEvents",

    props: ["schedules", "scheduleIndex", "flags"],

    methods: {

      // set flags so page to allow edits gets displayed
      editWeeklyEvents: function(flags) {
        flags.edittingWeeklyEvents = true;
        return flags
      },

      // only need time part...   Put time in date/time format so moment can format it
      timeToDate: function(time) {
        return new Date("March 16, 2020 " + time);
      }
    },
  };
</script>


<style scoped>
  .weekly-event {
    /* tweak color and spacing */
    font-size: 20px;
    background-color:  #c4fff9 !important;
    height: 24px;
  }
</style>