<template>
<div>

  <!-- Header for this section -->
  <v-row>
    <v-col class="col-12 pa-0">
      <h2 class="text-left col-12 py-0 pl-12">
        Weekly events
      </h2>
    </v-col>
  </v-row>
  
    <!-- List day of week and time of each weekly event -->
  <v-row id="edit-weekly">
    
    <v-col cols="3" class="pr-1 offset-lg-1 daytimepicker">
      <!-- choose day of week -->
      <v-select 
        class="select"
        v-model="day"
        :items="days"
        menu-props="auto"
        label="day"
        single-line
        color="teal"
      ></v-select>
    </v-col>

    <!-- choose time of day -->
    <v-col cols="3" height="10px">

      <!-- Need to figure out why time is not being displayed formatted as am/pm -->

      <v-dialog
        ref="dialog"
        v-model="showTimePicker"
        :return-value.sync="newTime"
        persistent
        width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="newTime"
            label="time"
            readonly
            v-on="on"
          ></v-text-field>
        </template>

        <v-time-picker
          v-if="showTimePicker"
          v-model="newTime"
          full-width
          color="teal"
        >
          <v-spacer></v-spacer>
          <v-btn text color="teal" @click="showTimePicker = false">Cancel</v-btn>
          <v-btn text color="teal" format="ampm" @click="$refs.dialog.save( newTime )">OK</v-btn>
        </v-time-picker>
      </v-dialog>
    </v-col>

    <!-- icon to save new weekly event -->
    <v-col cols="2" class="mt-3">
      <v-btn 
        class="mr-0 ml-3" 
        fab dark x-small 
        color="teal"
        @click="schedules = handleSaveWeeklyEvent(schedules, scheduleIndex)"
      >
        <v-icon dark>mdi-content-save-outline</v-icon>
      </v-btn>
      <p class="ml-2">Save</p>
    </v-col>

    <!-- icon to return to schedules -->
    <v-col cols="2" class="mt-3 ml-3">
      <v-btn
        v-if="!flags.addingNewSchedule" 
        class="mr-0 ml-3" 
        fab dark x-small 
        color="teal"
        @click="rtnToSchedFromWkly(flags)"
      >
        <v-icon dark>mdi-arrow-left</v-icon>
      </v-btn>
      <p class="ml-2">Back</p>
    </v-col>

  </v-row>

  <div class="pb-4">
    <!-- List day of week and time of each weekly event -->
    <!-- with delete button -->
    <v-list
      v-for="(weeklyEvent, i) in schedules[scheduleIndex].weeklyEvents"
      class="pl-12 py-2 weekly-event"
      :key="i"
      :weeklyEvent="weeklyEvent">

      <v-row>
        <v-col cols="5" class="offset-sm-1 mt-0">
          <v-list-item class="pa-0">
              {{ weeklyEvent.day }} at {{ weeklyEvent.time }}            
          </v-list-item>
        </v-col>

        <v-col cols="2">
          <v-btn 
            class="mr-0 small-dlt mt-3" 
            fab dark color="teal"
            @click="handleDeleteWeeklyEvent(schedules, scheduleIndex, i)"
          >
            <v-icon 
              dark
            >
              mdi-delete-circle
            </v-icon>
          </v-btn>
        </v-col>

      </v-row>
      <v-spacer></v-spacer>
    </v-list>

  </div>

</div>
</template>




<script>
import format from 'date-fns/format';
import axios from 'axios';

export default {
  name: "EditWeeklyEvents",
  props: ["scheduleIndex", "flags", "schedules"],
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
      newTime: "12:00",
      day: 'Saturday',
      showTimePicker: false,
    }
  }, // end data
  methods: {

    // set flags so leaving editting weekly events works properly
    rtnToSchedFromWkly: function(flags) {
      flags.edittingWeeklyEvents = false;
      return flags
    },

    // put time date format
    timeToDate: function(time) {
      return new Date("March 16, 2020 " + time);
    },

    // format time using moment
    getAmPm: function(time) {
      time = this.timeToDate(time);
      return moment(time, "h:mm a");
    },

    // delete the weekly event from the schedule object 
    //  and update the database
    handleDeleteWeeklyEvent: function(schedules, scheduleIndex, i) {
      const id = schedules[scheduleIndex].weeklyEvents[i]._id;
      schedules[scheduleIndex].weeklyEvents = 
        schedules[scheduleIndex].weeklyEvents.filter( 
          weeklyEvent => ( weeklyEvent._id != id ));
      this.updateSchedule(schedules[scheduleIndex]);
      return schedules;
    },

    // Is this used other places?  Should it be modularized?
    // update the schedule object and update the database
    handleSaveWeeklyEvent(schedules, scheduleIndex) {
      schedules[scheduleIndex].weeklyEvents.push({
        day: this.day,
        time: this.newTime
      });

      this.updateSchedule(schedules[scheduleIndex]);

      return schedules;
    },

    // do the axios call to update the database
    updateSchedule: function(schedule) {
      axios.post('/api/schedules/sched', schedule)
      .then(response => {
        console.log(response)
      })
      .catch(err => {
        console.log(err)
      });
    }
  },

};
</script>

<style scoped>

/* tweak spacing and colors */

  #edit-weekly {
    background-color: #dbfffa;
  }

  .weekly-event {
    font-size: 20px;
    background-color: #c4fff9 !important;
    height: 24px;
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