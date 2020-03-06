<template>
  <v-container cols="12" text-center>
    <h1 cols="12" text-center>Schedules</h1>

    <!-- for each schedule, display a card with it's information -->
    <div v-if="!addSched">
      <Schedule 
        v-for="(schedule, i) in schedules"
        :key="i"
        :schedule="schedule"
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
 
    <div v-if="addSched">
      <AddSchedule
        v-if="addSched"
        :schedules="schedules"
      />
    </div>

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
        console.log(response.data);
      });
    },
    handleClickAddSchedule() {
      this.addSched = true;
    }
  },

    // deleteSchedule: function(scheduleId) {
    //   alert("Deleting schedule.")
    //   this.schedule = this.schedule.filter(id => {
    //     return id !== scheduleId;
    //   });
    // },


    // editRoles: function(doEditRoles) {
    //   doEditRoles = true;
    // }

};

</script>


<style scoped>
</style>