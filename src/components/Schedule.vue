<template>


  <v-row text-center class="justify-center">
    <div class="v-card v-card--shaped v-sheet elevation-7 px-3 py-1" supportingtext="true">

      <div class="v-card__text schedule-title">
        Schedule:  {{schedule.startDate}} - {{schedule.endDate}}
      </div>

      <div class="v-card__text pa-1">
        (Number of times this schedule has been run:  {{schedule.version}})
      </div>

      <v-row>
        <v-col cols="6" class="v-card__text">

          <div class="row">
            <div class="col-12 pa-0">
            <h2 class="text-left col-12 py-0 pl-12">Weekly events</h2>
            </div>
          </div>
          
          <v-list
            v-for="(weeklyEvent, i) in schedule.weeklyEvents"
            class="pl-12 py-0 weekly-event"
            :key="i"
            :weeklyEvent="weeklyEvent">
            <v-list-item class="pa-0">
              {{ weeklyEvent.day }} at {{ weeklyEvent.time }}            
            </v-list-item>
          </v-list>
        </v-col>

        <v-col cols="6" class="v-card__text">

          <div class="row">
            <div class="col-12 pa-0">
              <h2 class="text-left col-12 py-0">Roles needed</h2>
            </div>
          </div>

          <v-list
            v-for="(role, i) in schedule.roles"
            class="py-0 px-4 weekly-event"
            :key="i"
            :role="role">
            <v-list-item class="pa-0">
              {{ role }}            
            </v-list-item>
          </v-list>

        </v-col>

      </v-row>
    </div>
  </v-row>




  <!-- <v-list-item class="bg-lightteal col-12 text-center">
    <v-list-items class="col-12 pa-0">
      <v-list-item class="col-12 pa-0">
        <h1 class="text-center col-12 pa-0">Schedule:  {{schedule.startDate}} - {{schedule.endDate}}</h1>
      </v-list-item>

      <v-list-item class="col-12 pa-0">
        <span class="text-center col-12 pa-0">(Number of times this schedule has been run:  {{schedule.version}})</span>
      </v-list-item>

      <v-list-item class="col-6 pa-0">
        <div class="row">
          <div class="col-12">
           <h2 class="text-left col-12 py-0 pl-12">Weekly events:</h2>
          </div>
        </div>
        
        <v-list
          v-for="(weeklyEvent, i) in schedule.weeklyEvents"
          :key="i"
          :weeklyEvent="weeklyEvent">
          <v-list-item>
            {{ weeklyEvent.day }} at {{ weeklyEvent.time }}            
          </v-list-item>
        </v-list>
      </v-list-item>


    </v-list-items>
  </v-list-item> -->
</template>

<script>
export default {
  name: "Schedule",
  props: ["schedule"],
};
</script>

<style scoped>

.bg-lightteal {
  background-color: #c4fff9 !important;
  border-width: 0 !important;
}

.schedule-title {
  color:blue;
  text-decoration-line: underline;
  font-size: 2em;
  padding: 20px 0 0;
}

.weekly-event {
  font-size: 14px;
  background-color:  #c4fff9 !important;
  height: 20px;
}
</style>