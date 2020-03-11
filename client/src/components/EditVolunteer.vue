<template>
<v-app class="bg-lightteal">
<!-- ********* does this go in Volunteer when edit is clicked ?? ***** -->
  <v-container cols="12" text-center align="center" justify="center" class="pt-0">
    <!-- volunteer #{{ $route.params.id }}. -->
    <v-row>
      <v-col cols="8" offset="2">
          <h1>{{ volunteerMode }} a volunteer</h1>
      </v-col>

      <v-col cols="2">
        <!-- save button and back button -->
        <!-- <v-btn class="mx-1 my-1" @click="xxxxxxxxx" fab right dark x-small color="teal"> -->
        <v-btn class="mx-1 my-1" fab right dark x-small color="teal">
          <v-icon dark @click="handleSaveNewVolunteer(volunteers, volunteerIndex);"> mdi-content-save-outline</v-icon>
        </v-btn>
        <v-btn class="mx-1 my-1" @click="handleReturnToVolunteerList();" fab right dark x-small color="teal">
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
              <v-form>
                <v-file-input 
                  label="Choose avatar image." 
                  v-model="image"
                  accept="/public/images"
                ></v-file-input>
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
        <v-checkbox class="ml-2 my-0 list-height"
          v-for="(role, roleIndex) in roles"
          v-bind:key="roleIndex"
          v-model="rolesChosen"
          :value="`${role}`"
          :label="`${role}`"
          color="teal"
        ></v-checkbox>
        <p>{{ rolesChosen }}</p>

      </v-col>

      <v-col cols="6" class="white">
        <p class="text-left">Choose a preferred time slot (pick one in the next schedule to be run):</p>
        <v-radio-group class="ml-2"
          v-model="preferredTime"
        ><v-radio
            class = "my-0 list-height"
            v-for="timeSlot in timeSlots"
            v-bind:key="timeSlot.index"
            :label="`${timeSlot.day} at ${timeSlot.time} in schedule: ${timeSlot.scheduleName}`"
            :value="`${timeSlot.index}`"
          ></v-radio>
        </v-radio-group>

        <p>{{ preferredTime }}</p>
      </v-col>

    </v-row>

    <v-row>
        <!-- choose availability -->
      <v-col cols="12">
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
    </v-row>

    <v-row>
        <!-- choose who to schedule with (or not) -->
 
                   <!-- choose roles & preferred times -->
      <v-col cols="6" class="white">
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

      <v-col cols="6" class="white">
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

      </v-col>
    </v-row>

    <!-- volunteers[ {{ $route.params.id }} ].firstName  -->
</v-container>
  </v-app>


</template>



<script>
import axios from 'axios';

export default {
  name: "EditVolunteer",
  // props: ["volunteers", "volunteerIndex", "volunteerMode", "schedules", "roles", "timeSlots", "volunteerNames", "edittingVolunteer"],
  props: ["volunteers", "volunteerIndex", "volunteerMode", "schedules", "roles", "timeSlots", "volunteerNames"],
  data: function() {
    return {

      volunteer: {},
      firstName: "",
      lastName: "",
      email: "",
      image: "",


      date: null,
      menu2: false,
      // datesAll: [],
      badDates: [],
      showNotAvailablePicker: false,

      eventTimes: [],
      rolesChosen: [],
      preferredTime: "",
      schedWith: [],
      notWith: []

      // title: "Image Upload",
      // dialog: false,
      // imageName: '',
      // imageUrl: '',
      // imageFile: ''
    }
  },


  methods: {
    // importImage() {
      
    //   if (!this.image) {this.image = "No File Chosen"}
    //   else {
    //     const reader = new FileReader();
        
    //     // Use the javascript reader object to load the contents
    //     // of the file in the v-model prop
    //     reader.readAsText(this.chosenFile);
    //     reader.onload = () => {
    //       this.data = reader.result;
    //     }
    //   };
    // }, 

    today: function() {
      const t = new Date().toJSON().slice(0,10);
      return t;
    },

    save: function (date) {
      var index = this.badDates.findIndex(x => x===date)

      if (index === -1){
          this.badDates.push(date);
      }
      else {
        this.badDates.splice(index,1);
      }
    },

    GetEventTimes: function() {
      return [
        {
          day: "Saturday",
          time: "17:00"
        },
        {
          day: "Sunday",
          time: "11:15"
        }
      ]
    },

    handleReturnToVolunteerList: function() {
      console.log("in updateEdittingVolunteer");
      this.$emit("updateEdittingVolunteer", false);
    },

    handleSaveNewVolunteer: function(volunteers, volunteerIndex) {
      console.log("In handleSaveNewVolunteer");
      console.log("firstName: ");
      console.log(this.firstName);
      console.log("lastName: ");
      console.log(this.lastName);
      console.log("email: ");
      console.log(this.email);
      console.log("image: ");
      console.log(this.image);
      console.log("rolesChosen: ");
      console.log(this.rolesChosen);
      console.log("preferredTime: ");
      console.log(this.preferredTime);
      console.log("timeslots");
      console.log(this.timeSlots);
      
      console.log("badDates:");
      console.log(this.badDates);
      console.log("schedWith:");
      console.log(this.schedWith);
      console.log("notWith:");
      console.log(this.notWith);
      console.log("volunteers");
      console.log(volunteers);
      console.log(volunteerIndex);
      this.volunteer = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        image: this.image.name,
        roles: this.rolesChosen,
        prefTimes: {
          day: this.timeSlots[this.preferredTime].day,
          time: this.timeSlots[this.preferredTime].time,
          percentPreferred: 100

        },
        notAvailable: this.badDates,
        with: this.schedWith,
        notWith: this.notWith
      };
      console.log("new volunteer");
      console.log(this.volunteer);
      this.createVolunteer(this.volunteer);
      this.handleReturnToVolunteerList();
    },

    createVolunteer: function(volunteer) {
      console.log("in createVolunteer");
      axios.post('/api/volunteers', volunteer)
      .then(response => {
        console.log(response)
      })
      .catch(err => {
        console.log(err)
      });
    }

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
    console.log("mounted");
    console.log("volunteerIndex");
    console.log(this.volunteerIndex);
    console.log("volunteers");
    console.log(this.volunteers);
    console.log("schedules");
    console.log(this.schedules);
    // push when save new volunteer, otherwise
    //  might have added a blank volunteer that never gets saved.
    // if (this.volunteerIndex === -1) {
    //   this.volunteers = this.volunteers.push([]);
    //   this.volunteerIndex = this.volunteers.length;
    // };
    this.eventTimes = this.GetEventTimes();
  }

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

</style>