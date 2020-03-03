<template>

<div>
  <div class="row">
    <div class="col-12 pa-0">
      <h2 class="text-left col-12 py-0 pl-12">
        Weekly events
        <!-- <router-link to="/schedule/weeklyevents/0"> -->
          <v-btn 
            class="mr-0 ml-3" 
            fab dark x-small 
            color="teal"
            @click="editWeeklyEvents(doEdit)"
          >
            <v-icon dark>mdi-pencil</v-icon>
          </v-btn>
        <!-- </router-link> -->
      </h2>
    </div>
  </div>
  
  <!-- List day of week and time of each weekly event -->
  <v-list
      v-for="(weeklyEvent, i) in schedule.weeklyEvents"
      class="pl-12 py-0 weekly-event"
      :key="i"
      :weeklyEvent="weeklyEvent">
          <v-list-item class="pa-0">
              {{ weeklyEvent.day }} at {{ weeklyEvent.time }}            
          </v-list-item>
  </v-list>

</div>
</template>


<script>
  export default {
    name: "WeeklyEvents",
    props: ["schedule", "doEdit"],
    methods: {
      editWeeklyEvents: function(doEdit) {
        doEdit.weekly = true;
        return doEdit
      }
    }
  };
</script>


<style scoped>
  .weekly-event {
    font-size: 14px;
    background-color:  #c4fff9 !important;
    height: 20px;
  }
</style>