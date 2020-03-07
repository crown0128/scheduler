<template>
<div>

  <v-row>
    <v-col class="col-12 pa-0">
      <h2 class="text-left col-12 py-0 pl-12">
        Roles needed
      </h2>
    </v-col>
  </v-row>
  
    <!-- List day of week and time of each weekly event -->
  <v-row id="edit-role">
    
    <!-- enter new role name -->
    <v-col cols="5" class="pr-1 offset-lg-1 pb-0">
      <v-card class="inputCard">
        <!-- <v-card-title class="py-0 px-1 inputCard">
          <p class="inputCard">Name of Role</p>
        </v-card-title> -->
        <v-card-text class="py-0 px-1 inputCard">
          <v-form>
            <v-text-field label="New Role Name" class="py-0" v-model="newRole" autofocus>
            </v-text-field>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- choose number of volunteers needed for that role -->
    <v-col cols="3" class="pb-0">
      <v-card class="inputCard">
        <!-- <v-card-title class="py-0 px-1 inputCard">
          <p class="inputCard">Nbr</p>
        </v-card-title> -->
        <v-card-text class="py-0 px-1 inputCard">
          <v-form>
            <v-text-field type="number" placeholder="#" class="py-0" v-model="newNumNeeded">
            </v-text-field>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- icon to save new role -->
    <v-col cols="1" class="mt-3">
      <v-btn 
        class="mr-1" 
        fab dark x-small 
        color="teal"
        @click="schedules = handleSaveNewRole(schedules, scheduleIndex, newRole, newNumNeeded)"
      >
        <v-icon dark>mdi-content-save-outline</v-icon>
      </v-btn>
    </v-col>
    
    <!-- icon to return to schedules -->
    <v-col cols="1" class="mt-3 ml-3">
      <v-btn 
        v-if="!flags.addingNewSchedule" 
        class="mr-1" 
        fab dark x-small 
        color="teal"
        @click="rtnToSchedFromRole(flags)"
      >
        <v-icon dark>mdi-arrow-left</v-icon>
      </v-btn>
    </v-col>

  </v-row>
          


  <div class="pb-4">
    <!-- List day of week and time of each weekly event -->
    <!-- with delete buttom -->
    <v-list
      v-for="(role, i) in schedules[scheduleIndex].roles"
      class="pl-12 pt-0 role-event"
      :key="i"
      :role="role">

      <v-row>
        <v-col cols="6" class="offset-sm-1 mt-0">
          <v-list-item class="pa-0">
              {{ role.roleName }}: {{ role.numberNeeded }}            
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
  name: "EditRolesNeeded",
  props: ["schedules", "scheduleIndex", "flags"],
  data () {
    return {
      newRole: '',
      newNumNeeded: 1,
    }
  },
  methods: {
    rtnToSchedFromRole: function(flags) {
      flags.edittingRoles = false;
      return flags
    },

    handleSaveNewRole: function(schedules, scheduleIndex, newRole, newNumNeeded) {
      console.log("in HandleSaveNewRole in EditRolesNeeded component");
      schedules[scheduleIndex].roles.push({
        roleName: newRole,
        numberNeeded: newNumNeeded
      });
      console.log("updated schedules");
      console.log(schedules);
      return schedules;
    }
  }

};
</script>


<style scoped>
  /* #edit-role {
    background-color: #dbfffa;
  } */

  .role-event {
    font-size: 14px;
    background-color: #c4fff9 !important;
    height: 20px;
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

</style>