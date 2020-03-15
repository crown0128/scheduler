<template>
<v-app class="bg-lightteal">
<!-- ********* does this go in Volunteer when edit is clicked ?? ***** -->
  <v-container cols="12" text-center align="center" justify="center" class="pt-0">
    <!-- volunteer #{{ $route.params.id }}. -->
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

        <!-- <v-btn class="mx-1 my-1" @click="handleReturnToVolunteerList();" fab right dark x-small color="teal">
          <v-icon dark>mdi-arrow-left</v-icon>
        </v-btn>
      </v-col> -->

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
        <p class="text-left">Choose a preferred time slot (pick one in the next schedule to be run):</p>
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

        <p>{{ preferredTime }}</p>
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

    <!-- volunteers[ {{ $route.params.id }} ].firstName  -->
</v-container>
  </v-app>


</template>



<script>
import axios from 'axios';
import moment from 'moment';

// import {avatars} from './avatars'

export default {
  name: "AddVolunteer",
  // props: ["volunteers", "volunteerIndex", "volunteerMode", "schedules", "roles", "timeSlots", "volunteerNames"],
  props: ["volunteers", "schedules", "roles", "timeSlots", "volunteerNames"],
  data: function() {
    return {

      // volunteers: [],
      // volunteer: {},
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
      // Save with and notWith features for future release
      // schedWith: [],
      // notWith: []

      // title: "Image Upload",
      // dialog: false,
      // imageName: '',
      // imageUrl: '',
      // imageFile: ''
    }
  },


  methods: {

    formatTime: function(timeSlot) {
      const day = timeSlot.day;
      // add random date to time so we can use moment to format it
      let time = new Date("March 16, 2020 " + timeSlot.time);
      time = moment(time).format("hh:mm a").toString();
      console.log('AddVolunteer.vue... Formatted timeSlot text:');
      console.log(`${day} at ${time}`);  // returned to put on window
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

    // GetEventTimes: function() {
    //   return [
    //     {
    //       day: "Saturday",
    //       time: "17:00"
    //     },
    //     {
    //       day: "Sunday",
    //       time: "11:15"
    //     }
    //   ]
    // },

    handleReturnToVolunteerList: function() {
      // console.log("in handleReturnToVolunteerList");
      // router.push({ name: '/volunteers', params: { userId: '123' } })
      this.$router.push({ name: 'Volunteers' })
      // this.$emit("updateVolunteerMode", 'List');
    },

    handleSaveNewVolunteer: function(volunteers) {
      // console.log("this.baddates");
      // console.log(this.badDates);
      this.image = this.image.toString();
      console.log('this.image');
      console.log(this.image);
      console.log('this.preferredTime:');
      console.log(this.preferredTime);
      console.log('this.timeSlots');
      console.log(this.timeSlots);
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
      // console.log("new 'this.volunteer':");
      // console.log(this.volunteer);
      this.createVolunteer(this.volunteer);
      this.volunteers.push(this.volunteer);
      this.handleReturnToVolunteerList();
    },

    createVolunteer: function(volunteer) {
      // console.log("in createVolunteer");
      axios.post('/api/volunteers', volunteer)
      .then(response => {
        console.log(response)
      })
      .catch(err => {
        console.log(err)
      });
    },

      getVolunteersAndSchedules() {
        // console.log("In getVolunteersAndSchedules in NewVolunteer");
        axios.get('/api/volunteers')
        .then(response => {

          this.getSchedules();

          // console.log("get volunteers axios done");
          this.volunteers = response.data;
          // this.volunteerNames = this.volunteers.map(volunteer => { 
          //   id: volunteer._id, 
          //   name: volunteer.firstName + " " + volunteer.lastName 
          // }); 
          // console.log("this.volunteers");
          // console.log(this.volunteers);
          this.volunteers.forEach((volunteer, i) => {
            const newVol = {
              id: volunteer._id,
              name: volunteer.firstName + " " + volunteer.lastName
            };
            this.volunteerNames.push(newVol);
            // this.volunteerNames = this.volunteerNames.push(newVol);
            // alphabetize volunteer names
            this.volunteerNames.sort();
          });
          console.log("In AddVolunteer...variables needed");
          console.log("volunteers");
          console.log(this.volunteers);
          console.log("volunteerNames");
          console.log(this.volunteerNames);
        });
      },


      getSchedules() {
        axios.get('/api/schedules')
        .then(res => {
          this.schedules = res.data;
          // console.log("schedules loaded from database.");
          // console.log(response.data);
// this.eventTimes = this.GetEventTimes();
          console.log("schedules");
          console.log(this.schedules);
        })
        .then(response => {
          // Get all role names from schedules, remove dups & alphabetize
          this.schedules.forEach((schedule, index) => {
            
            roles[index] = schedule.roles;
            roles[index] = roles[index].map(role => role.roleName);
            
          });
          console.log('this.roles');
          console.log(this.roles);
          // flatten array, so only one level deep
          this.roles = [].concat.apply([], this.roles);
          // remove duplicates
          this.roles = this.roles.filter((a, b) => this.roles.indexOf(a) === b);
          // sort the array
          this.roles = this.roles.sort();
          console.log("roles");
          console.log(this.roles);
          
          let nth = 0;
          // Get all time slots from schedules
          this.schedules.forEach((schedule, index) => {
            schedule.weeklyEvents.forEach((weeklyEvent, i) => {
              // console.log("forEach schedule... slot, this.timeSlots");
              // console.log(this.timeSlots);
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
              console.log("AddVolunteer.vue... timeSlot after push:");
              console.log(this.timeSlot);
            });

            // remove duplicate day/time combinations
            this.timeSlots = this.timeSlots.filter((timeSlot, index, self) => 
              index === self.findIndex((t) => (
                t.day === timeSlot.day && t.time === timeSlot.time
              ))
            );

            console.log("AddVolunteer.vue... after duplicates removed...  timeSlots");
            console.log(this.timeSlots);
          });
        });


        // deleteVolunteer(volunteer) {
        //   console.log("Delete" + volunteer.firstName);
        // },


      },


// to format date in input box...  ??
// https://codepen.io/eskemojoe007/pen/JBdpqE?editors=0001
    // getString: function(dt_string) {
    //   var weekday=new Array(7);
    //   weekday[1]="Mon";
    //   weekday[2]="Tue";
    //   weekday[3]="Wed";
    //   weekday[4]="Thu";
    //   weekday[5]="Fri";
    //   weekday[6]="Sat";
    //   weekday[0]="Sun";
      
    //   var dt = new Date(dt_string);
    //   const dayWeek = dt.getUTCDay();
      
    //   return `${weekday[dayWeek]}, ${dt.getUTCMonth()}/${dt.getUTCDate()}`;
    // }
  },

  // created() {
  mounted() {
    console.log('this.roles');
    console.log(this.roles);
    this.getVolunteersAndSchedules();

  },

  // updated() {
  //   this.handleReturnToVolunteerList();
  // }

  // See  https://forum.vuejs.org/t/how-to-format-date-for-display/3586/34
  //   on formatting dates from datepicker
  // computed: {
  //   formattedDate: {
  //     get() {
  //       console.log("in get");
  //       console.log(this.badDates);
  //     },
  //     set(valueFromPicker) {
  //       console.log("in set");
  //       console.log(this.badDates);
  //     }

  //   }
  // }

//  see https://stackoverflow.com/questions/44989162/file-upload-in-vuetify
//     pickFile () {
//         this.$refs.image.click ()
//     },
    
//     onFilePicked (e) {
//       const files = e.target.files
//       if(files[0] !== undefined) {
//         this.imageName = files[0].name
//         if(this.imageName.lastIndexOf('.') <= 0) {
//           return
//         }
//         const fr = new FileReader ()
//         fr.readAsDataURL(files[0])
//         fr.addEventListener('load', () => {
//           this.imageUrl = fr.result
//           this.imageFile = files[0] // this is an image file that can be sent to server...
//         })
//       } else {
//         this.imageName = ''
//         this.imageFile = ''
//         this.imageUrl = ''
//       }
//     }
  
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

</style>