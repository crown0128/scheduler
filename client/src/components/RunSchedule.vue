<template>
<!-- header with schedule name, error message (if any), and button to create a PDF file -->
<div>
    <h2><span class="schedName">{{ schedule.name }}</span> <span class="redtext">{{ notMsg }}</span></h2>
    <h3 class="redtext"> {{ errorMessage }} </h3>
    <div v-if="noErrors">
        <button @click="exportPdf(slate)" class="redtext">
            Click <u>here</u> to create a PDF.
        </button>
        <p>The name of the file will be <span class="redtext">{{ this.filename }}</span> 
            and it will be created in your Downloads folder.
        </p>
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
import fillSlateFcns from '../js/fillSlateFcns.js';  // methods used infilling the slate


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

        // FUTURE ENHANCEMENTS
        // NOTE TO SELF TO DO... (LEFT OFF - for searching purposes ... search for "LEFT OFF")

        //  LEFT OFF...

        //   - Do "with"
        //  Have withFlag, set to false for everyone.
        //      ideas:
        //          (this needs more thinking about)
         //          (Do for all roles (could be in same role: i.e. if altar servers together) )
        //     2     when assigning someone, if they have a "with", put that in the slate with the withFlag
        //              turned on
        //          
        //     1     when assign roles for a new we (weekly event),
        //              put volunteers with "(with?)" in slate first for the first time through.
        //              
        //      3    when going through the volunteers to make an assignment, look for "with" spots.
        //              how to handle this if an assignment gets done out of order?
        //
        //          make sure "(with?)" designations are removed when no longer needed.
        //              It is dropped (along with slate entries with the withFlag) when slate is done.
        //
        //          then need to account for this when doing "regular" assignments
        //              like in number of volunteers assigned for a specific date and role

        //   - roles (like Sacristan) that can be doubled up
        //          skip checking if already assigned in canVolBeAssigned for this case.

        //   - Choose multiple roles and weekly events.
        //   - Identify roles that can be doubled up on, and make that functional.

        //   - Error checking for entering with and notWith for a volunteer:
        //        Self shouldn't be in list of volunteers to choose from.
        //        Can't choose same volunteer in with and in notWith lists.

        //   - Edit dates on current schedule (and/or copy schedule)
        
        //   - Put ALERT messages in PDF & displayed slate.

        //   - ES linter
        //   - tidy code (delete console.log's, indenting, etc.)
        //   - also print to Excel or Word (to edit?)
        //   - print stats of schedule at end - how many times each person scheduled...(& what roles, # not available, with & who with?)
        //   - enable emailing the schedule to the volunteers
        //   - components for choosing a weekly event and choosing a role
        //          and other places code is repeated.  Make components for them and re-use components.

           
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

            // Initialize numTimesAssigned to 0 for each volunteer
            this.volunteers.forEach(volunteer => volunteer.numTimesAssigned = 0);

            // get actual dates needed.
            // dates is nested.  There is one array for each recurring weekly event.
            // In each of those arrays are the specific dates the events are to be held.
            this.dates = fillSlateFcns.getDates(this.schedule, moment);

            // MMS  for testing; console logs all volunteers
            fillSlateFcns.consoleLogVolunteers(this.volunteers); // MMS for testing
            
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

            // set up empty slate with dates & properties
            let workingSlate = fillSlateFcns.buildSkeleton(this.dates, roles, this.schedule.weeklyEvents, moment);
            // console.log("Build Skeleton done");  // mms
            //  Determine the Order the roles (umpire, refreshments, etc) will be assigned.
            //  This will be an array of indices into the roles variable
            //  Those with most constraints (dates to avoid, "with"s, "notWith") are done first.
            const orderOfRoles = fillSlateFcns.getRolesOrder(this.volunteers, roles);
            // console.log("MMS: order of roles: ");  // mms
            // orderOfRoles.forEach(x => console.log(x));  //  mms

            // Gather text for warning alerts when there are too few volunteers.
            let alertText = "";

            //  For each role (in order)
            orderOfRoles.forEach(roleIdx => {
                const role = roles[roleIdx];
                // console.log("MMS:  Starting role:  " + role);  // mms

                // For each weekly event (i.e. 9am Masses)
                this.schedule.weeklyEvents.forEach((weeklyEvent, we) => {
                    // console.log("MMS:  Beginning iteration forEach loop for weekly event " + weeklyEvent.day + " and " + weeklyEvent.time); // mms

                    // Get indices for volunteers for this role and weekly event
                    const [roleAndWEVolunteerIdxes, numVolsAvailableForWEandRole] = fillSlateFcns.getRoleAndWEVolunteerIdxes(this.volunteers, role, weeklyEvent);
                    // console.log("Role and WE Volunteers...  ***************************");  // mms
                    // roleAndWEVolunteerIdxes.forEach(idx => console.log(this.volunteers[idx].firstName));  // mms

                    if (roleAndWEVolunteerIdxes.length === 0) {
                        alertText = alertText + "\nNo " + role + " volunteers available for " + weeklyEvent.day + " at " + weeklyEvent.time;
                    } else {
                        if (roleAndWEVolunteerIdxes.length < volsNeeded[roleIdx]) {
                            alertText = alertText + "\nNot enough " + role + " volunteers available for " + weeklyEvent.day + " at " + weeklyEvent.time;
                        };

                        // Determine order of volunteers.  
                        //   Those with most constraints (dates to avoid, "with"s, "notWith"s) go first
                        let orderOfVols = fillSlateFcns.getVolOrder(roleAndWEVolunteerIdxes, this.volunteers, weeklyEvent);
                        // console.log("MMS: (after of getVolOrder -- orderOfVols:");  // mms
                        // orderOfVols.forEach(i => {console.log(i + ": " + this.volunteers[i].firstName)});     // mms 

                        // Initialize current volunteer & it's index
                        let orderIdx = 0;
                        let currentVolunteerIdx = orderOfVols[orderIdx];
                        let currentVolunteer = this.volunteers[currentVolunteerIdx];
                        // console.log("MMS: Start with " + currentVolunteer.firstName);  // mms

                        // For each date (ie. 5/10/20, then 5/17/20...)
                        // nthDate is the number of dates completed for this weekly event.
                        //    Need this to see if a volunteer has been assigned fewer dates than others,
                        //    and should be attempted first when volunteer order is determined.
                        // Use "for" rather than "forEach" because this.dates is an array, not an object.
                        // console.log("#### this.dates[we]: ");
                        // console.log(this.dates[we]);
                        // console.log("#### this.dates[we].length: " + this.dates[we].length);
                        for (let nthDate = 0; nthDate < this.dates[we].length; nthDate++) {
                            let date = this.dates[we][nthDate];
                        // this.dates[we].forEach((date, nthDate) => {
                            // console.log("MMS: begin iteration of foreach date in the weekly event.  NEW DATE:  " + date + "nthDate is: " + nthDate + "-------------------");
                            // We will need the dates of the week this date is in.
                            const searchDates = fillSlateFcns.datesThisWeek(date, moment);

                            // For the number of volunteers needed for an individual event for this role
                            //   i.e. The number of people assigned to refreshments for one game
                            //   Loop until enough volunteers are assigned (or you run out of volunteers)

                            // Future release: if can be assigned where there's a WITH volunteer assigned, do that,
                            //      then get next volunteer.  How to keep track of number of volunteers still needed?

                            // No volunteers assigned, yet for this role on this specific date.
                            let numVolsAssignedThisRole = 0;
                            // Keep track of how many times all volunteers checked.  If checked all the volunteers at least once,
                            //   but not all the slots filled, then need to display a warning message.
                            let numTimesCheckVols = 0;

                            // repeat while there are still spots to fill
                            // console.log("before while loop: numVolsAssignedThisRole < volsNeeded[roleIdx]:");
                            // console.log(numVolsAssignedThisRole + " < " + volsNeeded[roleIdx]);
                            while (numVolsAssignedThisRole < volsNeeded[roleIdx]) {
                                // console.log("MMS: ------ Begin while loop iteration ------ ");
                                // console.log("MMS: numVolsAssignedThisRole: " + numVolsAssignedThisRole);

                                if (fillSlateFcns.volCanBeAssigned(currentVolunteer, workingSlate, date, weeklyEvent.time, searchDates, roles, this.volunteers, moment)) {
                                    // console.log("MMS: ****  TRUE  **** in fillSlate, volCanBeAssigned returned   (" + currentVolunteer.firstName + ")");
                                    // [workingSlate, timesEachVolAssigned] = fillSlateFcns.scheduleVolunteer(currentVolunteer, role, date, weeklyEvent.time, workingSlate, timesEachVolAssigned, currentVolunteerIdx);
                                    // Only the number of times a volunteer is assigned changes in this.volunteers (indices are still valid).
                                    [workingSlate, this.volunteers] = fillSlateFcns.scheduleVolunteer(currentVolunteer, role, date, weeklyEvent.time, workingSlate, this.volunteers, currentVolunteerIdx);
                                    // if there is a "with" person listed, plug them in with the "withFlag" on,
                                    //    as potential places to schedule those volunteers
                                    // console.log("MMS: Slate before pencilling in 'with' volunteers");  // MMS
                                    // this.consoleLogSlate(slate); // MMS testing

                                    workingSlate = fillSlateFcns.pencilInWithVolunteers(workingSlate, this.volunteers, currentVolunteerIdx, orderOfVols, date, weeklyEvent.time, searchDates, roles, role, moment);

                                    // console.log("Slate AFTER pencilling in 'with' volunteers"); // MMS
                                    // this.consoleLogSlate(slate); // MMS testing
                                    fillSlateFcns.consoleLogSlate(workingSlate); // MMS test
                                    numVolsAssignedThisRole++;
                                } else { 
                                    // console.log("MMS: **** FALSE **** in fillSlate, volCanBeASsigned returned   (" + currentVolunteer.firstName + ") ");
                                };  // end of else volCanBeAssigned

                                // get next volunteer
                                orderIdx++;
                                // console.log("orderIdx after incrementing: " + orderIdx);

                                // start at first volunteer again, if at the end of the list
                                // console.log("roleAndWEVolunteerIdxes.length:  " + roleAndWEVolunteerIdxes.length);
                                if (orderIdx >= roleAndWEVolunteerIdxes.length) {
                                    // REORDER volunteers (re-do orderOfVols) 
                                    //   so those who didn't get assigned are first, if needed
                                    orderOfVols = fillSlateFcns.adjVolOrder(orderOfVols, this.volunteers, weeklyEvent, volsNeeded[roleIdx], numVolsAvailableForWEandRole, nthDate);
                                    // console.log("BACK in Run Schedule.  orderOfVols: " + orderOfVols);
                                    // orderOfVols.forEach(i => {console.log(i + ": " + this.volunteers[i].firstName)});     // mms 
                                    orderIdx = 0;

                                    // If numTimesCheckVols is 2 (or more), then all the volunteers have been checked at
                                    //  least once, and not enough can be found.
                                    numTimesCheckVols++;

                                    // If all the volunteers have been checked,
                                    //   flag an error, set numVolsAssignedThisRole to those needed to force exiting the loop.
                                    if (numTimesCheckVols > 1) {
                                        alertText = alertText + "\nUnable to fill all " + role + " volunteers for " + weeklyEvent.day + " at " + weeklyEvent.time + " on " + date + ".";
                                        numVolsAssignedThisRole = volsNeeded[roleIdx];
                                    };    

                                };

                                // console.log("AFTER IF in Run Schedule.  orderOfVols: " + orderOfVols);
                                // orderOfVols.forEach(i => console.log(i));     
                                // get the index of the next volunteer from the orderOfVols
                                // for (let i = 0; i < orderOfVols.length; i++) {
                                //     if (orderIdx = i) currentVolunteerIdx = orderOfVols[i];
                                //     console.log("i: " + i);
                                //     console.log("orderIdx: " + orderIdx);
                                //     console.log("currentVolunteerIdx: " + currentVolunteerIdx);
                                // };
                                // console.log("MMS: Length of orderOfVols:  " + orderOfVols.length);
                                currentVolunteerIdx = orderOfVols[orderIdx];
                                // currentVolunteerIdx = orderOfVols[orderIdx];
                                // console.log("MMS: currentVolunteerIdx:  " + currentVolunteerIdx);


                                // get the next volunteer
                                currentVolunteer = this.volunteers[currentVolunteerIdx];
                                // console.log("MMS: Next volunteer - " + currentVolunteer.firstName);

                            };  // end of while numVolsAssignedThisRole < volsNeeded[roleIdx]
                            // MMS testing - what does volunteers look like after first role?
                            // fillSlateFcns.consoleLogVolunteers(this.volunteers);

                        };  // End of each date
                                // console.log("MMS: workingSlate:");
                                // console.log(workingSlate);
                                
                    }; // end of else (no volunteers for this weekly event & role)
                    
                });  // end of each weekly event

            });  //  End of each role

            // Display all alerts at once, if there are any.
            if (alertText.length !== 0) alert(alertText);

            // the withFlag is no longer needed, and may be confusing when displaying/printing
            //   the schedule.  Drop it, and add a space before all volunteers except the first
            //   for each time slot in the slate.
            // The roles are keys in the slate, so we need them.
            workingSlate = fillSlateFcns.dropWithFlag(workingSlate, roles);

            return workingSlate;
        }, // end of fillSlate method




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

 /* for important messages */
.redtext {
    color: red;
    text-emphasis: bold;
}

.schedName {
    text-decoration: underline;
    text-emphasis: bold;
}
</style>
