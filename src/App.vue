<template>
  <div id="app">
    <router-view/>
    <div id="nav">
      <router-link to="/">Home</router-link><br>
      <div class="circle">
        <router-link to="/volunteers">Volunteers</router-link>
      </div>
      <div class="circle">
        <router-link to="/schedules">Schedules</router-link>
      </div>
    </div>
  </div>
</template>

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
