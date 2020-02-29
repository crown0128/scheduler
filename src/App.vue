<template>
  <v-app>
<div id="app">
  <!-- <h1>Welcome to the Slavin Scheduler!</h1> -->
  <p>
    <!-- use router-link component for navigation. -->
    <!-- specify the link by passing the `to` prop. -->
    <!-- `<router-link>` will be rendered as an `<a>` tag by default -->
    <router-link to="/">Home</router-link><br>
    <router-link to="/volunteers">Volunteers</router-link><br>
    <router-link to="/schedules">Schedules</router-link>
  </p>
  <!-- route outlet -->
  <!-- component matched by the route will render here -->
  <router-view></router-view>
</div>


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
</template>

<script>
import HelloHeader from './components/HelloHeader';

export default {
  name: 'App',

  components: {
    HelloHeader,
  },

  data: () => ({
    //
  }),
};
</script>

<style>
.circle {
  color: red;
  /* icon in a circle w/ Vuetify for these?? */
  /* height: 300px;
  width: 300px;
  background-color: white;
  border-color: #0216b0;
  border-width: 3px;
  border-radius: 90%; */
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #42b983;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #42b983;
}

#nav a.router-link-exact-active {
  color: #0216b0
}
</style>
