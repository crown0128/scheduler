<template>


<div>

  <v-row>
    <v-col class="col-12 pa-0">
      <h2 class="text-left col-12 py-0 pl-12">
        Weekly events
      </h2>
    </v-col>
  </v-row>
  
    <!-- List day of week and time of each weekly event -->
  <v-row id="edit-weekly">
    
    <v-col cols="4" class="pr-1 offset-lg-1 daytimepicker">
      <!-- choose day of week -->
      <v-select 
        class="select"
        v-model="day"
        :items="days"
        menu-props="auto"
        label="day"
        single-line
      ></v-select>
    </v-col>

    <!-- choose time of day -->
    <v-col cols="3" height="10px">
      <v-menu
        ref="menu"
        v-model="time"
        no-title
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="100px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="time"
            no-title
            label="time"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker
          v-model="time"
          no-title
          @click:minute="$refs.menu.save(time-picked)"
        ></v-time-picker>
      </v-menu>
    </v-col>

    <!-- icon to save new weekly event -->
    <v-col cols="1" class="mt-3">
      <v-btn class="mr-0 ml-3" fab dark x-small color="teal">
        <v-icon dark>mdi-content-save-outline</v-icon>
      </v-btn>
    </v-col>
    <!-- icon to return to schedules -->
    <v-col cols="1" class="mt-3 ml-3">
      <v-btn class="mr-0 ml-3" fab dark x-small color="teal">
        <v-icon dark>mdi-calendar-multiselect</v-icon>
      </v-btn>
    </v-col>

  </v-row>
          


  <div class="pb-4">
    <!-- List day of week and time of each weekly event -->
    <!-- with delete buttom -->
    <v-list
      v-for="(weeklyEvent, i) in schedule.weeklyEvents"
      class="pl-12 pt-0 weekly-event"
      :key="i"
      :weeklyEvent="weeklyEvent">

      <v-row>
        <v-col cols="6" class="offset-sm-1 mt-0">
          <v-list-item class="pa-0">
              {{ weeklyEvent.day }} at {{ weeklyEvent.time }}            
          </v-list-item>
        </v-col>

        <v-col cols="1">
          <v-btn class="mr-0 small-dlt mt-3" fab dark color="teal">
            <v-icon dark>mdi-delete-circle</v-icon>
          </v-btn>
        </v-col>

      </v-row>
      <v-row class="space">
           <span></span>
      </v-row>
    </v-list>

  </div>

</div>
</template>




<script>
export default {
  name: "EditWeeklyEvents",
  props: ["schedule"],
  data () {
    return {
      days: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      time: null,
      // menu2: false,
      // modal2: false,
    }
  },
};
</script>

<style scoped>

  #edit-weekly {
    background-color: palegoldenrod;
  }

  .weekly-event {
    font-size: 14px;
    background-color: #c4fff9 !important;
    height: 20px;
  }

  .weekly-input {
    text-decoration: none !important;
    border: 1px;
    height: 16px;
  }

  .select {
    height: 16px;
  }

  .small-dlt {
    height: 16px;
    width: 16px;
    margin-top: 10px;
  }

  .time-pick {
    height: 25px;
  }

  .space {
    height: 16px;
  }

  .daytimepicker {
    margin-left: 10%;
  }

</style>