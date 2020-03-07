<template>
  <div>

        <h2 >

            <span class="title mr-3">
              Choose the date range for the new schedule and click on the Save icon.
            </span>

        </h2>

    <v-row>

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

        <v-col cols="2">
            <v-btn 
                class="mr-0 ml-3" 
                fab dark small 
                color="teal"
                @click="schedules = saveSchedDates(startDate, endDate, schedules, scheduleIndex)"
            >
                <v-icon dark>mdi-content-save-outline</v-icon>
            </v-btn>
        </v-col>
    
    </v-row>

    <v-row>
        <v-col>
            <p class="text-xs-center msg">{{ message }}</p>
        </v-col>

    </v-row>
  </div>
</template>


<script>
import axios from 'axios'

export default {
    name: "GetSchedDates",
    props: ["schedules", "scheduleIndex", "flags"],
    data () {
        return {
            startDate: '',
            endDate: '',
            message: ''
        }
    },

    methods: {
        saveSchedDates: function(startDate, endDate, schedules, scheduleIndex) {
            if (startDate === '' | endDate === '') {
                this.message = "Please choose a start and an end date.";
                 return schedules;
            } else if (endDate < startDate) {
                this.message = "Start date must be before end date.";
                return schedules;
            } else {
                const schedule = {
                    startDate: startDate,
                    endDate: endDate,
                    version: 0,
                    roles: [],
                    weeklyEvents: [],
                    name: Date.now()
                };
                schedules.push(schedule);
                this.message = '';
                this.flags.haveSchedDates = true;
                this.insertSchedule(schedule);
                return schedules;
            };
        },
            
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

        // datesFilledOK: function () {
        //     if ( startDate === '' | endDate === '') {
        //         this.message = "Please choose a start and an end date.";
        //         console.log("Not ok");
        //         return false;
        //     };
        //     if (endDate < startDate) {
        //         this.message = "Start date must be before end date.";
        //         return false;
        //         console.log("Not ok");
        //     };
        //         console.log("Ok");
        //     return true;
        // }
    }
}
</script>


<style scoped>
    .msg {
        color: red;
        font-size: 2em;
        font-weight: bold;
    }

    h4 {
        color: teal;
    }

    .title {
        color:blue;
        text-decoration-line: none;
        font-size: 3em;
        padding: 20px 0 0;
    }
</style>