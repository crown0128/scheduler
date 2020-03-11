<template>
<div id="app">
  <v-app>

    <v-row no-gutters>

      <!-- HOME button and link -->
      <v-col cols="4">
        <v-card class="pa-2 bg-lightteal" outlined tile>
          <router-link to="/">         
            <v-btn class="mx-2" fab dark large color="teal">
              <v-icon dark>mdi-home</v-icon>
            </v-btn>
          </router-link>
          <p class="pt-2"><strong>Home</strong></p>
        </v-card>
      </v-col>

      <!-- SCHEDULES button and link -->
      <v-col cols="4">
        <v-card class="pa-2 bg-lightteal" outlined tile>
          <router-link to="/schedules">         
            <v-btn class="mx-2" fab dark large color="teal">
              <v-icon dark>mdi-calendar-multiselect</v-icon>
            </v-btn>
          </router-link>
          <p class="pt-2"><strong>Schedules</strong></p>
        </v-card>
      </v-col>

      <!-- VOLUNTEERS button and link -->
      <v-col cols="4">
        <v-card class="pa-2 bg-lightteal" outlined tile>
          <router-link to="/volunteers">         
            <v-btn class="mx-2" fab dark large color="teal">
              <v-icon dark>mdi-account-multiple</v-icon>
            </v-btn>
          </router-link>
          <p class="pt-2"><strong>Volunteers</strong></p>
        </v-card>
      </v-col>

    </v-row>

    <div class="header">
      <!-- This is where my component from the router gets loaded -->
      <router-view></router-view>
    </div>
  </v-app>
</div>
</template>


<script>
  import Schedules from './views/Schedules';
  import Volunteers from './views/Volunteers';
  // import EditSchedule from './views/EditSchedule';
  // import EditVolunteer from './views/EditVolunteer';

  export default {
    name: 'App',

    components: {
      Schedules,
      Volunteers,
      // EditSchedule,
      // EditVolunteer
    }

  };  // end of export
</script>


<style>
  .bg-lightteal {
    background-color: #c4fff9 !important;
    border-width: 0 !important;
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #040e0f;
    background-color: #c4fff9;
  }

  #nav {
    padding: 30px;
    text-decoration: none;
  }

  #nav a {
    font-weight: bold;
    color: #040e0f;
  }

  #nav a.router-link-exact-active {
    color: #0216b0
  }

  .no-underscore {
    text-decoration: none !important;
  }

</style>
