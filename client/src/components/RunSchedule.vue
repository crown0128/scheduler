<template>
<div>
    <h2><span class="schedName">{{ schedule.name }}</span> <span class="redtext">{{ notMsg }}</span></h2>
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
            slate: [],
            headers: []
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
                console.log("initialized datesFilledPerRole:");
                console.log(datesFilledPerRole);


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
                        console.log('***************************************************');
                        console.log("Begin this volunteer " + volunteer.firstName + " in WeeklyEvent " + we + ".");
                        console.log("Weekly event: " + weeklyEvent.day + ", " + weeklyEvent.time);
                        console.log('=========== datesChecked: =============');
                        console.log(datesChecked);
                        console.log('***************************************************');
                        // start with first date in weeklyevents  

                        // currDate Should be first date of weekly events
                        let currDate = firstDate;
                        console.log("_________________  new currDate: (initialized for " + volunteer.firstName + "): " + currDate);

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

                                console.log('=========== datesChecked: =============');
                                console.log(datesChecked);
                                console.log("...pushed Currdate: " + currDate);
                                console.log("in while checking various dates for " + volunteer.firstName);
                                console.log('===========++++++=============');

                                datesFilledPerRole[r] = this.scheduleVolunteer(volunteer, r, roles, volsNeeded, currDate, this.schedule.weeklyEvents[we].time, workingSlate, datesFilledPerRole);

                                timesServed++;
                                slotsFilled[r]++;

                                // increment date by maxRepeat.. if this was a good date.
                                currDate = this.pickNewDate(currDate, maxRepeatPerRole[r], datesChecked, firstDate, numberDates);
                                console.log("_________________  new currDate: (after scheduled): " + currDate);
                            } else {
                                // keep track of which dates have been checked for this volunteer
                                datesChecked.push(currDate);

                                console.log('=========== datesChecked: =============');
                                console.log(datesChecked);
                                console.log("in while checking various dates for " + volunteer.firstName);
                                console.log("Currdate: " + currDate + " just pushed.");
                                console.log('===========++++++=============');

                                // increment date by one week if this was a bad date
                                currDate = this.pickNewDate(currDate, 1, datesChecked, firstDate, numberDates);
                                console.log("_________________  new currDate: (after bad date): " + currDate);
                            };

                            // if currDate of 0 returned, then pickNewDate couldn't find any more valid
                            //  dates for this volunteer.  Set datesChecked to ALL the dates, to stop checking.
                            if (currDate === 0) { 
                                datesChecked = this.dates[we];
                            };
                            console.log("**************************************");
                            console.log("*****  bottom of while loop for " + volunteer.firstName);
                            console.log("*****  continue looping?? ");
                            console.log("*****  is timesServed < maxTimesServedPerRole[r]? ");
                            console.log("*****  " + timesServed + "     " + maxTimesServedPerRole[r]);
                            console.log("*****  datesChecked.length < numberDates ???");
                            console.log("*****  " + datesChecked.length + "     " + numberDates);
                            console.log("*****  slotsFilled[r] < totalSlotsPerRole[r] ???"); 
                            console.log("*****  " + slotsFilled[r] + "     " + totalSlotsPerRole[r]); 
                            console.log("*****  (currDate != 0) ???" );
                            console.log("*****  " + (currDate != 0));

                        }; // end of while loop to fill slots with this volunteer

                    }; // end of if volunteer's role needed.

                }); // of for each volunteer in volsInWeeklyEvent

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
            
            // compare same datatypes to get valid results
            // date = moment(date);

            // date is bad if it's before the beginning of the schedule
            if (date < this.schedule.startDate) { return false };

            // date is bad if it's past the end of the schedule
            if (date > this.schedule.endDate) {return false };

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
            console.log("mmmm timeDateIndex: " + timeDateIndex);

            // check if enough volunteers have been scheduled for this role and date
            const volsScheduled = slate[timeDateIndex][role].length;
            console.log("mmmm volsScheduled: " + volsScheduled);

            // if there are at least as many scheduled as needed, return false;
            console.log("mmmm is volsScheduled >= volsNeeded ??");
            console.log("mmmm " + volsScheduled + "     " + volsNeeded);
            if (volsScheduled >= volsNeeded) {return false}

            // check if volunteer is already scheduled

            // testing...
            console.log("\n***********************************************************");
            console.log("***************  Ready to check if already scheduled (in 'goodDate')");
            // console.log("firstName: ");
            // console.log(firstName);
            // console.log("lastName: ");
            // console.log(lastName);
            // console.log("volunteer:");
            // console.log(volunteer);
            console.log("8888  slate");
            console.log(slate);
            this.testDisplaySlate(slate);
            console.log(date);

            // is firstName lastName in slate
            console.log("8888 full name  in (slate[we][role]): ");
            console.log("8888 full name: ");
            console.log([firstName + " " + lastName]);
            console.log("8888 slate[we][role]: ");
            console.log(slate[we][role]);
            console.log("curious - are they equal?? ( == then ===)");
            console.log( ([firstName + " " + lastName]) == slate[we][role]);
            console.log( ([firstName + " " + lastName]) === slate[we][role]);
            console.log('slate[we][role].includes(  [firstName + " " + lastName]  )' );
            console.log(slate[we][role].includes( [firstName + " " + lastName] ) );
            if ( slate[we][role].includes([firstName + " " + lastName]) || 
                 slate[we][role].includes([" " + firstName + " " + lastName]) 
            ) {return false};
            console.log("GGGOOOOOOODDD ????", + isGood);
            console.log("***********************************************************");

            if (!isGood) {return isGood};  // no need to check any further

            return isGood;
        },


        testDisplaySlate(slate) {
            slate.forEach(date => {
                console.log("************  SLATE for " + date.date + " - " + date.time + ".");
                date.Sacristan.forEach(s => console.log("Sacristan: " + s));
                // date.Lector.forEach(l = console.log("Lector: " + l));
                date['Eucharistic minister'].forEach(em => console.log("EM: " + em));
                date['Altar server'].forEach(as => console.log("Server: " + as));
                // date.Usher.forEach(u => console.log("Usher: " + u));
            });
        },

        pickNewDate(date, increment, datesChecked, firstDate, numberDates) {

            console.log('ddddddddddddddddd  Pick new date');
            console.log('ddddddddddd  old date passed in: ' + date);
            console.log('ddddddddddd  increment: ' + increment);
            console.log('ddddddddddd  datesChecked:');
            console.log(datesChecked);
            console.log('ddddddddddd  firstDate: ' + firstDate);
            console.log('ddddddddddd  numberDates: ' + numberDates);
            // new date should be a multiple of a week later,
            //   to get that many weekly occuring events later.
            date = moment(date).add(increment, 'weeks');
            console.log('ddddddddddd reformatted date: ' + date);

            console.log('ddddddddddd is datesChecked.length >= numberDates ???');
            console.log('ddddddddddd ' + datesChecked.length + '     ' + numberDates);
            // if we've already checked all the dates, any date isn't good.
            if (datesChecked.length >= numberDates) {return 0}; 
            console.log('ddddddddddd No (yes would have returned); more dates to check');
            // all dates (date, endDate, startDate) should be in moment format
            let end = moment(this.schedule.endDate);
            let start = moment(this.schedule.startDate);
            firstDate = moment(firstDate);  // this will be the right day of the week
            console.log('end: ' + end + ';  start: ' + start + '; reformatted firstDate: ' + firstDate);

            // if this is past the end of the schedule,
            //  wrap around to the beginning , and then increment
            //  one week at a time until you find a date that hasn't been
            //  checked, or all the dates have been checked.
            console.log('ddddddddddd is date > end ???');
            console.log('ddddddddddd ' + date + '     ' + end);
            if (date > end) {
                date = firstDate;
            
            console.log('ddddddddddd start loop until find date not already checked');
            console.log('before loop:  date: ' + date);
                while (datesChecked.includes(date)) {
                    date = moment(date).add(1, 'weeks');
                    console.log('this date??:  date: ' + date);
                    console.log('is date > end??  (then return 0)');
                    console.log(date + '     ' +  end);
                    if (date > moment(end)) {
                        return 0;  // no available dates found
                    };
                    console.log('ddddddddddddd  repeat while loop??  (date in datesChecked?)');
                    console.log('ddddddddddddd  ' + date);
                    console.log(datesChecked);
                    console.log('----ddddddddddddd----\n');

                };
            };

            // reformat start and end dates
            this.schedule.startDate = moment(this.schedule.startDate).format("YYYY-MM-DD").toString();
            this.schedule.endDate = moment(this.schedule.endDate).format("YYYY-MM-DD").toString();
            console.log('dddddddddddddddd return ' + moment(date).format("YYYY-MM-DD").toString());
            console.log('ddddddddddddddddd     END    Pick new date dddddddddddddddd\n\n');
            return moment(date).format("YYYY-MM-DD").toString();
        },

        scheduleVolunteer(volunteer, r, roles, volsNeeded, date, time, workingSlate, datesFilledPerRole) {
            // assign volunteer a spot (put in slate)
// testing...
            console.log("\n***********************************************************");
            console.log("\n****************  Scheduling a volunteer   **************");
console.log("VVVVV SCHEDULING a volunteer:");
console.log("VVVVV volunteer firstName:");
console.log(volunteer.firstName);
console.log("VVVVV volunteer:");
console.log(volunteer);
console.log("VVVVV r:");
console.log(r);
console.log("VVVVV roles:");
console.log(roles);
console.log("VVVVV date:");
console.log(date);
console.log("VVVVV time:");
console.log(time);




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
            console.log("VVVVV workingSlate:");
            console.log(workingSlate);
            this.testDisplaySlate(workingSlate);
            console.log("\n***********************************************************");

            // get the datesFilled for this role; it will be an array of dates.
            let datesFilled = datesFilledPerRole[r];

            // if all the slots for this weekly event & this role are filled, make note of that
            //    so we can skip checking for this spot in the future
            // console.log("%%%      datesFilled   %%%%%:");
            // console.log(datesFilled);
            // console.log("%%%       workingSlate[timeDateIndex][roles[r]]       %%%");
            // console.log(workingSlate[timeDateIndex][roles[r]]);

            // **************** if all the dates for this role are filled, add to datesFilled
            // console.log("roles:");
            // console.log(roles);
            // console.log("slots:");
            // console.log(slots);

            // volunteersScheduled is the number of volunteers in this slot
            //    (for this role, on this date, in this weekly event)
            const volunteersScheduled = workingSlate[timeDateIndex][roles[r]].length;

            // if the number of people scheduled is at least the number needed (volsNeeded),
            //   then add this date to the datesFilled array
            if (volunteersScheduled >= volsNeeded[r]) { datesFilled.push(date) };
            console.log('in SCHEDULE-VOLUNTEER;   datesFilled:      <----------');
            console.log(datesFilled);





            return datesFilled;
        },  // of schedule volunteer

        cleanUpSlate() {

            this.slate.forEach(eventLine => {
                eventLine.date = moment(eventLine.date).format("M/D/YYYY (dddd)").toString();
                // put time in datetime format (actual date is irrelevant because only time part is used)
                const date = "2020-03-16";
                const time = date.concat(" ", eventLine.time);
                eventLine.time = moment(time).format("h:mm a").toString();
            });

            return this.slate;
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
