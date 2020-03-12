<template>
<div>
    <v-data-table id="sched"
        :headers="headers"
        :items="body"
    ></v-data-table>
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
import jspdf from 'jspdf';
import 'jspdf-autotable';

export default {
    name: 'RunSchedule',
    data: function () {
        return {
            volunteers: [],
            // headers: [
            //     "Date", "Sacristans", "Lectors"
            // ],
            body: [ 
                {
                    date: "3/1/2020, Sunday, 10am",
                    sacristans: "Dorothy",
                    lectors: "Mike"
                },
                {
                    date: "3/1/2020, Sunday, noon",
                    sacristans: "Luci",
                    lectors: "Mark"
                },
                {
                    date: "3/2/2020, Saturday, 5pm",
                    sacristans: "Ric & Marci",
                    lectors: "Christi"
                },
            ],
            // scheduleTable: [
            //     {
            //         date: "Sunday, 03-01-2020, 10am",
            //         sacristans: "Dorothy",
            //         // lectors: ["Mike", "Maura"]
            //         lectors: "Mike & Maura"
            //     },
            //     {
            //         date: "Saturday, 03-02-2020, 5pm",
            //         sacristans: "Luci",
            //         // lectors: ["Colleen", "Kevin"]
            //         lectors: "Colleen & Kevin"
            //     },
            //     {
            //         date: "Sunday, 03-01-2020, noon",
            //         sacristans: "Ric & Marci",
            //         // lectors: ["Mark", "Christi"]
            //         lectors: "Mark & Christi"
            //     }
            // ]
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

            var doc = new jspdf({
                orientation: 'landscape',
                unit: 'in', 
                format: 'letter',
                putOnlyUsedFonts: true,
            });

            //  THIS WORKS!!!
            const pdfHeaders = this.headers.map(function (header) { return header.text });

            var pdfBody = this.body.map(function(obj) {
                return Object.keys(obj).sort().map(function(key) { 
                    return obj[key];
                });
            });

            doc.autoTable({head: [pdfHeaders], body: pdfBody});
            doc.save('scheduler2.pdf');
        },
    },

    computed: {
        schedule() {
            return this.$route.params.schedule;
        },
        
        headers() {
            return [
                { text: 'Date & Time', value: 'date' },
                { text: 'Sacristans', value: 'sacristans'},
                { text: 'Lectors', value: 'lectors'}
            ];
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
