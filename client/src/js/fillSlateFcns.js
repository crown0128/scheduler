module.exports = {

    // MMS For testing...
    consoleLogVolunteers: function(volunteers) {

        console.log("VOLUNTEERS");
        console.log("----------");
        //  // code goes here
        volunteers.forEach(volunteer => {
            console.log("Name: " + volunteer.firstName + " " + volunteer.lastName);
            console.log("Email address & image file: " + volunteer.email + "; " + volunteer.image);

            let text = "";
            volunteer.roles.forEach(role => text = text + "  " + role + ";");
            console.log("Roles:" + text);

            text = "";
            volunteer.prefTimes.forEach(prefTime => {
                text = text + "  " + prefTime.day + "/" + prefTime.time + " @ " + prefTime.percentPreferred + "%;";
            });
            console.log("Preferred times:" + text);

            text = "";
            volunteer.notAvailable.forEach(notAvail => text = text + "  " + notAvail + ";");
            console.log("notAvailable:" + text);

            text = "";
            volunteer.with.forEach(w => text = text + "  " + w + ";");
            console.log("with:" + text);

            text = "";
            volunteer.notWith.forEach(nw => text = text + "  " + nw + ";");
            console.log("notWith:" + text);

        });
    
    },


  // Get the actual dates for each of the weekly events in the schedule:
  //  If there are two weekly events, Sat and Mon, from May 1 to May 17, GetDates returns eventDates:
  //  eventDates = [   ["2020-05-02", "2020-05-09", "2020-05-16"],  // the Saturday dates
  //               ["2020-05-04", "2020-05-11"] ]               // the Wednesday dates
  getDates: function(schedule, moment) {
    // get beginning and end dates of the schedule range
    const begin = moment(schedule.startDate).format("YYYY-MM-DD");
    const end = moment(schedule.endDate).format("YYYY-MM-DD");

    // get the days of the week (stored in "schedule" as words) for each recurring event
    const daysWord = schedule.weeklyEvents.map(weeklyEvent => {
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
  },  // end of function getDates
  



  // starts the slate array of objects with dates and roles.
  // volunteer assignments to be filled in later
  buildSkeleton: function(dates, roles, weeklyEvents, moment) {
    
    function NewObject(date, time) {
        this.date = date;
        this.time = time;
    };

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
  },  // end of function buildSkeleton


  // gets the order of roles or volunteers (descending by the number of constraints),
  // to make assignments for the most difficult ones first.
  getOrder: function(volunteers, roles, type, weeklyEvent) {

    // from   https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    // shuffles an array
    function shuffle(array) {
        var currentIdx = array.length, tempValue, randomIdx;

        // While there remain elements to shuffle...
        while (0 !== currentIdx) {

            // Pick a remaining element...
            randomIdx = Math.floor(Math.random() * currentIdx);
            currentIdx -= 1;

            // And swap it with the current element.
            tempValue = array[currentIdx];
            array[currentIdx] = array[randomIdx];
            array[randomIdx] = tempValue;
        }
            return array;
    };  // end of shuffle function

    // shuffle volunteers, so first ones assigned are not always the same (when the constraints are the same)
    if (type === "volunteers") volunteers = shuffle(volunteers);

    // numberOfConstraintsForEach has the number of dates to avoid, people to 
    //    schedule with, and people to avoid scheduling with.  
    //    Used to determine order, assigning volunteers for the most difficult first.
    //    (Difficult being the role with the most constraints)
    //    Length = length of roles when getting the order for roles,
    //          and length of volunteers when getting the order for volunteers.
    //    Initialize with an array of 0s.
    let numberOfConstraintsForEach = [];
    const max = (type === "roles") ? roles.length : volunteers.length;
    for (let i = 0; i < max; i++) numberOfConstraintsForEach.push(0);

    // Add the numberOfConstraintsForEach to each role or volunteer
    //   as it is found while going through the volunteers 
    //   (since that information is stored with the volunteers)
    volunteers.forEach((volunteer, v) => {
        roles.forEach((role, r) => {   // only one role if doing volunteers
          if (volunteer.roles.includes(role)) {
            if (type === "roles") {
            // note: index is r; one for each role
            numberOfConstraintsForEach[r] = numberOfConstraintsForEach[r] +
              volunteer.notAvailable.length +
              volunteer.with.length +
              volunteer.notWith.length;
            } else {   // type is volunteers
              // weekly event day of week and time must also match
              let times = [];
              volunteer.prefTimes.forEach(prefTime => times.push(prefTime.day + prefTime.time) );
              if ( times.includes(weeklyEvent.day + weeklyEvent.time)) {
                // note: index is v; one for each volunteer
                numberOfConstraintsForEach[v] = numberOfConstraintsForEach[v] +
                    volunteer.notAvailable.length +
                    volunteer.with.length +
                    volunteer.notWith.length;
              };
            };  // end of if else type is volunteers
          }; // end of if role in volunteer.roles
        });  // end of for each role
    });  // end of for each volunteer

    // Now we have a list of the constraints for each role or volunteer, we need to build
    // an array of indices to determine the order of the roles or volunteers.
    // The variable order lists the indices of the roles or volunteers in the order they will
    //    have volunteers assignments done (length = length of roles or volunteers)
    let constraints_with_index = [];
    for (let cnt in numberOfConstraintsForEach) {
        constraints_with_index.push([numberOfConstraintsForEach[cnt], cnt]);
    }
    constraints_with_index.sort((left, right) => {
    return left[0] > right[0] ? -1 : 1;
    });

    let order = [];
    for (let idx in constraints_with_index) {
      order.push(constraints_with_index[idx][1]);
    }

    return order;
},  // end of function getOrder



getRoleAndWEVolunteers: function(volunteers, role, weeklyEvent) {

    // currDayTime is the day/time for the weeklyEvent currently being worked with
    const currDayTime = weeklyEvent.day + weeklyEvent.time;

    // filter the volunteers available for this day/time and role
    let RoleAndWEVolunteers = 
        volunteers.filter(volunteer => {
            // get the day/times this volunteer is available for

            // volDayTime will hold the day/times a particular volunteer is available for
            let volDayTime = [];
            volunteer.prefTimes.forEach(prefTime => volDayTime.push(prefTime.day + prefTime.time) );

            // day/time needed must be in volunteers available day/time; and
            // role needed must be in volunteers available roles
            return volDayTime.includes(currDayTime) && volunteer.roles.includes(role);
        });
    return RoleAndWEVolunteers;
},  // end of function getRoleAndWEVolunteers


volCanBeAssigned: function(volunteer, slate) {
    console.log("MMS - in volCanBeAssigned");
    console.log("MMS: volunteer.firstName: " + volunteer.firstName);
    console.log("MMS: always returns TRUE, for now.");
// returns TRUE if ok to schedule this volunteer
// 

    // LEFT OFF HERE     all dates of first we for the first role gets assigned ok.

// checks - 
//      Available this date (don't need - already filtered out)
//      Available this role (don't need - already filtered out)
//      Not already assigned this weekend
//      No notWith people already assigned
    var canBeAssigned = true;
 
    return canBeAssigned;
},  // end of volCanBeAssigned function


// scheduleVolunteer: function(volunteer, r, roles, volsNeeded, date, time, slate) {
scheduleVolunteer: function(volunteer, role, date, time, slate) {
    // assign volunteer a spot (put in slate)

    // where to update the assignment in the array (which object)
    const timeDateIndex = slate.findIndex(timeDate => 
        timeDate.date === date && timeDate.time === time
    );

    // get volunteer name
    let volunteerName = volunteer.firstName.concat(" ", volunteer.lastName);

    // push the assignment.
    // put a space before the name if it's not the first. Comma's get added automatically.
    if (slate[timeDateIndex][role].length > 0) {
        volunteerName = " " + volunteerName;
    };
    slate[timeDateIndex][role].push(volunteerName);

    // // get the datesFilled for this role; it will be an array of dates.
    // let datesFilled = datesFilledPerRole[r];

    // volunteersScheduled is the number of volunteers in this slot
    //    (for this role, on this date, in this weekly event)
    // const volunteersScheduled = workingSlate[timeDateIndex][role].length;

    // // if the number of people scheduled is at least the number needed (volsNeeded),
    // //   then add this date to the datesFilled array
    // if (volunteersScheduled >= volsNeeded[r]) { datesFilled.push(date) };

    return slate;
},  // of schedule volunteer


//   examplefcn: function(parameters) {

//  // code goes here
 
//     return stuff;
//   },

//   examplefcn: function(parameters) {

//  // code goes here
 
//     return stuff;
//   },


  


};