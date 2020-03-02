<template>
  <v-container cols="12" text-center>
    <h1 cols="12" text-center>Schedules</h1>

    <!-- for each schedule, display a card with it's information -->
    <Schedule 
      v-for="(schedule, i) in schedules"
      :key="i"
      :schedule="schedule"
      mode="schedules"
      class="pb-5"
      v-on="$listeners"
    />

    <!-- NEW SCHEDULE button -->
    <v-flex xs10 offset-xs1 py-2>
        <v-btn block dark rounded class="teal">Set up a new Schedule</v-btn>
    </v-flex>

  </v-container>
</template>


<script>
import Schedule from '../components/Schedule';

export default {
  name: 'Schedules',
  components: { Schedule },
  data: function() {
    return {
      schedules: [
        {
          _id: 0,
          startDate: "2020-03-07",
          endDate: "2020-05-31",
          roles: [
            "Sacristan",
            "Lector",
            "Eucharistic minister",
            "Altar server",
            "Usher"
          ],
          version: 0,
          weeklyEvents: [
            {
              day: "Saturday",
              time: "17:00"
            },
            {
              day: "Sunday",
              time: "09:00"
            },
            {
              day: "Sunday",
              time: "11:15"
            },
          ],
          events: [
            {
              when: "2020-03-07 17:00:00",
              roles: [
                {
                  roleName: "Sacristan",
                  numberVolunteersNeeded: 1
                },
                {
                  roleName: "Lector",
                  numberVolunteersNeeded: 1
                },
                {
                  roleName: "Eucharistic minister",
                  numberVolunteersNeeded: 3
                },
                {
                  roleName: "Altar server",
                  numberVolunteersNeeded: 1
                },
                {
                  roleName: "Usher",
                  numberVolunteersNeeded: 1
                }
              ]
            },
            {
              when: "2020-03-08 09:00:00",
              roles: [
                {
                  roleName: "Sacristan",
                  numberVolunteersNeeded: 1
                },
                {
                  roleName: "Lector",
                  numberVolunteersNeeded: 1
                },
                {
                  roleName: "Eucharistic minister",
                  numberVolunteersNeeded: 3
                },
                {
                  roleName: "Altar server",
                  numberVolunteersNeeded: 2
                },
                {
                  roleName: "Usher",
                  numberVolunteersNeeded: 2
                }
              ]
            },
            {
              when: "2020-03-08 11:15:00",
              roles: [
                {
                  roleName: "Sacristan",
                  numberVolunteersNeeded: 1
                },
                {
                  roleName: "Lector",
                  numberVolunteersNeeded: 1
                },
                {
                  roleName: "Eucharistic minister",
                  numberVolunteersNeeded: 3
                },
                {
                  roleName: "Altar server",
                  numberVolunteersNeeded: 2
                },
                {
                  roleName: "Usher",
                  numberVolunteersNeeded: 1
                }
              ] // roles
            },  // an event
          ]  // all events
        }, // a schedule
        {
          _id: 1,
          startDate: "2020-01-01",
          endDate: "2020-03-01",
          roles: [
            "Sacristan",
            "Lector",
            "Eucharistic minister",
            "Altar server",
            "Usher"
          ],
          version: 0,
          weeklyEvents: [
            {
              day: "Saturday",
              time: "17:00"
            },
            {
              day: "Sunday",
              time: "09:00"
            },
            {
              day: "Sunday",
              time: "11:15"
            },
          ],
          events: [
            {
              when: "2020-03-07 17:00:00",
              roles: [
                {
                  roleName: "Sacristan",
                  numberVolunteersNeeded: 1
                },
                {
                  roleName: "Lector",
                  numberVolunteersNeeded: 1
                },
                {
                  roleName: "Eucharistic minister",
                  numberVolunteersNeeded: 3
                },
                {
                  roleName: "Altar server",
                  numberVolunteersNeeded: 1
                },
                {
                  roleName: "Usher",
                  numberVolunteersNeeded: 1
                }
              ]
            },
            {
              when: "2020-03-08 09:00:00",
              roles: [
                {
                  roleName: "Sacristan",
                  numberVolunteersNeeded: 1
                },
                {
                  roleName: "Lector",
                  numberVolunteersNeeded: 1
                },
                {
                  roleName: "Eucharistic minister",
                  numberVolunteersNeeded: 3
                },
                {
                  roleName: "Altar server",
                  numberVolunteersNeeded: 2
                },
                {
                  roleName: "Usher",
                  numberVolunteersNeeded: 2
                }
              ]
            },
            {
              when: "2020-03-08 11:15:00",
              roles: [
                {
                  roleName: "Sacristan",
                  numberVolunteersNeeded: 1
                },
                {
                  roleName: "Lector",
                  numberVolunteersNeeded: 1
                },
                {
                  roleName: "Eucharistic minister",
                  numberVolunteersNeeded: 3
                },
                {
                  roleName: "Altar server",
                  numberVolunteersNeeded: 2
                },
                {
                  roleName: "Usher",
                  numberVolunteersNeeded: 1
                }
              ] // roles
            },  // an event
          ]  // all events
        } // a schedule
      ]  // all schedules


    };  // return
  }  // anon fcn

};

</script>


<style scoped>
</style>