<template>
  <div>
      <v-row>
        
        <!-- enter a name for the new schedule -->
        <v-col cols="6" offset="3" class="text-input-center newSched">
            <v-card class="inputCard ">
                <v-card-text class="p-10 m-10 inputCard">
                    <v-form>
                        <v-text-field label="Name of New Schedule" class="py-0" v-model="schedName" autofocus>
                        </v-text-field>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-col>
        </v-row>
 
        <!-- header to tell user what to do -->
        <h2 >
            <span class="title mr-3">
              Choose the date range for the new schedule and click on the Save icon.
            </span>
        </h2>

    <v-row>
        <!-- date pickers to choose start and end dates for the new schedule -->
        <v-col cols="4" offset="2">
       
            <h4>Choose a start date</h4>
            <v-date-picker 
                v-model="startDate"
                color="teal"
                width="100%"
            ></v-date-picker>
        </v-col>

        <v-col cols="4">
            <h4>Choose an end date</h4>
            <v-date-picker 
                v-model="endDate"
                color="teal"
                width="100%"
            ></v-date-picker>
        </v-col>

        <!-- save button -->
        <v-col cols="2">
            <v-btn 
                class="mr-0 ml-3" 
                fab dark small 
                color="teal"
                @click="schedules = saveSchedDates(startDate, endDate, schedules, scheduleIndex, schedMode, schedName)"
            >
                <v-icon dark>mdi-content-save-outline</v-icon>
            </v-btn>
        </v-col>
    
    </v-row>

    <!-- place for error message -->
    <v-row>
        <v-col>
            <p class="text-xs-center msg">{{ errorMessage }}</p>
        </v-col>

    </v-row>
  </div>
</template>


<script>
import axios from 'axios'

export default {
    name: "GetSchedDates",
    props: ["schedules", "scheduleIndex", "flags", "schedMode"],
    data () {
        return {
            startDate: '',
            endDate: '',
            errorMessage: '',
            schedName: ''
        }
    },

    methods: {

        // sets up variables and saves the dates for the schedule in the db
        saveSchedDates: function(startDate, endDate, schedules, scheduleIndex, schedMode, schedName) {

            // error checking - are both a beginning and ending date entered
            if (startDate === '' | endDate === '') {
                this.errorMessage = "Please choose a start and an end date.";
                 return schedules;

            // error checking - is the beginning date before the end date
            } else if (endDate < startDate) {
                this.errorMessage = "Start date must be before end date.";
                return schedules;

            // build schedule object from data input    
            } else {
                const schedule = {
                    startDate: startDate,
                    endDate: endDate,
                    version: 0,
                    roles: [],
                    weeklyEvents: [],
                    name: schedName
                };
                // insert the schedule if it's new
                if (schedMode === 'Add') {
                    schedules.push(schedule);
                    this.insertSchedule(schedule);

                } else {
                    alert("need to code changing dates in existing schedule.")
                    // change dates for existing schedule
                    // update schedule in database
                }

                // clear error message and error flags 
                this.errorMessage = '';
                this.flags.haveSchedDates = true;

                // return new schedules to display
                return schedules;
            };
        },
            
        //  makes the axios call to insert the schedule in the database
        insertSchedule(schedule) {
            axios.post(`/api/schedules`, schedule )
            .then(response => {
                console.log(response.data);
            })
            .catch(err => {
                console.log("Error in GetSchedDates inserting new Schedule.");
                throw err;
            });
        },
    }
}
</script>


<style scoped>

    /* make the error message obvious */
    .msg {
        color: red;
        font-size: 2em;
        font-weight: bold;
    }

    /* tweak the color and spacing */
    h4 {
        color: teal;
    }

    .title {
        color:blue;
        text-decoration-line: none;
        font-size: 3em;
        padding: 20px 0 0;
    }

    .newSched {
        width: 50%;
        font-size: 20px;
        text-align: center;
    }
</style>