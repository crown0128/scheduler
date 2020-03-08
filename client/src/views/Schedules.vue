<template>
  <v-container cols="12" text-center>
    <h1 cols="12" text-center>Schedules</h1>

    <!-- for each schedule, display a card with it's information -->
    <div v-if="!addSched">
      <Schedule 
        v-for="(schedule, i) in schedules"
        :key="schedule._id"
        :scheduleIndex="i"
        :schedules="schedules"
        :addSched="addSched"
        mode="schedules"
        class="pb-5"
        v-on="$listeners"
      />
      <!-- NEW SCHEDULE button -->
      <v-flex xs10 offset-xs1 py-2>
        <v-btn 
          block dark rounded 
          @click="handleClickAddSchedule"
          class="teal">
          Set up a new Schedule
          </v-btn>
      </v-flex>
    </div>
 
    <AddSchedule
      v-if="addSched"
      :schedules="schedules"
      :addSched="addSched"
    />

  </v-container>
</template>


<script>
import axios from 'axios';
import Schedule from '../components/Schedule';
import AddSchedule from '../components/AddSchedule';

export default {
  name: 'Schedules',
  components: { Schedule, AddSchedule },
  data: function() {
    return {
      schedules: [],
      addSched: false,
    };  // return
  },  // end data

  created() {
    console.log("in created (in Schedules)");
    this.getSchedules();
  },

  methods: {
    getSchedules() {
      axios.get('/api/schedules')
      .then(response => {
        this.schedules = response.data;
        console.log("schedules loaded from database.");
        console.log(response.data);
      });
    },

    handleClickAddSchedule() {
      this.addSched = true;
    },

    // getIndex(schedules, schedule) {
    //   return schedules.map( sched => sched._id ).indexOf(schedule.id);
    // }
  },

    // deleteSchedule: function(scheduleId) {
    //   alert("Deleting schedule.")
    //   this.schedule = this.schedule.filter(id => {
    //     return id !== scheduleId;
    //   });
    // },


    // editRoles: function(flagsRoles) {
    //   flagsRoles = true;
    // }

};

</script>


<style scoped>
</style>