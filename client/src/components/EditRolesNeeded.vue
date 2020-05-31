<template>
<div>
<!-- enter roles (volunteer jobs) needed in this schedule -->

  <!-- Title -->
  <v-row>
    <v-col class="col-12 pa-0">
      <h2 class="text-left col-12 py-0 pl-12">
        Roles needed
      </h2>
    </v-col>
  </v-row>
  
  <!-- enter new role name -->
  <v-row id="edit-role">
    <v-col cols="4" class="pr-1 offset-lg-1 pb-0">
      <v-card class="inputCard">
        <v-card-text class="py-0 inputCard">
          <v-form>
            <v-text-field label="New Role Name" class="py-0" v-model="newRole" autofocus>
            </v-text-field>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- choose number of volunteers needed for that role -->
    <v-col cols="2" class="pb-0">
      <v-card class="inputCard">
        <v-card-text class="py-0 inputCard">
          <v-form>
            <v-text-field type="number" placeholder="#" class="py-0" v-model="newNumNeeded">
            </v-text-field>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- icon for save button to save new role -->
    <v-col cols="2" class="mt-3">
      <v-btn 
        class="mr-1" 
        fab dark x-small 
        color="teal"
        @click="schedules = handleSaveNewRole(schedules, scheduleIndex, newRole, newNumNeeded)"
      >
        <v-icon dark>mdi-content-save-outline</v-icon>
      </v-btn>
      Save
    </v-col>
    
    <!-- icon to return to schedules -->
    <v-col cols="2" class="mt-3 ml-3">
      <v-btn 
        v-if="!flags.addingNewSchedule" 
        class="mr-1" 
        fab dark x-small 
        color="teal"
        @click="rtnToSchedFromRole(flags)"
      >
        <v-icon dark>mdi-arrow-left</v-icon>
      </v-btn>
      Back
    </v-col>

  </v-row>
          


  <div class="pb-4">
    <!-- List day of week and time of each weekly event -->
    <!-- with delete buttom -->
    <v-list
      v-for="(role, i) in schedules[scheduleIndex].roles"
      class="pl-12 py-2 role-event font-s"
      :key="i"
      :role="role">

      <v-row>
        <v-col cols="6" class="offset-sm-1 mt-0">
          <v-list-item class="pa-0 font-s">
              {{ role.roleName }}: {{ role.numberNeeded }}            
          </v-list-item>
        </v-col>

        <v-col cols="1">
          <v-btn 
            class="mr-0 small-dlt mt-3" 
            fab dark color="teal"
            @click="schedules = handleDeleteRole(schedules, scheduleIndex, i)"
          >
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
import axios from 'axios';

export default {
  name: "EditRolesNeeded",

  props: ["schedules", "scheduleIndex", "flags"],

  data () {
    return {
      newRole: '',      
      newNumNeeded: 1,
    }
  },

  methods: {
    // Set flags so returning to schedules page from entering roles works properly
    rtnToSchedFromRole: function(flags) {
      flags.edittingRoles = false;
      return flags
    },

    // Put new role in the schedules array of objects and update the database
    //  for that schedule.
    handleSaveNewRole: function(schedules, scheduleIndex, newRole, newNumNeeded) {
      schedules[scheduleIndex].roles.push({
        roleName: newRole,
        numberNeeded: newNumNeeded
      });
      this.updateSchedule(schedules[scheduleIndex]);
      // returns the new schedules array to display
      return schedules;
    },

    // delete the role from the schedules array of objects, and update
    //   the schedule with the new roles
    handleDeleteRole: function(schedules, scheduleIndex, i) {
      const id = schedules[scheduleIndex].roles[i]._id;
      schedules[scheduleIndex].roles = 
        schedules[scheduleIndex].roles.filter( 
          role => ( role._id != id ));
      this.updateSchedule(schedules[scheduleIndex]);
      return schedules;
    },

    // axios call to do the actual update
    updateSchedule: function(schedule) {
      axios.post('/api/schedules/sched', schedule)
      .then(response => {
        console.log(response)
      })
      .catch(err => {
        console.log(err)
      });
    }
  }

};
</script>


<style scoped>

  .role-event {
    font-size: 20px;
    background-color: #c4fff9 !important;
    height: 24px;
  }

  .small-dlt {
    height: 16px;
    width: 16px;
    margin-top: 10px;
  }

  .inputCard {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    font-size: 14px;
    background-color: #dbfffa;
  }

  * {
    font-size: 20px;
  }

</style>