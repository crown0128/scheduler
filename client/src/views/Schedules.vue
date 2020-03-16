<template>
  <v-container cols="12" text-center>
    <v-row>

      <v-col cols="8" offset="2">
        <h1 text-center>Schedules</h1>
      </v-col>

      <v-col cols="2">
        <v-btn 
          class="mx-1 my-1" 
          @click="handleBackButton()"
          to="/schedules"
          fab right dark x-small 
          color="teal"
        >
          <v-icon dark>mdi-arrow-left</v-icon>
        </v-btn>
      </v-col>

    </v-row>

    <div v-if="schedMode==='List'">
    <!-- for each schedule, display a card with it's information -->
      <div v-for="(schedule, i) in schedules"
        v-bind:key="schedule._id"
      >
        <v-row>
          <v-col cols="8" offset="2">
            <Schedule 
              :scheduleIndex="i"
              :schedules="schedules"
              :schedMode="schedMode"
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
 
    <EditSchedule
      v-if="schedMode==='Add'"
      :schedules="schedules"
      :schedMode ="schedMode"
    />

  </v-container>
</template>


<script>
import axios from 'axios';
import Schedule from '../components/Schedule';
import EditSchedule from './EditSchedule.vue';

export default {
  name: 'Schedules',
  components: { Schedule, EditSchedule },
  data: function() {
    return {
      schedules: [],
      schedMode: "List",
    };  // return
  },  // end data

  created() {
    // console.log("in created (in Schedules)");
    this.getSchedules();
  },

  methods: {
    getSchedules() {
      axios.get('/api/schedules')
      .then(response => {
        this.schedules = response.data;
        // console.log("schedules loaded from database.");
        // console.log(response.data);
      });
    },

    handleClickAddSchedule() {
      this.schedMode = "Add";
    },

    handleBackButton() {
      this.schedMode = "List";
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

  },


};

</script>

<style scoped>

.no-underscore { 
  text-decoration: none !important;
}

</style>