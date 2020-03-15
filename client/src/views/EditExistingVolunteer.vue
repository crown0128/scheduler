<template>
<v-app class="bg-lightteal">
<!-- ********* does this go in Volunteer when edit is clicked ?? ***** -->
  <v-container cols="12" text-center align="center" justify="center" class="pt-0">
    <!-- volunteer #{{ $route.params.id }}. -->
    <v-row>
      <v-col cols="8" offset="2">
          <h1>Edit an existing volunteer</h1>
      </v-col>

      <v-col cols="2">
        <v-btn 
          class="mx-1 my-1" 
          to="/volunteers"
          fab right dark x-small 
          color="teal"
        >
          <v-icon dark>mdi-arrow-left</v-icon>
        </v-btn>
      </v-col>

    </v-row>

    <v-row>

        <!-- enter first name -->
        <v-col cols="3">
          <v-card class="inputCard">
            <v-card-text class="py-0 px-1 inputCard">
              <v-form>
                <v-text-field 
                  label="First Name" 
                  class="py-0" 
                  v-model="firstName" 
                  autofocus
                  clearable
                ></v-text-field>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- enter last name -->
        <v-col cols="3">
          <v-card class="inputCard">
            <v-card-text class="py-0 px-1 inputCard">
              <v-form>
                <v-text-field 
                  label="Last Name" 
                  class="py-0" 
                  v-model="lastName" 
                  clearable
                ></v-text-field>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- enter email -->
        <v-col cols="3">
          <v-card class="inputCard">
            <v-card-text class="py-0 px-1 inputCard">
              <v-form>
                <v-text-field 
                  label="Email" 
                  class="py-0" 
                  v-model="email" 
                  clearable
                >
                </v-text-field>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- choose image file -->
        <v-col cols="3">
          <v-card class="inputCard">
            <v-card-text class="py-0 px-1 inputCard">
              <v-form class="match-height">
                <v-select
                  label="Choose avatar image." 
                  v-model="image"
                  prepend-icon="mdi-camera"
                  :items="avatars"
                  dense
                ></v-select>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
    </v-row>

    <v-row>
      <!-- choose roles & preferred times -->
      <v-col cols="6" class="white">
        <p class="text-left">Choose role:</p>
        <!-- to choose more than one in a future release
        <checkbox class="ml-2 my-0 list-height" -->
        <v-radio-group class="ml-2"
          v-model="rolesChosen"
        ><v-radio
        
          class="my-0 list-height"
          v-for="(role, roleIndex) in roles"
          v-bind:key="roleIndex"
          :value="`${role}`"
          :label="`${role}`"
          color="teal"
        ></v-radio>
        </v-radio-group>
        <p>{{ rolesChosen }}</p>

      </v-col>

      <v-col cols="6" class="white">
        <p class="text-left">Choose a preferred time slot (pick one in the next schedule to be run):</p>
        <v-radio-group class="ml-2"
          v-model="preferredTime"
        ><v-radio
            class = "my-0 list-height"
            v-for="(timeSlot, idx) in timeSlots"
            v-bind:key="idx"
            :label="formatTime(timeSlot)"
            :value="`${idx}`"
            color="teal"
          ></v-radio>
        </v-radio-group>

        <p>{{ preferredTime }} in {{ timeSlots.length }}</p>
      </v-col>

    </v-row>

    <v-row>
        <!-- choose availability -->
      <v-col cols="11">
        <v-card class="inputCard">
          <v-card-text class="py-0 px-1 inputCard">


            <v-dialog
              ref="dialog"
              v-model="showNotAvailablePicker"
              persistent
              width="290px"
            >

              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="badDates"
                  label="Choose dates volunteer is NOT available."
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>

              <v-date-picker
                v-if="showNotAvailablePicker"
                v-model="badDates"
                full-width
                color="teal"
                no-title
                multiple
                :min="today()"
              >
                <v-spacer></v-spacer>
                <v-btn text color="teal" @click="showNotAvailablePicker = false">Cancel</v-btn>
                <v-btn text color="teal" @click="$refs.dialog.save( badDates )">OK</v-btn>
              </v-date-picker>
            </v-dialog>

            <v-spacer></v-spacer>
            <p>{{ badDates }} entered.</p>

          </v-card-text>
        </v-card>
      </v-col>

      <!-- save button -->
      <v-col cols="1"> 
        <v-btn class="mx-1 my-1" fab right dark x-small color="teal">
          <v-icon dark @click="handleSaveNewVolunteer(volunteers);"> mdi-content-save-outline</v-icon>
        </v-btn>
      </v-col>

    </v-row>


    <!-- scheduling with and not-with saved for a future release -->

    <!-- <v-row> -->
        <!-- choose who to schedule with (or not) -->
 
                   <!-- choose roles & preferred times -->
      <!-- <v-col cols="4" class="white">
        <p class="text-left">Choose volunteers to schedule this person with:</p>
        <v-checkbox class="ml-2 my-0 list-height"
          v-for="(volunteer, volIndex) in volunteerNames"
          v-bind:key="volIndex"
          v-model="schedWith"
          :value="`${volunteer.id}`"
          :label="`${volunteer.name}`"
          multiple
          color="teal"
        ></v-checkbox>
        <p>{{ schedWith }}</p>

      </v-col>

      <v-col cols="4" offset="1" class="white">
        <p class="text-left">Choose volunteers to AVOID scheduling this person with:</p>
        <v-checkbox class="ml-2 my-0 list-height"
          v-for="(volunteer, volIndex) in volunteerNames"
          v-bind:key="volIndex"
          v-model="notWith"
          :value="`${volunteer.id}`"
          :label="`${volunteer.name}`"
          multiple
          color="teal"
        ></v-checkbox>
        <p>{{ notWith }}</p>

      </v-col>  -->


    <!-- </v-row> -->

</v-container>
</v-app>


</template>



<script>
import axios from 'axios';
import moment from 'moment';

// import '../../public/images/avatars.js'


export default {
  name: "EditExistingVolunteer",
  data: function() {
    return {

      volunteer: {},
      _id: "",
      firstName: "",
      lastName: "",
      email: "",
      image: "",


      date: null,
      menu2: false,
      // datesAll: [],
      badDates: [],
      showNotAvailablePicker: false,
      timeSlots: [],
      badDates: [],

      eventTimes: [],
      roles: [],
      rolesChosen: [],
      preferredTime: "",
      avatars: [
        "bear.jpg",
        "bignose.jpg",
        "blue-flower.jpg",
        "cat.jpg",
        "cheetah.jpg",
        "dog.jpg",
        "football.jpg",
        "giraffe.jpg",
        "goofy.jpg",
        "hedgehog.jpg",
        "kitty.jpg",
        "koala.jpg",
        "monkey.jpg",
        "orange-flower.jpg",
        "pink-flower.jpg",
        "puppy.jpg",
        "ski.jpg",
        "smilie.jpg",
        "sneaker.jpg",
        "soccer.jpg",
        "thumbs.jpg",
        "tiger.jpg",
        "xcski.jpg",
        "yellow-flower.jpg"
    ]
      // Save with and notWith features for future release
      // schedWith: [],
      // notWith: []

    }
  },


  methods: {

    formatTime: function(timeSlot) {
      const day = timeSlot.day;
      // add random date to time so we can use moment to format it
      let time = new Date("March 16, 2020 " + timeSlot.time);
      time = moment(time).format("hh:mm a").toString();
      console.log("editexistingvolunteer...  formatted timeslot");
      console.log(`${day} at ${time}`);
      return `${day} at ${time}`;
    },

    today: function() {
      const t = new Date().toJSON().slice(0,10);
      return t;
    },

    save: function (date) {
      var index = this.badDates.findIndex(x => x===date)

      if (index === -1){
          this.badDates.push(moment(date).format("YYYY-MM-DD").toString());
      }
      else {
        this.badDates.splice(index,1);
      }
    },


    handleReturnToVolunteerList: function() {
      this.$router.push({ name: 'Volunteers' })
    },

    handleSaveNewVolunteer: function(volunteers) {

      this.image = this.image.toString();

      this.volunteer = {
        _id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        image: this.image,
        roles: [this.rolesChosen],
        prefTimes: {
          day: this.timeSlots[this.preferredTime].day,
          time: this.timeSlots[this.preferredTime].time,
          percentPreferred: 100
        },
        notAvailable: this.badDates,
        // Save with and notWith features for a future release
        // with: this.schedWith,
        // notWith: this.notWith
      };

      this.updateVolunteer(this.volunteer);
      this.volunteers.push(this.volunteer);
      this.handleReturnToVolunteerList();
    },

    updateVolunteer: function(volunteer) {
      axios.post('/api/volunteers/volunteer', volunteer)
      .then(response => {
        console.log(response)
      })
      .catch(err => {
        console.log(err)
      });
    },

  },

  // created() {
  mounted() {
    const id = this.$route.params.id;
    this.roles = this.$route.params.roles;
    
    this.timeSlots = this.$route.params.timeSlots;

    // this is passed in --- duplicates should already have been removed.
    
    this.volunteers = this.$route.params.volunteers;
    let index = this.volunteers.findIndex(volunteer => volunteer._id === id);
    let editVolunteer = this.volunteers[index];

    this.rolesChosen = editVolunteer.roles[0]; // only one for this release

    this._id = this.volunteers[index]._id;
    this.firstName = this.volunteers[index].firstName;
    this.lastName = this.volunteers[index].lastName;
    this.email = this.volunteers[index].email;
    this.image = this.volunteers[index].image;
;
    this.preferredTime = this.volunteers[index].preferredTime;
    this.badDates = this.volunteers[index].notAvailable;

    // drop old dates (before today)
    this.badDates = this.badDates.filter(badDate => moment(badDate) >= moment(Date.now()));
  },

};

</script>

<style scoped>

.bg-lightteal {
  background-color: #c4fff9 !important;
}

.list-height {
  height: 1.5em;
}

.volunteer-name {
  color:blue;
  font-size: 1.25em;
  padding: 20px 0 0;
  text-align: left;
}

.role {
  font-size: 16px;
  background-color:  #c4fff9 !important;
  height: 20px;
}

/* avatar selection same height as rest of row */
.match-height {
  height: 53.98px;
}

</style>