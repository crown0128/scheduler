<template>
<div>
    <h2>New schedule <span class="redtext">{{ notMsg }}</span> created</h2>
    <h3 class="redtext"> {{ errorMessage }} </h3>
    <div v-if="noErrors">
        <button @click="exportPdf(slate)" class="redtext">
            Click <u>here</u> to create a PDF.
        </button>
        <p>The name of the file will be <span class="redtext">{{ this.filename }}</span> and it will be created in your Downloads folder.</p>
        <v-data-table 
            id="sched" 
            :headers="headers" 
            :items="slate"
        ></v-data-table>
    </div>
    <!-- for testing... -->
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
            filename: "",
            errorMessage: "",
            notMsg: "",
            noErrors: true,
            dates: [],
            slate: []
        };
    },

    methods: {
        getDates() {

            // ***********************  sort weekly events here, to get final slate sorted??  Or sort final slate? ***************
            
            // get beginning and end dates of the schedule range
            const begin = moment(this.schedule.startDate).format("YYYY-MM-DD");
            const end = moment(this.schedule.endDate).format("YYYY-MM-DD");

            // get the days of the week (in words) for each recurring event
            const daysWord = this.schedule.weeklyEvents.map(weeklyEvent => {
                return weeklyEvent.day;
            });

            // days will hold the days of the week for each recurring event as numbers;
            //   0: Sunday ... 6: Saturday
            let days = [];
            daysWord.forEach(dayW => {
                switch (dayW) {
                    case "Sunday":
                        days.push(0);
                        break;
                    case "Monday":
                        days.push(1);
                        break;
                    case "Tuesday":
                        days.push(2);
                        break;
                    case "Wednesday":
                        days.push(3);
                        break;
                    case "Thursday":
                        days.push(4);
                        break;
                    case "Friday":
                        days.push(5);
                        break;
                    case "Saturday":
                        days.push(6);
                        break;
                };
            });

            // eventDates (will be returned) is a nested array.
            // There is one element in the highest level for each recurring event.
            // Each of those elements has an array of valid dates in the range for that day of the week
            // i.e. if we have events on Wed & Thurs from 3/1/2020 to 3/15/2020, we'll get:
            //  [ ["3/4", "3/11"] ["3/5", "3/12"] ] (3/4 & 3/11 are Wednesdays); format will be yyyy-mm-dd format.
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
                    dayNeeded = moment(dayNeeded).add(7, 'days');
                };

                // continue looping, pushing dates in the schedule, until past the end date
                while ((moment(end).diff(moment(dayNeeded))) >= 0) {

                    // add a date needed to the array
                    dates.push(moment(dayNeeded).format("YYYY-MM-DD").toString());

                    // look at the same day of the week the following week.
                    dayNeeded = moment(dayNeeded).add(7, 'days');
                };

                // push the array for this recurring event onto the array to be returned
                eventDates.push(dates);
            });

            // return dates needed for each recurring event.
            return eventDates;
        }, // end of getDates


        // Get the volunteers from the database, create and fill slates,
        //  slates is an array of objects, where each object is the schedule 
        // with volunteer assignments for one specific event on a given date and time.
        getVolunteersAndFillSlate() {

            axios.get('/api/volunteers')
                .then(response => {
                    this.volunteers = response.data;

                    // create a new filename each time the schedule is run
                    this.filename = this.schedule.name + "-" + this.schedule.version + ".pdf";

                    // assign volunteers to specific times, dates and jobs (roles)
                    this.slate = this.fillSlate();

                });
        },

        fillSlate() {

            // get actual dates needed.
            // dates is nested.  There is one array for each recurring weekly event.
            // In each of those arrays are the specific dates the events are to be held.
            this.dates = this.getDates();

            // Need estimate for ...
            //    maximum times each volunteer will serve per role (per weekly event) (maxTimesServedPerRole),
            //        maxTimesServedPerRole
            //    and max gap between roles (i.e. 2 for every other day) (maxRepeatPerRole).
            //        maxRepeatPerRole
            //     maxTimesServedPerRole and maxRepeatPerRole are both arrays, one number for each role, and
            //        will be in the same order as roleNames in roles
            // These are used to distribute the volunteer assignments evenly over time, 
            //   and assign the volunteers about the same number of times

            // get number of weekly events (may not be the same for each weekly event,
            //   if, for example, the start & end dates don't include full weeks)
            let weeks = [];
            this.dates.forEach(date => {
                weeks.push(date.length);
            }); // end of forEach date in dates

            // get the roles needed, and
            // the number of volunteers needed for each role (slots)
            let roles = [];
            let slots = [];
            this.schedule.roles.forEach(role => {
                roles.push(role.roleName);
                slots.push(role.numberNeeded);
            }); // end of forEach role in the schedule

            let workingSlate = [];
            // set up empty slate with dates & properties
            workingSlate = this.buildSkeleton(this.dates, roles, this.schedule.weeklyEvents);

            // do schedule for each weekly event separately
            this.schedule.weeklyEvents.forEach((weeklyEvent, we) => {
                console.log('\n ************ ');
                console.log("START working on weekly event: " + we);
                console.log("weekly event:");
                console.log(weeklyEvent);

                // initialize the number of volunteers available for each role
                // this gets re-created for each weekly event
                let numberVolunteers = [];

                // number of slots to be filled for a specific role for one recurring weekly event
                //   for the whole schedule (i.e. how many ushers needed Sat 5pm for all dates)
                let totalSlotsPerRole = [];
                // get the number of volunteers available for each role
                // (OK to ignore dates not available - it's an estimate to help
                //    distribute volunteers evenly over the schedule)

                // number of slots filled for each role for this weekly event
                let slotsFilled = []; // No slots filled for this role in this recurring event, yet

                roles.forEach((role, r) => {

                    slotsFilled.push(0); // No slots filled for this role in this recurring event, yet
                    numberVolunteers.push(0); // add an element for this role.
                    totalSlotsPerRole.push(0); // add an element for this role.

                    this.volunteers.forEach(volunteer => {

                        // if volunteer wants this event time (role, day and time match)
                        if (
                            (volunteer.roles.includes(role)) &&
                            (volunteer.prefTimes[0].day === weeklyEvent.day) &&
                            (volunteer.prefTimes[0].time === weeklyEvent.time)
                        ) {
                            numberVolunteers[r]++
                        };

                    }); // end of for each volunteer in volunteers

                    totalSlotsPerRole[r] = (slots[r] * weeks[we]);

                }); // end of for each role in roles

                //  Need to calculate maxTimesServedPerRole and maxRepeatPerRole
                let maxTimesServedPerRole = [];
                let maxRepeatPerRole = [];

                // if there are more slots / week to be filled than there are volunteers, show error message;
                //   don't run schedule.  noErrors is flag to avoid displaying slate
                slots.forEach((slot, s) => {
                    maxTimesServedPerRole.push((weeks[we] * slots[s]) / numberVolunteers[s]);
                    if (maxTimesServedPerRole[s] > weeks[we]) {
                        this.errorMessage = "There are not enough volunteers to complete a schedule.  New schedule not created.";
                        this.notMsg = "not ";
                        this.noErrors = false;
                    } else {
                        this.errorMessage = "";
                        this.notMsg = "";
                        this.noErrors = true;
                    }; // end of if more slots need to be filled per week than volunteers available.

                    // calculate the estimated 
                    //    maxTimesServedPerRole: 
                    //       (# events x slots)/# volunteers, rounded up 
                    //          (round after next step)
                    //    and maxRepeatPerRole: 
                    //       # events / maxTimesServed (before rounding) rounded up
                    maxRepeatPerRole.push(Math.ceil(weeks[we] / maxTimesServedPerRole[s]));
                    maxTimesServedPerRole[s] = (Math.ceil(maxTimesServedPerRole[s]));

                }); // end of for each slot in slots

                // start filling in slate!!

                // for each weekly event (still in that loop)

                // gather volunteers in this weekly event
                const volsInWeeklyEvent = this.volunteers.filter(volunteer =>
                    ((volunteer.prefTimes[0].day === weeklyEvent.day) &&
                        (volunteer.prefTimes[0].time === weeklyEvent.time)
                    )
                );

                // put each volunteer in the schedule max times 
                //     (may be more, later, if dates not available makes other serve more often )
                volsInWeeklyEvent.forEach(volunteer => {
                    console.log(">>>>>>>>>>>   " + volunteer.firstName);

                    // r is the index for the role of the current volunteer
                    //   note:  roles is an array for a future release when a volunteer can have 
                    //          more than one possible role
                    // if r is -1, we don't need the role of this volunteer in this schedule, skip the volunteer
                    const r = roles.indexOf(volunteer.roles[0]);
                    console.log("Skip to next volunteer if role not found...  r= " + r + " role: " + roles[r]);
                    if (!(r === -1)) {
                        console.log("Finding dates for " + volunteer.firstName + " as " + roles[r]);
                        // this volunteer is scheduled 0 times so far
                        let timesServed = 0;
                        // keep track of dates checked for this volunteer in this weeklyevent
                        let datesChecked = [];
                        // when numberDates = datesChecked.length, we've checked them all
                        const numberDates = weeks[we];
                        // start with first date in weeklyevents  

                        let currDate = this.dates[we][0];
                        console.log("|| Should be first date of weekly events; currDate:  " + currDate);

                        // Reminder, totalSlotsPerRole is how many needed for this recurring event 
                        //    i.e. number of "ushers" needed at this weekly recurring event over the whole schedule

                        // repeat below until scheduled maxTimesServedPerRole, all roles filled, 
                        //    or all dates checked for this volunteer

                        // do for multiple dates!
                        // continue if ....haven't met max times served,
                        //              && not all dates checked
                        //              && not all the slots for this role have been filled.
                        //              && currDate not = 0 () means no more possible dates found.
                        console.log("this.dates");
                        console.log(this.dates);
                        console.log("============");
                        console.log("\nDo loop if timesServed < maxTimesServedPerRole[r]");
                        console.log("timesServed: " + timesServed + ";  maxTimesServedPerRole[r]: " + maxTimesServedPerRole[r]);
                        console.log("&& datesChecked.length <= numberDates");
                        console.log("datesChecked.length" + datesChecked.length + ";  " + "numberDates: " + numberDates);
                        console.log("&& slotsFilled[r] < totalSlotsPerRole[r]");
                        console.log("slotsFilled[r]: " + slotsFilled[r] + ";  totalSlotsPerRole[r]: " + totalSlotsPerRole[r]);
                        console.log("        start while      ");
                    
                        while ( (timesServed < maxTimesServedPerRole[r])
                            && (datesChecked.length <= numberDates)
                            && (slotsFilled[r] < totalSlotsPerRole[r]) 
                            && (currDate != 0) ) {
                            console.log("============");
                            console.log("in while loop");
                            console.log("\nDo loop if timesServed < maxTimesServedPerRole[r]");
                            console.log("timesServed: " + timesServed + ";  maxTimesServedPerRole[r]: " + maxTimesServedPerRole[r]);
                            console.log("&& datesChecked.length <= numberDates");
                            console.log("datesChecked.length" + datesChecked.length + ";  " + "numberDates: " + numberDates);
                            console.log("&& slotsFilled[r] < totalSlotsPerRole[r]");
                            console.log("slotsFilled[r]: " + slotsFilled[r] + ";  totalSlotsPerRole[r]: " + totalSlotsPerRole[r]);
                            console.log("||   && currdate != 0: " + currDate);

                            console.log("datesChecked:");
                            console.log(datesChecked);
                            console.log("============");


                            // do this now, before it gets changed to a new date
                            datesChecked.push(currDate);
                            console.log("BADDATES to GoodDate... (volunteer.notAvailable):  ");
                            console.log(volunteer.notAvailable);
                            console.log("volunteer (just in case)");
                            console.log(volunteer);
                            if (this.goodDate(volunteer.notAvailable, currDate, volunteer.firstName)) {
                                console.log("||  did goodDate change currdate? " + currDate);
                                console.log("goodDate true, call scheduleVolunteer");
                                this.scheduleVolunteer(volunteer, r, roles, currDate, this.schedule.weeklyEvents[we].time, workingSlate);
                                console.log("||  did scheduleVolunteer change currdate? " + currDate);

                                timesServed++;
                                console.log("incremented timesServed to: " + timesServed);
                                slotsFilled[r]++;
                                console.log("incremented slotsFIlled for " + roles[r] + " to " + slotsFilled[r]);
                                console.log("slotsFilled:");
                                console.log(slotsFilled);
                                // increment date by maxRepeat.. if this was a good date.
                                currDate = this.pickNewDate(currDate, maxRepeatPerRole[r], datesChecked, this.dates[we][0]);
                                console.log("||  new currDate:  " + currDate);
                            } else {
                                // // console.log("goodDate false");
                                // increment date by one if this was a bad date
                                currDate = this.pickNewDate(currDate, 1);
                                console.log("||  new currDate:  " + currDate);
                            };
                            if (currDate === 0) { 
                                datedChecked = dates[we];
                                return;
                            };

                            console.log("============");
                            console.log("bottom of while loop...going through dates for one volunteer");
                            console.log("============");
                            console.log("\nDo loop if timesServed < maxTimesServedPerRole[r]");
                            console.log("timesServed: " + timesServed + ";  maxTimesServedPerRole[r]: " + maxTimesServedPerRole[r]);
                            console.log("&& datesChecked.length <= numberDates");
                            console.log("datesChecked.length" + datesChecked.length + ";  " + "numberDates: " + numberDates);
                            console.log("&& slotsFilled[r] < totalSlotsPerRole[r]");
                            console.log("slotsFilled[r]: " + slotsFilled[r] + ";  totalSlotsPerRole[r]: " + totalSlotsPerRole[r]);
                            console.log("&& currdate != 0: " + currDate);
                        }; // end of while loop to fill slots with this volunteer

                        console.log("bottom of if volunteer's role needed for this schedule");
                    }; // end of if volunteer's role needed.

                    console.log("bottom of for each volunteer...on to the next!");
                }); // of for each volunteer in volsInWeeklyEvent

                console.log("one weekly schedule done...on to the next!");
            }); // of for each weekly event in weeklyEvents (we is index)
            return workingSlate;
        }, // end of fillSlate method


        buildSkeleton(dates, roles, weeklyEvents) {

            function NewObject(date, time) {
                this.date = date;
                this.time = time;
            }

            let localSlate = [];

            // for each weekly event
            dates.forEach((weeklyEventDates, we) => {

                weeklyEventDates.forEach((date, d) => {

                    //    for each specific date (index d)
                    //    build an object (which will be a row in the displayed/PDF localSlate)
                    //    only date (time & day) is known, so far
                    
                    const newDate = moment(date).format("YYYY-MM-DD").toString();
                    const newTime = weeklyEvents[we].time;
                    let thisObject = new NewObject(newDate, newTime);

                    // remaining properties are the roles
                    roles.forEach(role => {
                        thisObject[role] = [];
                    });

                    // push the schedule for this one specific event onto the slate
                    localSlate.push(thisObject);

                });

            });

            // if time (or future release) sort into date/time order before returning
            // localSlate = this.sortSlate(localSlate);

            return localSlate;
        },


        // If time, or future release...
        // sortSlate(slate) {
        //     slate.forEach( date => {
        //         date.time = moment(date.time);
        //         date.day = moment(date.day);
        //     });

        //     slate.sort();

        //     slate.forEach( date => {
        //         date.time = moment(date.time).format("YYYY-MM-DD").toString();
        //         date.day = moment(date.day).format("hh:mm").toString();
        //     });

        //     return slate;
            
        // },

        goodDate(badDates, date, name) {
            console.log("In goodDate")
            console.log("  passed in:  date:  " + date + "; name: " + name);
            console.log("  and badDates:");
            console.log(badDates);
            console.log("date as is: " + date);
            console.log("date in English: " + moment(date).format("YYYY-MM-DD").toString());
            date = moment(date).format("YYYY-MM-DD").toString();
            console.log("date with some moments: " + date);
            console.log("xxxxxxxxxxxxxx");
            console.log("Each date in badDates for: " + name);
            // convert dates in badDates to same format as date
            // add 7 hours to avoid time zones changing the date
            badDates = badDates.map(badDate => 
                moment(badDate).add(7, 'hours').format("YYYY-MM-DD").toString());
            console.log(badDates);
            
            console.log("xxxxxxxxxxxxxx");
            // compare same datatypes to get valid results
            // date = moment(date);

            console.log("look here");
            console.log("date: " + date);
            console.log("startDate: " + this.schedule.startDate);
            console.log("endDate: " + this.schedule.endDate);
            // date is bad if it's before the beginning of the schedule
            if (date < this.schedule.startDate) { return false };

            // date is bad if it's past the end of the schedule
            if (date > this.schedule.endDate) {return false };

            // put the startDate and endDate back in expected formats
            moment(this.schedule.startDate).format("YYYY-MM-DD").toString();
            moment(this.schedule.endDate).format("YYYY-MM-DD").toString();
            console.log("startDate: " + this.schedule.startDate);
            console.log("endDate: " + this.schedule.endDate);

            console.log("Just before 'includes'...  date:  " + date);
            console.log(badDates);
            console.log("!badDates.includes(date)");
            console.log(!badDates.includes(date));

            // date is good if it is NOT in the list of unavailable dates (badDates)
            // (and not already returned a false if out of range)
            return !badDates.includes(date);
        },


        pickNewDate(date, increment, datesChecked, firstDate) {

            // new date should be a multiple of a week later,
            //   to get that many weekly occuring events later.
            date = moment(date).add(increment, 'weeks');

            // all dates (date, endDate, startDate) should be in moment format
            let end = moment(this.schedule.endDate);
            let start = moment(this.schedule.startDate);
            firstDate = moment(firstDate);  // this will be the right day of the week

            // if this is past the end of the schedule,
            //  wrap around to the beginning , and then increment
            //  one week at a time until you find a date that hasn't been
            //  checked, or all the dates have been checked.
            if (date > end) {
                date = firstDate;
            
                while (datesChecked.includes(date)) {
                    date = moment(date).add(1, 'weeks');
                    if (date > moment(end)) {
                        return 0;  // no available dates found
                    };
                };
            };

            // reformat start and end dates
            this.schedule.startDate = moment(this.schedule.startDate).format("YYYY-MM-DD").toString();
            this.schedule.endDate = moment(this.schedule.endDate).format("YYYY-MM-DD").toString();
            return moment(date).format("YYYY-MM-DD").toString();
        },

        scheduleVolunteer(volunteer, r, roles, date, time, workingSlate) {
            // assign volunteer a spot (put in slate)

            console.log(">>> UPDATING SLATE: name:  " + volunteer.firstName + " as " + roles[r] + " on " + date);
            // where to update the assignment in the array (which object)
            const timeDateIndex = workingSlate.findIndex(timeDate => 
                timeDate.date === date && timeDate.time === time
            );
            console.log("date in English:  " + moment(date).format("YYYY-MM-DD").toString());
            // get volunteer name
            const volunteerName = volunteer.firstName.concat(" ", volunteer.lastName);

            // push the assignment.
            workingSlate[timeDateIndex][roles[r]].push(volunteerName);
        },

        exportPdf(slate) {

            // create jspdf instance
            var doc = new jspdf({
                orientation: 'landscape',            // this.slate = workingSlate;
                format: 'letter',
                putOnlyUsedFonts: true,
            });

            //  Set headers
            const pdfHeaders = [this.headers.map(function (header) {
                return header.text
            })];

            // get slate in format for pdf body
            const pdfBody = this.slate.map(function (obj) {
                return Object.keys(obj).map(function (key) {
                    return obj[key];
                });
            });

            // This goes on the tab when the PDF opens
            doc.setProperties({
                title: this.schedule.name
            });

            // Write the title to the PDF
            doc.text(10, 10, this.schedule.name);

            // Write the table to the PDF
            doc.autoTable({
                head: pdfHeaders,
                body: pdfBody
            });

            // Save the PDF
            doc.save(this.filename);
        },
    },

    computed: {
        schedule() {
            return this.$route.params.schedule;
        },

        headers() {
            return [{
                    text: 'Date',
                    value: 'date'
                },
                {
                    text: 'Time',
                    value: 'time'
                },
                {
                    text: 'Sacristans',
                    value: 'Sacristan'
                },
                {
                    text: 'Lectors',
                    value: 'Lector'
                },
                {
                    text: 'Eucharistic ministers',
                    value: 'Eucharistic minister'
                },
                {
                    text: 'Altar servers',
                    value: 'Altar server'
                },
                {
                    text: 'Ushers',
                    value: 'Usher'
                }
            ];
        }
    },

    created() {
        // get the volunteers & related info from the database,
        //  and fill the slate to display on the page
        this.getVolunteersAndFillSlate();
    }
}
</script>

<style scoped>

 /* for error messages */
.redtext {
    color: red;
    text-emphasis: bold;
}
</style>
