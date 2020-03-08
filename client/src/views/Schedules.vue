<template>
  <v-container cols="12" text-center>
    <h1 cols="12" text-center>Schedules</h1>

    <div v-if="!addSched">
    <!-- for each schedule, display a card with it's information -->
      <div v-for="(schedule, i) in schedules"
        v-bind:key="schedule._id"
      >
        <v-row>
          <v-col cols="8" offset="2">
            <Schedule 
              :scheduleIndex="i"
              :schedules="schedules"
              :addSched="addSched"
              mode="schedules"
              class="pb-5"
              v-on="$listeners"
            />
          </v-col>
          <v-col cols="1" text-left>
                        <v-btn 
              fab dark x-small color="teal"
              @click="schedules = handleDeleteSchedule(schedules, i)"
            >
              <v-icon dark>mdi-delete-circle</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>
        
      <!-- NEW SCHEDULE button -->
      <v-flex xs10 offset-xs1 py-2>
        <v-btn 
          block dark rounded 
          @click="handleClickAddSchedule"
          class="teal"
        >Set up a new Schedule
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

    handleDeleteSchedule: function(schedules, scheduleIndex) {
      const id = schedules[scheduleIndex]._id;
      schedules = schedules.filter( schedule => 
        schedule._id != id);
      this.deleteSchedule(id);
      return schedules;
    },

    deleteSchedule: function(id) {
      axios.delete(`/api/schedules/id/${id}`)
      .then(response => {
          console.log(response);
      })
      .catch(err => {
        console.log(err);
      });
    }
    // getIndex(schedules, schedule) {
    //   return schedules.map( sched => sched._id ).indexOf(schedule.id);
    // }
  },

  computed: {

  }

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