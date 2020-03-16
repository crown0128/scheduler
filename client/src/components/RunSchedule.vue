<template>
<!-- header with schedule name, error message (if any), and button to create a PDF file -->
<div>
    <h2><span class="schedName">{{ schedule.name }}</span> <span class="redtext">{{ notMsg }}</span></h2>
    <h3 class="redtext"> {{ errorMessage }} </h3>
    <div v-if="noErrors">
        <button @click="exportPdf(slate)" class="redtext">
            Click <u>here</u> to create a PDF.
        </button>
        <p>The name of the file will be <span class="redtext">{{ this.filename }}</span> and it will be created in your Downloads folder.</p>
        <!-- show the actual slate of volunteer assignments -->
        <v-data-table 
            id="sched" 
            :headers="headers" 
            :items="slate"
        ></v-data-table>
    </div>
</div>
</template>

<script>
import moment from 'moment';  // for date formatting and functions
import axios from 'axios';    // communication between the client and server
import jspdf from 'jspdf';    // creating a PDF file from an html table
import 'jspdf-autotable';     // add on in jspdf needed

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
            slate: [],
            headers: []
        };
    },

    methods: {

        // Get the actual calendar dates each event will be held on
        getDates() {
         
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

                    // create a filename 
                    this.filename = this.schedule.name + ".pdf";

                    // assign volunteers to specific times, dates and jobs (roles)
                    this.slate = this.fillSlate();

                    // clean up slate (format time, date; spaces between volunteers)
                    this.slate = this.cleanUpSlate();

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
            // the number of volunteers needed for each role (volsNeeded)
            let roles = [];
            let volsNeeded = [];
            this.schedule.roles.forEach(role => {
                roles.push(role.roleName);
                volsNeeded.push(role.numberNeeded);
            }); // end of forEach role in the schedule

            // now that I have the roles, I can create the headers for the table
            this.headers = this.createHeaders(roles);

            let workingSlate = [];
            // set up empty slate with dates & properties
            workingSlate = this.buildSkeleton(this.dates, roles, this.schedule.weeklyEvents);

            // do schedule for each weekly event separately
            this.schedule.weeklyEvents.forEach((weeklyEvent, we) => {

                // dates where roster is full; need one array / role (even if empty) to start
                let datesFilledPerRole = [];
                roles.forEach(role => datesFilledPerRole.push([]));

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

                // firstDate helps us make sure we still are working with the right day of the week.
                const firstDate = this.dates[we][0];
                // when numberDates = datesChecked.length, we've checked them all
                const numberDates = weeks[we];

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

                    totalSlotsPerRole[r] = (volsNeeded[r] * weeks[we]);

                }); // end of for each role in roles

                //  Need to calculate maxTimesServedPerRole and maxRepeatPerRole
                let maxTimesServedPerRole = [];
                let maxRepeatPerRole = [];

                // if there are more slots / week to be filled than there are volunteers, show error message;
                //   don't run schedule.  noErrors is flag to avoid displaying slate
                volsNeeded.forEach((slot, s) => {
                    maxTimesServedPerRole.push((weeks[we] * volsNeeded[s]) / numberVolunteers[s]);
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

                    // r is the index for the role of the current volunteer
                    //   note:  roles is an array for a future release when a volunteer can have 
                    //          more than one possible role
                    // if r is -1, we don't need the role of this volunteer in this schedule, skip the volunteer
                    const r = roles.indexOf(volunteer.roles[0]);
                    if (!(r === -1)) {  // volunteer's role needed in this schedule
                        // this volunteer is scheduled 0 times so far
                        let timesServed = 0;
                        // keep track of dates checked for this volunteer in this weeklyevent
                        let datesChecked = [];

                        // start with first date in weeklyevents  

                        // currDate Should be first date of weekly events
                        let currDate = firstDate;

                        // Reminder, totalSlotsPerRole is how many needed for this recurring event 
                        //    i.e. number of "ushers" needed at this weekly recurring event over the whole schedule

                        // repeat below until scheduled maxTimesServedPerRole, all roles filled, 
                        //    or all dates checked for this volunteer

                        // do for multiple dates!
                        // continue if ....haven't met max times served,
                        //              && not all dates checked
                        //              && not all the slots for this role have been filled.
                        //              && currDate not = 0 () means no more possible dates found.
                    
                        while ( (timesServed < maxTimesServedPerRole[r])
                            && (datesChecked.length < numberDates)
                            && (slotsFilled[r] < totalSlotsPerRole[r]) 
                            && (currDate != 0) ) {

                            if (this.goodDate(volunteer, currDate, weeklyEvent.time, workingSlate, roles[r], volsNeeded[r], we)) {
                                // keep track of which dates have been checked for this volunteer
                                datesChecked.push(currDate);
                                datesFilledPerRole[r] = this.scheduleVolunteer(volunteer, r, roles, volsNeeded, currDate, this.schedule.weeklyEvents[we].time, workingSlate, datesFilledPerRole);

                                timesServed++;
                                slotsFilled[r]++;

                                // increment date by maxRepeat.. if this was a good date.
                                currDate = this.pickNewDate(currDate, maxRepeatPerRole[r], datesChecked, firstDate, numberDates);
                            } else {
                                // keep track of which dates have been checked for this volunteer
                                datesChecked.push(currDate);

                                // increment date by one week if this was a bad date
                                currDate = this.pickNewDate(currDate, 1, datesChecked, firstDate, numberDates);
                            };

                            // if currDate of 0 returned, then pickNewDate couldn't find any more valid
                            //  dates for this volunteer.  Set datesChecked to ALL the dates, to stop checking.
                            if (currDate === 0) { 
                                datesChecked = this.dates[we];
                            };

                        }; // end of while loop to fill slots with this volunteer

                    }; // end of if volunteer's role needed.

                }); // of for each volunteer in volsInWeeklyEvent

            }); // of for each weekly event in weeklyEvents (we is index)
            return workingSlate;
        }, // end of fillSlate method


        // starts the slate array of objects with dates and roles.
        // volunteer assignments to be filled in later
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

        // create the headers for the slate table on the website & in the PDF
        // first column is Date/Time, rest are roles being assigned.
        createHeaders(roles) {
            function Role(text, value) {
                this.text = text;
                this.value = value;
            }

            let headers = [];

            // first two columns are date & time
            const dateHeader = new Role('Date', 'date');
            headers.push(dateHeader);
            const timeHeader = new Role('Time', 'time');
            headers.push(timeHeader);

            roles.forEach(r => {
                const roleObj = new Role(r, r);
                headers.push(roleObj);
            });

            return headers
        },


        goodDate(volunteer, date, time, slate, role, volsNeeded, we) {
            // 'we' is index for this weekly (recurring) event

            // checks if volunteer is available
            //    and if volunteer has already been scheduled
            //    and date within range of schedule
            //    and if enough people are scheduled for this role and date

            // assume the date is good unless proven otherwise
            let isGood = true;

            // get data needed from volunteer object
            let badDates = volunteer.notAvailable;

            const firstName = volunteer.firstName;
            const lastName = volunteer.lastName;

            // make sure date is in format expected
            date = moment(date).format("YYYY-MM-DD").toString();

            // convert dates in badDates to same format as date
            // add 7 hours to avoid time zones changing the date
            badDates = badDates.map(badDate => 
                moment(badDate).add(7, 'hours').format("YYYY-MM-DD").toString());

            // put startDate and endDate in schedule in same format as date
            let startDate = moment(this.schedule.startDate).format("YYYY-MM-DD");
            let endDate = moment(this.schedule.endDate).format("YYYY-MM-DD");

            // date is bad if it's before the beginning of the schedule

            if (date < startDate) { return false };

            // date is bad if it's past the end of the schedule
            if (date > endDate) {return false };

            // put the startDate and endDate back in expected formats
            moment(this.schedule.startDate).format("YYYY-MM-DD").toString();
            moment(this.schedule.endDate).format("YYYY-MM-DD").toString();

            // date is good if it is NOT in the list of unavailable dates (badDates)
            // (and not already returned a false if out of range)

            isGood = !badDates.includes(date);
            if (!isGood) {return false};  // no need to check further

            // where to update the assignment in the array (which object)
            const timeDateIndex = slate.findIndex(timeDate => 
                timeDate.date === date && timeDate.time === time
            );

            // check if enough volunteers have been scheduled for this role and date
            const volsScheduled = slate[timeDateIndex][role].length;

            // if there are at least as many scheduled as needed, return false;
            if (volsScheduled >= volsNeeded) {return false}

            // is firstName lastName in slate
            if ( slate[we][role].includes([firstName + " " + lastName]) || 
                 slate[we][role].includes([" " + firstName + " " + lastName]) 
            ) {return false};

            return isGood;
        },

        // get next date to try to assign volunteer.
        // make sure the date is in the range, & hadn't already been checked.
        // Make sure it's still the correct day of the week.
        // spread the dates out, so the volunteer assignments get spread out.
        pickNewDate(date, increment, datesChecked, firstDate, numberDates) {

            // new date should be a multiple of a week later,
            //   to get that many weekly occuring events later.
            date = moment(date).add(increment, 'weeks');

            // if we've already checked all the dates, any date isn't good.
            if (numberDates <= datesChecked.length) {return 0}; 

            // all dates (date, endDate, startDate) should be in moment format
            firstDate = moment(firstDate);  // this will be the right day of the week
            let end = moment(this.schedule.endDate);
            let start = moment(this.schedule.startDate);

            // if this is past the end of the schedule,
            //  wrap around to the beginning , and then increment
            //  one week at a time until you find a date that hasn't been
            //  checked, or all the dates have been checked.

            if (date > end) { date = firstDate; }
            
                while (datesChecked.includes(moment(date).format("YYYY-MM-DD"))) {
                    date = moment(date).add(1, 'weeks');
                    datesChecked.push(moment(date).format("YYYY_MM_DD"));

                    if (date > moment(end)) {
                        return 0;  // no available dates found
                    };

                };

            // reformat start and end dates
            this.schedule.startDate = moment(this.schedule.startDate).format("YYYY-MM-DD").toString();
            this.schedule.endDate = moment(this.schedule.endDate).format("YYYY-MM-DD").toString();
            return moment(date).format("YYYY-MM-DD").toString();
        },

        scheduleVolunteer(volunteer, r, roles, volsNeeded, date, time, workingSlate, datesFilledPerRole) {
            // assign volunteer a spot (put in slate)

            // where to update the assignment in the array (which object)
            const timeDateIndex = workingSlate.findIndex(timeDate => 
                timeDate.date === date && timeDate.time === time
            );

            // get volunteer name
            let volunteerName = volunteer.firstName.concat(" ", volunteer.lastName);

            // push the assignment.
            // put a space before the name if it's not the first. Comma's get added automatically.
            if (workingSlate[timeDateIndex][roles[r]].length > 0) {
                volunteerName = " " + volunteerName;
            };
            workingSlate[timeDateIndex][roles[r]].push(volunteerName);

            // get the datesFilled for this role; it will be an array of dates.
            let datesFilled = datesFilledPerRole[r];

            // volunteersScheduled is the number of volunteers in this slot
            //    (for this role, on this date, in this weekly event)
            const volunteersScheduled = workingSlate[timeDateIndex][roles[r]].length;

            // if the number of people scheduled is at least the number needed (volsNeeded),
            //   then add this date to the datesFilled array
            if (volunteersScheduled >= volsNeeded[r]) { datesFilled.push(date) };

            return datesFilled;
        },  // of schedule volunteer

        cleanUpSlate() {
            // format the dates and times nicely
            this.slate.forEach(eventLine => {
                eventLine.date = moment(eventLine.date).format("M/D/YYYY (dddd)").toString();
                // put time in datetime format (actual date is irrelevant because only time part is used)
                const date = "2020-03-16";
                const time = date.concat(" ", eventLine.time);
                eventLine.time = moment(time).format("h:mm a").toString();
            });

            return this.slate;
        },

        // create and save the PDF file
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
            const pdfTitle = this.schedule.name.concat(": ",
                moment(this.schedule.startDate).format("M/D/YYYY").toString(), 
                " through ",
                moment(this.schedule.endDate).format("M/D/YYYY").toString());
            doc.text(10, 10, pdfTitle);

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

.schedName {
    text-decoration: underline;
    text-emphasis: bold;
}
</style>
