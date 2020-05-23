<template>
  <div class="home mb-12">

    <!-- welcome and brief instructions -->
    <h1>Welcome to the (DEVELOPMENT) Slavin Scheduler!</h1>
    <!-- basic instructions -->
    <p class="pa-0 font-s">
      Click Schedules icon to manage (edit, add, delete, or run) schedules,
      <v-spacer></v-spacer>  <!-- line break -->
      click Volunteers icon to manage (edit, add or delete) volunteers.
      <v-spacer></v-spacer>  <!-- line break -->
      Must set up a schedule before volunteers can be added.
    </p>

    <!-- decorative icon -->
    <img alt="Scheduler logo" src="../assets/weeklyplanner.jpg">
  </div>
</template>


<script>
  export default {
    name: 'Home',
  }


</script>


<style scoped>

  /* tweak colors and spacing */
  
  h3 {
    margin: 40px 0 0;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  .font-s {
    font-size: 20px;
  }
  
  a {
    color: #42b983;
  }

  .none {
    border: none;
  }

</style>