<template>
  <div class="home mb-12">

    <!-- welcome and brief instructions -->
    <h1>Welcome to the Slavin Scheduler!</h1>
    <p class="pa-0">
      Click Schedules icon to manage (edit, add, delete, or run) schedules,
      <v-divider class="none"></v-divider>  <!-- line break -->
      click Volunteers icon to manage (edit, add or delete) volunteers.
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

  a {
    color: #42b983;
  }

  .none {
    border: none;
  }

</style>