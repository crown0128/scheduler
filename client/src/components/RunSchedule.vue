<template>
<div>
    <button @click="exportPdf">
        export exportPdf   
    </button>
    <h1>Schedule is running</h1>
    <p> {{ schedule._id }} </p>
    <template v-if="volunteers">
        <p> {{ volunteers[0].firstName }} </p>
    </template>
</div>
</template>

<script>
import moment from 'moment';
import axios from 'axios';
import jsPDF from 'jspdf';

export default {
    name: 'RunSchedule',
    data: function () {
        return {
            volunteers: []
        };
    },

    methods: {
        getDates() {

            // these will be passed in
            const begin = "2020-02-28";
            const end = "2020-06-01";
            const days = [0, 3]; // Sundays & Wednesdays

            // eventDates (will be returned) is a nested array.
            // There is one element in the highest level for each day of the week.
            // Each of those elements has an array of valid dates in the range for that day of the week
            // i.e. if we have events on Wed & Thurs from 3/1/2020 to 3/15/2020, we'll get:
            //  [ ["3/4", "3/11"] ["3/5", "3/12"] ] (3/4 & 3/11 are Wednesdays); format will be moment() format.
            let eventDates = [];

            days.forEach(day => {
                // dates are the array of dates in the range that have events on the given day of the week
                let dates = [];

                // find the day of the week we're looking for in the week of the beginning of the schedule.
                let dayNeeded = moment(begin).startOf('week').add(day, 'days');

                // find how many days the start of the week is from the day of the week we need.
                //   if it is negative, we're before the beginning of the schedule.
                let diff = moment(dayNeeded).diff(moment(begin), 'days');

                // if the day of the week is before the beginning date, add a week.
                if (diff < 0) {
                    dayNeeded = moment(dayNeeded).add(7, 'days').format("YYYY-MM-DD");
                };

                // continue looping until past the end date
                while ((moment(end).diff(moment(dayNeeded))) >= 0) {

                    // add a date needed to the array
                    dates.push(dayNeeded);

                    // look at the same day of the week the following week.
                    dayNeeded = moment(dayNeeded).add(7, 'days');
                };

                eventDates.push(dates);

            });

            return eventDates;
        }, // end of getDates

        getVolunteers() {
            console.log("In getVolunteers");
            axios.get('/api/volunteers')
                .then(response => {
                    console.log("get volunteers axios done");
                    this.volunteers = response.data;
                    // this.volunteerNames = this.volunteers.map(volunteer => { 
                    //   id: volunteer._id, 
                    //   name: volunteer.firstName + " " + volunteer.lastName 
                    // }); 
                    console.log("this.volunteers");
                    console.log(this.volunteers);
                    this.volunteers.forEach((volunteer, i) => {

                        const newVol = {
                            id: volunteer._id,
                            name: volunteer.firstName + " " + volunteer.lastName
                        };

                        this.volunteerNames.push(newVol);

                    })
                });
        },

        exportPdf() {
            const vm = this;
            // var doc = new jsPDF('p', 'pt');
            var doc = new jsPDF({
                orientation: 'landscape',
                unit: 'in',  // inches
                format: [11, 8.5] // 8.5 x 11 size
            });
            doc.text("here's your empty schedule!", 20, 20);
            doc.save('schedulerfile.pdf');
        },
    },

    computed: {
        schedule() {
            return this.$route.params.schedule;
        }
    },

    created() {
        this.getVolunteers();
        //   this.GetDates();
    }
}
</script>

<style scoped>

</style>
