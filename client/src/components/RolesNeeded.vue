<template>

<div>
  <div class="row">
    <div class="col-12 pa-0">
      <h2 class="text-left col-12 py-0 pl-12">
        Roles needed
         <v-btn 
          class="mr-0 ml-3" 
          fab dark x-small 
          color="teal"
          @click="editRolesNeeded(flags)"
        >
          <v-icon dark>mdi-pencil</v-icon>
        </v-btn>
      </h2>
    </div>
  </div>
  
  <!-- List each role and number of people needed -->
  <v-list
      v-for="(role, i) in schedules[scheduleIndex].roles"
      class="py-0 pl-12 weekly-event"
      :key="i"
      :role="role">
          <v-list-item class="pa-0">
              {{ role.roleName }}: {{ role.numberNeeded }}
          </v-list-item>
  </v-list>

</div>
</template>


<script>
  export default {
    name: "RolesNeeded",
    props: ["schedules", "scheduleIndex", "flags"],
    methods: {
      editRolesNeeded: function(flags) {
        flags.edittingRoles = true;
        return flags
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