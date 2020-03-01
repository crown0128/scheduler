<template>
<div id="app">
  <v-app>
<!-- <div id="app" class="teal--text text--darken-4"> -->

    <!-- <h1>Welcome to the Slavin Scheduler!</h1> -->
    <div class="header">
      <router-view></router-view>
    </div>
    <router-link to='/' class='text-left pl-3 no-underscore'>
      Home
    </router-link>
    <v-row no-gutters>
      <v-col  
        cols="6"
      >
        <v-card 
          class="pa-2 bg-lightteal"
          outlined
          tile
        >
          <p>
              Click to add, 
              edit or delete information about your <strong>schedules</strong>.
          </p>
          <router-link to="/schedules">         
            <v-btn class="mx-2" fab dark large color="teal">
              <v-icon dark>mdi-calendar-multiselect</v-icon>
            </v-btn>
          </router-link>
        </v-card>
      </v-col>

      <v-col  
        cols="6"
      >
        <v-card 
          class="pa-2 bg-lightteal"
          outlined
          tile
        >
          <p>
            Click to add, 
            edit or delete information about your <strong>volunteers</strong>.
          </p>
          <router-link to="/volunteers">         
            <v-btn class="mx-2" fab dark large color="teal">
              <v-icon dark>mdi-account-multiple</v-icon>
            </v-btn>
          </router-link>
        </v-card>

      </v-col>
    </v-row>



        <!-- use router-link component for navigation. -->
        <!-- specify the link by passing the `to` prop. -->
        <!-- `<router-link>` will be rendered as an `<a>` tag by default -->
      <!-- <router-link to="/">Home</router-link><br> -->

      
      <!-- route outlet -->
      <!-- component matched by the route will render here -->



      <!-- <v-btn
        href="/"
        text
      >
        <span class="mr-2">Home</span>
        <!-- <v-icon>mdi-open-in-new</v-icon> -->
      <!-- </v-btn>

      <v-btn
        href="/volunteers"
        text
      >
      <router-link to='/volunteers'></router-link>
        <span class="mr-2">Volunteers</span>
        <!-- <v-icon>mdi-open-in-new</v-icon> -->
      <!-- </v-btn>
   
      <v-btn
        href="/schedules"
        text
      >
        <span class="mr-2">Schedules</span>
        <!-- <v-icon>mdi-open-in-new</v-icon> -->
      <!-- </v-btn> -->

    <!-- <v-content>
      <HelloHeader/>
    </v-content> --> 
  </v-app>
</div>
</template>

<script>
import HelloHeader from './components/HelloHeader';
import Schedules from './views/Schedules';
import Volunteers from './views/Volunteers';

export default {
  name: 'App',

  components: {
    HelloHeader,
    Schedules,
    Volunteers
  }

};  // export
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
