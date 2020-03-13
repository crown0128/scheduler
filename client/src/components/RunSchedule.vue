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
  
            // for testing
            // body: [ 
            //     {
            //         date: "3/1/2020, Sunday, 10am",
            //         sacristans: "Dorothy",
            //         lectors: "Mike"
            //     },
            //     {
            //         date: "3/1/2020, Sunday, noon",
            //         sacristans: "Luci",
            //         lectors: "Mark"
            //     },
            //     {
            //         date: "3/2/2020, Saturday, 5pm",
            //         sacristans: "Ric & Marci",
            //         lectors: "Christi"
            //     },
            // ],

        };
    },

    methods: {
        getDates() {
            // // console.log("In getdates");

            // // console.log("\n this.schedule");
            // // console.log(this.schedule);

            // ***********************  sort weekly events here, to get final slate sorted??  Or sort final slate? ***************

            const begin = moment(this.schedule.startDate).format("YYYY-MM-DD");
            const end = moment(this.schedule.endDate).format("YYYY-MM-DD");

            // // console.log("***  begin - end:  " + begin + "-" + end);
            const daysWord = this.schedule.weeklyEvents.map(weeklyEvent => {
                return weeklyEvent.day;
            });
            // // console.log("daysWord: ");
            // // console.log(daysWord);
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
            // // console.log("days");
            // // console.log(days);

            // const days = [0, 3]; // Sundays & Wednesdays

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
                // // console.log("begin dayNeeded: " + dayNeeded);

                // find how many days the start of the week is from the day of the week we need.
                //   if it is negative, we're before the beginning of the schedule.
                let diff = moment(dayNeeded).diff(moment(begin), 'days');
                // // console.log("after diff dayNeeded: " + dayNeeded);

                // if the day of the week is before the beginning date, add a week.
                if (diff < 0) {
                    dayNeeded = moment(dayNeeded).add(7, 'days');
                    // // console.log("after diff<0 dayNeeded: " + dayNeeded);
                };

                // continue looping until past the end date
                while ((moment(end).diff(moment(dayNeeded))) >= 0) {
                    // // console.log("end: " + moment(end).format("MM-DD-YYYY"));
                    // // console.log("dayNeeded: " + dayNeeded);
                    // // console.log("dayNeeded moment: " + moment(dayNeeded).format("MM-DD-YYYY"));

                    // add a date needed to the array
                    dates.push(moment(dayNeeded).format("YYYY-MM-DD").toString());

                    // look at the same day of the week the following week.
                    dayNeeded = moment(dayNeeded).add(7, 'days');
                };

                eventDates.push(dates);
                // // console.log("eventDates");
                // // console.log(eventDates);

            });

            // // console.log("Checking dates...testing - end of GETDATES Before adding []");
            // // console.log(eventDates);
            // eventDates.forEach(date => {
            //     // console.log("----");
            //     date.forEach(day => {
            //         // console.log(moment(day).format("YYYY-MM-DD dddd"));
            //     });
            //     // console.log("----");
            // });

            // // make sure eventDates is a nested array (for later use in fillSlate() )
            // // console.log("\n");
            // // console.log(daysWord);
            // // console.log(daysWord.length);
            // // console.log("\n");
            // if (daysWord.length = 1) {eventDates=[eventDates]};

            // // console.log("Checking dates...testing - end of GETDATES AFTER adding []");
            // // console.log(eventDates);
            // eventDates.forEach(date => {
            //     // console.log("----");
            //     date.forEach(day => {
            //         // console.log(moment(day).format("YYYY-MM-DD dddd"));
            //     });
            //     // console.log("----");
            // });
            return eventDates;
        }, // end of getDates

        getVolunteersAndFillSlate() {
            // console.log("In getVolunteersAndFillSlate");
            // console.log(this.slate);
            axios.get('/api/volunteers')
                .then(response => {
                    // // console.log("get volunteers axios done");
                    this.volunteers = response.data;
                    // this.volunteerNames = this.volunteers.map(volunteer => { 
                    //   id: volunteer._id, 
                    //   name: volunteer.firstName + " " + volunteer.lastName 
                    // }); 
                    // // console.log("this.volunteers");
                    // // console.log(this.volunteers);

                    this.filename = this.schedule.name + "-" + this.schedule.version + ".pdf";

                    this.slate = this.fillSlate();

                    // })
                });
        },

        fillSlate() {
            // function NewSlate(time, day) {
            //     this.time = time
            //     this.day = day
            // };

            // console.log("In fillSlate");
            // console.log(this.slate);
            // // console.log("THIS.VOLUNTEERS");
            // // console.log(this.volunteers);

            this.dates = this.getDates();
            // check dates for testing
            // // console.log("Checking dates...testing");
            // // console.log(this.dates);
            // this.dates.forEach(date => {
            //     // console.log("----");
            //     date.forEach(day => {
            //         // console.log(moment(day).format("YYYY-MM-DD dddd"));
            //     });
            // });

            // Need estimate for ...
            //    maximum times each volunteer will serve per role (per weekly event) (maxTimesServedPerRole),
            //        maxTimesServedPerRole
            //    and max gap between roles (i.e. 2 for every other day) (maxRepeatPerRole).
            //        maxRepeatPerRole
            //     maxTimesServedPerRole and maxRepeatPerRole are both arrays, one number for each role, and
            //        will be in the same order as roleNames in roles

            // get number of weekly events (may not be the same for each weekly event,
            //   if, for example, the start & end dates don't include full weeks)
            let weeks = [];
            this.dates.forEach(date => {
                // // console.log("date");
                // // console.log(date);
                weeks.push(date.length);
            }); // end of forEach date in dates
            // // console.log("weeks: ");
            // // console.log(weeks);

            // get the roles needed, and
            // the number of volunteers needed for each role (slots)
            let roles = [];
            let slots = [];
            this.schedule.roles.forEach(role => {
                roles.push(role.roleName);
                slots.push(role.numberNeeded);
            }); // end of forEach role in the schedule
            // // console.log("roles:");
            // // console.log(roles);
            // // console.log("slots:");
            // // console.log(slots);

            // let workingSlate = new newSlate("00:00", "Sunday");
            let workingSlate = [];
            // set up empty slate with dates & properties
            workingSlate = this.buildSkeleton(this.dates, roles, this.schedule.weeklyEvents);
            console.log("workingSlate after done with buildSkeleton call");
            console.log(workingSlate);

            // console.log("Start foreach WEEKLYEVENT in WEEKLYEVENTS (we)");
            // console.log(this.schedule.weeklyEvents);
            // do schedule for each weekly event separately
            this.schedule.weeklyEvents.forEach((weeklyEvent, we) => {
                console.log("274:  WE = " + we);
                // console.log("*  in foreach WEEKLYEVENT; we: " + we);
                // console.log(weeklyEvent);
                
                // // console.log("\n********************");
                // // console.log("\n********************");
                // // console.log("\n new weeklyEvent...");
                // // console.log("\n********************");
                // // console.log(weeklyEvent);

                // initialize the number of volunteers available for each role
                // this gets re-created for each weekly event
                let numberVolunteers = [];
                // // console.log('??? numberVolunteers on definition:');
                // // console.log(numberVolunteers);

                // number of slots to be filled for a specific role for one recurring weekly event
                //   for the whole schedule (i.e. how many ushers needed Sat 5pm for all dates)
                let totalSlotsPerRole = [];
                // get the number of volunteers available for each role
                // (OK to ignore dates not available - it's an estimate to help
                //    distribute volunteers evenly over the schedule)

                // number of slots filled for each role for this weekly event
                let slotsFilled = []; // No slots filled for this role in this recurring event, yet
                // console.log("*  Start foreach ROLE in ROLES (r)");
                // console.log(roles);
                roles.forEach((role, r) => {
                    // console.log("**  in foreach ROLE; r: " + r);
                    // console.log(role);

                    slotsFilled.push(0); // No slots filled for this role in this recurring event, yet
                    numberVolunteers.push(0); // add an element for this role.
                    totalSlotsPerRole.push(0); // add an element for this role.
                    // // console.log('??? numberVolunteers on new role... push 0 element:');
                    // // console.log(numberVolunteers);
                    // console.log("** Start foreach VOLUNTEER in VOLUNTEERS");
                    this.volunteers.forEach(volunteer => {
                        // console.log("***  in foreach VOLUNTEER");
                        // console.log(volunteer);

                        // if volunteer wants this event time (role, day and time match)
                        if (
                            (volunteer.roles.includes(role)) &&
                            (volunteer.prefTimes[0].day === weeklyEvent.day) &&
                            (volunteer.prefTimes[0].time === weeklyEvent.time)
                        ) {
                            numberVolunteers[r]++
                            // // console.log('??? numberVolunteers on MATCH... increment:');
                            // // console.log(numberVolunteers);
                            // // console.log("\n********************");
                            // // console.log("\n*****  MATCH!  *****");
                            // // console.log("\n********************");
                            // // console.log("role (r): " + role + "(" + r + ")");
                            // // console.log("volunteer.firstName: " + volunteer.firstName + " roles: " + volunteer.roles);

                            // // console.log("volunteer.prefTimes[0].day");
                            // // console.log(volunteer.prefTimes[0].day);
                            // // console.log("volunteer.prefTimes[0].time");
                            // // console.log(volunteer.prefTimes[0].time);
                            // // console.log("weeklyEvent.day");
                            // // console.log(weeklyEvent.day);
                            // // console.log("weeklyEvent.time");
                            // // console.log(weeklyEvent.time);

                            // // console.log("numberVolunteers:");
                            // // console.log(numberVolunteers);
                        } else {
                            // // console.log("\n**no match**");
                            // // console.log("role (r): " + role + "(" + r + ")");
                            // // console.log("volunteer.firstName: " + volunteer.firstName + " roles: " + volunteer.roles);

                            // // console.log("volunteer.prefTimes[0].day");
                            // // console.log(volunteer.prefTimes[0].day);
                            // // console.log("volunteer.prefTimes[0].time");
                            // // console.log(volunteer.prefTimes[0].time);
                            // // console.log("weeklyEvent.day");
                            // // console.log(weeklyEvent.day);
                            // // console.log("weeklyEvent.time");
                            // // console.log(weeklyEvent.time);

                            // // console.log("numberVolunteers:");
                            // // console.log(numberVolunteers);
                        } // end of if volunteer wants this event time
                    }); // end of for each volunteer in volunteers
                    // // console.log("r: " + r);
                    // // console.log("==== roles:");
                    // // console.log(roles);
                    totalSlotsPerRole[r] = (slots[r] * weeks[we]);
                    // // console.log('==== totalSlotsPerRole:');
                    // // console.log(totalSlotsPerRole);
                }); // end of for each role in roles
                console.log("366:  WE = " + we);
                //      // console.log("**** check number volunteers... ***");
                //      // console.log("this.volunteers");
                //      // console.log(this.volunteers);
                //      // console.log("this.schedule");
                //      // console.log(this.schedule);
                //      // console.log("numberVolunteers");
                //      // console.log(numberVolunteers);

                //  Need to calculate maxTimesServedPerRole and maxRepeatPerRole
                // // console.log("Before calculating maxTimesServedPerRole:");
                // // console.log("weeks:");
                // // console.log(weeks);
                // // console.log("we:" + we);
                // // console.log("slots:");
                // // console.log(slots);
                // // console.log("numberVolunteers:");
                // // console.log(numberVolunteers);
                let maxTimesServedPerRole = [];
                let maxRepeatPerRole = [];

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
                // // console.log("maxTimesServedPerRole:");
                // // console.log(maxTimesServedPerRole);
                // // console.log("maxRepeatPerRole:");
                // // console.log(maxRepeatPerRole);

                // start filling in slate!!

                // for each weekly event (still in that loop)

                // gather volunteers in this weekly event
                console.log("Examine volsInWeeklyEvent...");
                console.log("volunteers");
                console.log(this.volunteers);
                console.log('weeklyEvent.day');
                console.log(weeklyEvent.day);
                console.log('weeklyEvent.time');
                console.log(weeklyEvent.time);
                const volsInWeeklyEvent = this.volunteers.filter(volunteer =>
                    ((volunteer.prefTimes[0].day === weeklyEvent.day) &&
                        (volunteer.prefTimes[0].time === weeklyEvent.time)
                    )
                );
                console.log("424:  WE = " + we);
                console.log("volsInWeeklyEvent");
                console.log(volsInWeeklyEvent);

                // put each volunteer in the schedule max times 
                //     (may be more, later, if dates not available makes other serve more often )
                volsInWeeklyEvent.forEach(volunteer => {

                    // r is the index for the role of the current volunteer
                    //   note:  roles is an array for a future release when a volunteer can have 
                    //          more than one possible role
                    // if r is -1, we don't need the role of this volunteer in this schedule, skip the volunteer
                    const r = roles.indexOf(volunteer.roles[0]);
                console.log("437:  WE = " + we);
                    console.log("Skip if role not found...  r= " + r);
                    if (!(r === -1)) {
                        // this volunteer is scheduled 0 times so far
                        let timesServed = 0;
                        // keep track of dates checked for this volunteer in this weeklyevent
                        let datesChecked = [];
                        // when numberDates = datesChecked.length, we've checked them all
                        const numberDates = weeks[we];
                        // start with first date in weeklyevents  
                        // // console.log('(((((((((((((  this.dates )))))))))');
                        // // console.log(this.dates);
                        // // console.log("we: " + we);
                        // // console.log("this.dates[0]:");
                        // // console.log(this.dates[0]);
                        // // console.log("this.dates[0][0]:");
                        // // console.log(this.dates[0][0]);
                console.log("454:  WE = " + we);
                        console.log("set currDate; we= " + we );
                        let currDate = this.dates[we][0];
                        // // console.log("currDate: -- in fillSlate " + moment(currDate).format("YYYY-MM-DD").toString());

                        // Reminder, totalSlotsPerRole is how many needed for this recurring event 
                        //    i.e. number of "ushers" needed at this weekly recurring event over the whole schedule

                        // repeat below until scheduled maxTimesServedPerRole, all roles filled, 
                        //    or all dates checked for this volunteer

                        // while (
                        //     (timesServed < maxTimesServedPerRole[r]) && 
                        //     (slotsFilled[r] < totalSlotsPerRole[r]) &&
                        //     (datesChecked.length < numberDates)) 
                        // {
                        // // console.log("timesServed: " + timesServed);
                        // // console.log("maxTImesServedPerRole[r]: " + maxTimesServedPerRole[r] + " r(" + ")");
                        // // console.log("slotsFilled[r]: " + slotsFilled[r]);
                        // // console.log("totalSlotsPerRole[r]: " + totalSlotsPerRole[r]);
                        // // console.log("datesChecked:");
                        // // console.log(datesChecked);
                        // // console.log("numberDates: " + numberDates);


                        // // console.log("datesChecked:");
                        // // console.log(datesChecked);
                        //  check if this is a good date
                        

                        // do for multiple dates!
                        // continue if ....haven't met max times served,
                        //              && not all dates checked
                        console.log("we: " + we + ";  this.dates");
                        console.log(this.dates);
                            console.log("\n $$ before while loop (r: " + r + "; we: " + we);
                            console.log("timesServed: " + timesServed);
                            console.log("maxTimesServedPerRole[r]: " + maxTimesServedPerRole[r]);
                            console.log("datesChecked.length" + datesChecked.length);
                            console.log("this.dates[we].length:  " + this.dates[we].length);
                        while ( (timesServed < maxTimesServedPerRole[r]) && (datesChecked.length <= this.dates[we].length)) {
                console.log("495:  WE = " + we);
                            console.log("\n in while loop");
                            console.log("timesServed: " + timesServed);
                            console.log("maxTimesServedPerRole[r]: " + maxTimesServedPerRole[r]);
                            console.log("datesChecked.length" + datesChecked.length);
                            console.log("this.dates[we].length:  " + this.dates[we].length);
                            // // console.log("currdate: " + currDate);
                            // do this now, before it gets changed to a new date
                            datesChecked.push(currDate);
                            console.log("currdate: " + currDate);
                            console.log("datesChecked:");
                            console.log(datesChecked);

                            if (this.goodDate(volunteer)) {
                                // // console.log("goodDate true, call scheduleVolunteer");
                                console.log("MMMMM  check time  THIS SHOULD CHANGE:");
                                console.log(this.schedule.weeklyEvents);
                                console.log(this.schedule.weeklyEvents[we].time);
                                console.log("we: " + we + "\n");
                                this.scheduleVolunteer(volunteer, r, roles, currDate, this.schedule.weeklyEvents[we].time, workingSlate);
                                timesServed++;
                                // increment date by maxRepeat.. if this was a good date.
                                currDate = moment(this.pickNewDate(currDate, maxRepeatPerRole[r])).format("YYYY-MM-DD").toString();
                            } else {
                                // // console.log("goodDate false");
                                // increment date by one if this was a bad date
                                currDate = moment(this.pickNewDate(currDate, 1)).format("YYYY-MM-DD").toString();
                            };


                        }; // end of while loop to fill slots with this volunteer

                    }; // end of if volunteer's role needed.

                }); // of for each volunteer in volsInWeeklyEvent

            }); // of for each weekly event in weeklyEvents (we is index)
            return workingSlate;
        }, // end of fillSlate method

        // newSlate() {
        //     let array = [];
        //     return array;
        // },

        buildSkeleton(dates, roles, weeklyEvents) {

            function NewObject(date, time) {
                this.date = date;
                this.time = time;
            }

            console.log("start buildskeleton, initialize slate");
            let localSlate = [];

            // // console.log(this.localSlate);
            console.log(localSlate);


            // // console.log("---- dates:");
            // // console.log(dates);
            // // console.log("\n");
            // // console.log("---- roles:");
            // // console.log(roles);
            // // console.log("---- weeklyEvents");
            // // console.log(weeklyEvents);

            // for each weekly event
            console.log("start foreach loop on WEEKLYEVENTDATES in DATES");
            console.log(dates);
            dates.forEach((weeklyEventDates, we) => {
                console.log("* 488: WEEKLYEVENTDATES: we: " + we);
                console.log(weeklyEventDates);
                // console.log("In foreach dates, we = " + we);
                // console.log("dates:");
                // console.log(dates);
                // console.log("weeklyEventDates:");
                // console.log(weeklyEventDates);

                // // console.log("496: Initialize thisObject");
                // // console.log(thisObject);
                console.log("* 499: start foreach loop on DATE in WEEKLYEVENTDATES");
                weeklyEventDates.forEach((date, d) => {
                    console.log("** 501: DATE: d: " + d);
                    console.log(date);
                    // // console.log("In foreach date in weeklyeventdates");
                    // // console.log("date:");
                    // // console.log(date);
                    //    get date, time & day
                    // const localSlateDate = moment(date).format("M/D/YYYY").toString();
                    // const day = moment(date).format("dddd").toString();
                    // // console.log("&& localSlateDate: " + localSlateDate);
                    // // console.log("&& day: " + day);
                    // const time = moment(weeklyEvents[we].time).format("hh:mm a");
                    // const keyDate = date.concat(" ", day, " at ", time);
                    // const keyDate = localSlateDate.concat(" ", day, " at ", weeklyEvents[we].time);
                    // // console.log("keyDate: " + keyDate);

                    //    for each specific date (index d)
                    //    build an object (which will be a row in the displayed/PDF localSlate)
                    // // console.log(weeklyEventDates);
                    // first property is the date
                    // // console.log("bad?? date: " + date);
                    // // console.log("time: weeklyEvents[we].time:  " + weeklyEvents[we].time);
                    // // console.log("time: weeklyEvents[we].day:  " + weeklyEvents[we].day);
                    
                    // // console.log(moment(date).format("YYYY-MM-DD").toString());
                    const newDate = moment(date).format("YYYY-MM-DD").toString();
                    // // console.log(thisObject.date);
                    const newTime = weeklyEvents[we].time;
                    let thisObject = new NewObject(newDate, newTime);
                    console.log("** new THISOBJECT");
                    console.log(thisObject);

                    // remaining properties are the roles
                    roles.forEach(role => {
                        thisObject[role] = [];
                    });
                    // console.log("533: thisObject (in DATE d):");
                    // console.log(thisObject);

                    console.log("** 537: localSlate - before push");
                    console.log(localSlate);

                    localSlate.push(thisObject);
                    
                    console.log("** 537: localSlate - after push");
                    console.log(localSlate);

                });
                console.log("* 538: Finished DATE in d");
                // console.log("* thisObject");
                // console.log(thisObject);
                console.log("* localState");
                console.log(localSlate);
            });
            console.log("546: Finished WEEKLYEVENTDATES in WE");
            console.log("547: SKELETON localSlate just before return:");
            console.log(localSlate);
            // // console.log(this.localSlate);

            // // console.log("in buildSkeleton");
            // // console.log("dates:");
            // // console.log(dates);
            // // console.log(roles);

            // sort into date/time order before returning
            // localSlate = this.sortSlate(localSlate);
            // // console.log("sorted localSlate");
            // // console.log(localSlate);

            return localSlate;
        },

        // NewObject(date, time) {
        //     this.date = date;
        //     this.time = time;
        // },

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

        goodDate(volunteer) {

            // const good = this.volunteerAvailable(volunteer);
            // // console.log("in goodDate");
            // // console.log("good: " + good);

            // const good = ( volunteerAvailable() &&
            //                roleOpen() &&
            //                volNotSchedThen()
            //             );
            return true;

        },

        volunteerAvailable(volunteer) {

            // let available = !volunteer.notAvailable.includes(this.currDate);
            // // console.log("***********************");
            // // console.log("***  in volunteerAvailable ****");
            // // console.log("***********************");
            // // console.log("available: " + available);
            // // console.log("this.currDate: " + moment(this.currDate).format("YYYY-MM-DD"));
            // // console.log("volunteer.notAvailable[0]:");
            // // console.log(moment(volunteer.notAvailable[0]).format("YYYY-MM-DD"));
            // // console.log("volunteer:");
            // // console.log(volunteer);
            return true;
        },

        pickNewDate(date, increment) {
            // console.log("Old date: ");
            // console.log(moment(date).format("YYYY-MM-DD"));
            // date should be a multiple of a week later.
            date = moment(date).add(increment * 7, 'days');
            // need to check if out of range & wrap around. Add one week if wrap lands on date checked.
            // console.log("in picknewdate");
            // console.log("New date: " + moment(date).format("YYYY-MM-DD"));
            // console.log("increment: " + increment);
            return date;
        },

        scheduleVolunteer(volunteer, r, roles, date, time, workingSlate) {
            console.log("@@@@@@@  In scheduleVOLUNTEER");
            console.log('workingSlate:');
            console.log(workingSlate);
            console.log('volunteer');
            console.log(volunteer);
            console.log("r: " + r);
            console.log("roles:");
            console.log(roles);
            console.log("roles[r]:");
            console.log(roles[r]);
            console.log("date: -- in scheduleVolunteer");
            console.log(moment(date).format("YYYY-MM-DD").toString());
            console.log(date);
            console.log("time:");
            console.log(time);
            // i'm really here
            // find where in array object for this date & time are
            // // console.log(".....  date: " + date);
            // // console.log("..... time: " + time);

            const timeDateIndex = workingSlate.findIndex(timeDate => 
                timeDate.date === date && timeDate.time === time
            );
            console.log("index to change: " + timeDateIndex);

            const volunteerName = volunteer.firstName.concat(" ", volunteer.lastName);
            workingSlate[timeDateIndex][roles[r]].push(volunteerName);
            // this.slate[Object.keys(this.slate)[timeDateIndex]].[roles[r]]=volunteerName;
            console.log("slate, after volunteer assigned: " + volunteer.firstName);
            console.log(workingSlate);

            // const timeDateIndex = this.slate.findIndex(
            //     timeDate => 
            //         moment(timeDate.date).format("YYYY-MM-DD").toString() === moment(date).format("YYYY-MM-DD").toString() && 
            //         moment(timeDate.time).format("hh:mm").toString() === time);


            // // console.log("after findindex (slate)");
            // // console.log(slate);
            // // console.log("timeDateIndex: " + timeDateIndex);
            // // console.log("this.slate[timeDateIndex]:  ");
            // // console.log(this.slate[timeDateIndex]);
            // // console.log("roles[r]:  " + roles[r]);
            // this.slate[timeDateIndex].[roles[r]] = this.volunteer.firstName.concat(" ", this.volunteer.lastName);
            // // console.log("slate after assignment:");
            // // console.log(this.slate);

        },

        exportPdf(slate) {


            var doc = new jspdf({
                orientation: 'landscape',            // this.slate = workingSlate;

                format: 'letter',
                putOnlyUsedFonts: true,
            });

            //  THIS WORKS!!!
            const pdfHeaders = [this.headers.map(function (header) {
                return header.text
            })];
            // // console.log("pdfHeaders:");
            // // console.log(pdfHeaders);

            const pdfBody = this.slate.map(function (obj) {
                // return Object.keys(obj).sort().map(function(key) { 
                return Object.keys(obj).map(function (key) {
                    return obj[key];
                });
            });

            // // console.log("pdfBody");
            // // console.log(pdfBody);
            doc.setProperties({
                title: this.schedule.name
            });

            doc.text(10, 10, this.schedule.name);

            doc.autoTable({
                head: pdfHeaders,
                body: pdfBody
            });
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
        // // console.log("beginning slate:");
        // // console.log(this.slate);
    
        this.getVolunteersAndFillSlate();
    }
}
</script>

<style scoped>
.redtext {
    color: red;
    text-emphasis: bold;
}
</style>
