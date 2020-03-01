<template>
  <v-container cols="12" text-center>
    <h1 cols="12" text-center>Volunteers</h1>

<!-- ***** ADD A SEARCH BOX HERE -->

    <Volunteer
      v-for="(volunteer, i) in volunteers"
      :key="i"
      :volunteer="volunteer"
      mode="volunteers"
      class="pb-5"
      v-on="$listeners"
    />

    <v-flex xs10 offset-xs1 py-2>
      <!-- <v-col center-align> -->
        <v-btn block dark rounded class="teal">Add a new volunteer</v-btn>
      <!-- </v-col> -->
    </v-flex>

  </v-container>
</template>

<script>
import Volunteer from '../components/Volunteer';

export default {
  name: 'Volunteers',
  components: { Volunteer },
  data: function() {
    return {
      volunteers: [
        {
          firstName: "Dorothy",
          lastName: "P.",
          email: "dot@gmail.com",
          image: "312267_289510051082006_2093603433_n.jpg",
          roles: [
            "Sacristan",
            "Eucharistic minister",
          ]
        },
        {
          firstName: "Maura",
          lastName: "S.",
          email: "mauramslavin@gmail.com",
          image: "cuteface2.jpg",
          roles: [
            "Eucharistic minister",
          ],
          with: ["Mike S."],
          notAvailable: ["2020-03-21", "2020-03-22", "2020-05-30", "2020-05-31"]
        },
        {
          _id: 3,
          firstName: "Mike",
          lastName: "S.",
          email: "slavin@myfairpoint.net",
          image: "sneaker.png",
          roles: [
            "Lector"
          ],
          with: ["Maura S."],
          notAvailable: ["2020-03-21", "2020-03-22", "2020-05-30", "2020-05-31"]
        },

      ]  // all volunteers


    };  // return
  }  // anon fcn
// props: ["schedules"]
};

</script>

<style scoped>

</style>