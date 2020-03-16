<template>
<v-app class="bg-lightteal">
  <v-container cols="12" text-center align="center" justify="center" class="pt-0">
    <v-row>
      <v-col cols="8" offset="2">
          <h1>Add a volunteer</h1>
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


<!-- //  see https://stackoverflow.com/questions/44989162/file-upload-in-vuetify -->
<!-- 
            <v-btn icon @click="dialog = !dialog">
                <v-icon>link</v-icon>
            </v-btn>

    <v-content>
			<v-container fluid>
				<v-flex xs12 class="text-xs-center text-sm-center text-md-center text-lg-center">
					<img :src="imageUrl" height="150" v-if="imageUrl"/>
					<v-text-field label="Select Image" @click='pickFile' v-model='imageName' prepend-icon='attach_file'></v-text-field>
					<input
						type="file"
						style="display: none"
						ref="image"
						accept="image/*"
						@change="onFilePicked"
					>
				</v-flex>
				<!-- <v-dialog v-model="dialog" max-width="290">
					<v-card>
						<v-card-title class="headline">Hello World!</v-card-title>
						<v-card-text>Image Upload Script in VUE JS
							<hr>Yubaraj Shrestha
							<br>http://yubarajshrestha.com.np/</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="green darken-1" flat="flat" @click.native="dialog = false">Close</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog> -->
			<!-- </v-container>
		</v-content>  -->

    <v-row>
      <!-- choose roles & preferred times -->
      <v-col cols="6" class="white">
        <p class="text-left">Choose role(s):</p>
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

      </v-col>

      <v-col cols="6" class="white">
        <p class="text-left">Choose a preferred time slot:</p>
        <v-radio-group class="ml-2"
          v-model="preferredTime"
        ><v-radio
            class = "my-0 list-height"
            v-for="(timeSlot, index) in timeSlots"
            v-bind:key="index"
            :label="formatTime(timeSlot)"
            :value="`${index}`"
            color="teal"
          ></v-radio>
        </v-radio-group>

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

    <!-- volunteers[ {{ $route.params.id }} ].firstName  -->
</v-container>
  </v-app>


</template>



<script>
import axios from 'axios';
import moment from 'moment';
// for future release (or store in cloud)
// import {avatars} from './avatars'

export default {
  name: "AddVolunteer",
  props: ["volunteers", "schedules", "roles", "timeSlots", "volunteerNames"],
  data: function() {
    return {

      firstName: "",
      lastName: "",
      email: "",
      image: "",
      date: null,
      menu2: false,
      // datesAll: [],
      badDates: [],
      showNotAvailablePicker: false,

      schedules: [],
      roles: [],
      timeSlots: [],
      volunteerNames: [],

      eventTimes: [],
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

    }
  },


  methods: {

    formatTime: function(timeSlot) {
      const day = timeSlot.day;
      // add random date to time so we can use moment to format it
      let time = new Date("March 16, 2020 " + timeSlot.time);
      time = moment(time).format("hh:mm a").toString();
      return `${day} at ${time}`;  // returned to put on window
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

      this.createVolunteer(this.volunteer);
      this.volunteers.push(this.volunteer);
      this.handleReturnToVolunteerList();
    },

    createVolunteer: function(volunteer) {
      axios.post('/api/volunteers', volunteer)
      .then(response => {
        console.log(response)
      })
      .catch(err => {
        console.log(err)
      });
    },

      getVolunteersAndSchedules() {
        axios.get('/api/volunteers')
        .then(response => {

          this.getSchedules();
          this.volunteers = response.data;
          this.volunteers.forEach((volunteer, i) => {
            const newVol = {
              id: volunteer._id,
              name: volunteer.firstName + " " + volunteer.lastName
            };
            this.volunteerNames.push(newVol);
          });
        });
      },


      getSchedules() {
        axios.get('/api/schedules')
        .then(res => {
          this.schedules = res.data;
        })
        .then(response => {
          // Get all role names from schedules, remove dups & alphabetize
          this.schedules.forEach((schedule, index) => {
            
            roles[index] = schedule.roles;
            roles[index] = roles[index].map(role => role.roleName);
            
          });
          // flatten array, so only one level deep
          this.roles = [].concat.apply([], this.roles);
          // remove duplicates
          this.roles = this.roles.filter((a, b) => this.roles.indexOf(a) === b);
          // sort the array
          this.roles = this.roles.sort();
          
          let nth = 0;
          // Get all time slots from schedules
          this.schedules.forEach((schedule, index) => {
            schedule.weeklyEvents.forEach((weeklyEvent, i) => {
              const slot = {
                index: nth++,
                day: weeklyEvent.day,
                time: weeklyEvent.time
              };
              // Add the slot to the timeSlots array (or initiate it, if the first one)
              if (this.timeSlots.length === 0) {
                this.timeSlots = [slot]
              } else {
                this.timeSlots.push(slot);
              };
            });

            // remove duplicate day/time combinations
            this.timeSlots = this.timeSlots.filter((timeSlot, index, self) => 
              index === self.findIndex((t) => (
                t.day === timeSlot.day && t.time === timeSlot.time
              ))
            );
          });
        });

      },
  },

  // created() {
  mounted() {
    this.getVolunteersAndSchedules();

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

/* Make same height as other imput boxes */
.match-height {
  height: 53.98px;
}

li a { 
  text-decoration: none !important;
}

</style>