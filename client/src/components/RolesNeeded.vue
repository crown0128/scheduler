<template>

<!-- header, with "edit" button (to add new roles) -->
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
        Edit
      </h2>
    </div>
  </div>
  
  <!-- List each role and number of people needed -->
  <v-list
      v-for="(role, i) in schedules[scheduleIndex].roles"
      class="py-2 pl-12 weekly-event"
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
      // set flag appropriately so correct component is shown
      editRolesNeeded: function(flags) {
        flags.edittingRoles = true;
        return flags
      }
    }
  };
</script>


<style scoped>

 /* tweak color and spacing */
  .weekly-event {
    font-size: 20px;
    background-color:  #c4fff9 !important;
    height: 24px;
  }
</style>