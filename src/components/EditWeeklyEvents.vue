<template>

<!-- ********* does this go in Schedule when edit is clicked ?? ***** -->
<div>
    <h1>This page is to edit Schedule #{{ $route.params.id }}.</h1>
    <!-- Schedules[ {{ $route.params.id }} ].firstName  -->
    <!-- Schedule {{ $route.params.schedule.roles[0] }} -->
   {{ $route.params }}
          <!-- <v-col cols="4">
            <v-list
              v-for="(role, i) in volunteer.roles"
              class="py-0 px-4 role"
              :key="i"
              :role="role">
              <v-list-item class="pa-0">
                {{ role }}            
              </v-list-item>
            </v-list>
          </v-col> -->
</div>


</template>




<script>
export default {
  name: "EditWeeklyEvents",
  props: ["schedule"],
};
</script>

<style scoped>



</style>