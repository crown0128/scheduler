module.exports = {

    // MMS For testing...
    consoleLogVolunteers: function(volunteers) {

        console.log("VOLUNTEERS");
        console.log(volunteers);
        volunteers.forEach((volunteer, v) => {
            console.log("----------");
            console.log("Name: " + volunteer.firstName + " " + volunteer.lastName + " (index is " + v + ")");
            console.log("_id:  " + volunteer._id);
            console.log("Email address & image file: " + volunteer.email + "; " + volunteer.image);

            let text = "";
            volunteer.roles.forEach(role => text = text + "  " + role + ";");
            console.log("Roles:" + text);

            text = "";
            volunteer.prefTimes.forEach(prefTime => {
                text = text + "  " + prefTime.day + "/" + prefTime.time + " @ " + prefTime.percentPreferred + ";";
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

            console.log("numTimesAssigned:  " + volunteer.numTimesAssigned);

        });

        console.log("---------- end of VOLUNTEERS --------");
    
    },  // end of function consoleLogVolunteers (for testing purposes)


  // MMS for testing
  consoleLogSlate: function(slate) {
    console.log("@@@@   SLATE   @@@@");
    slate.forEach((event, e) => {
        console.log("    Date: " + event.date + ";  Time:  " + event.time + "; (event " + e + ")");
        Object.keys(event).forEach(role => {
            if ((role !== "date") && ( role !== "time")) {
                for (let person = 0; person < event[role].length; person++) {
                    console.log("        " + role + ":  Name:  " + event[role][person].name + ";  flag:  " + event[role][person].withFlag);
                };
            };
        });
    }); // of forEach line of the slate
  },   // end of function consoleLogSlate (for testing purposes);



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


  // Gets the order of roles or volunteers (descending by the number of constraints),
  // to make assignments for the most difficult ones first.
  // If getting order of volunteers, and some people have been assigned more than others, 
  //    put the ones who have been assigned at the beginning.
  getRolesOrder: function(volunteers, roles) {


    // numberOfConstraintsForEach has the number of dates to avoid, people to 
    //    schedule with, and people to avoid scheduling with.  
    //    Used to determine order, assigning volunteers for the most difficult first.
    //    (Difficult being the role with the most constraints)
    //    Length = length of roles when getting the order for roles,
    //          and length of volunteers when getting the order for volunteers.
    //    Initialize with an array of 0s.
    let numberOfConstraintsForEach = [];
    const max = roles.length;
    for (let i = 0; i < max; i++) numberOfConstraintsForEach.push(0);

    // Add the numberOfConstraintsForEach to each role or volunteer
    //   as it is found while going through the volunteers 
    //   (since that information is stored with the volunteers)
    volunteers.forEach((volunteer, v) => {
        roles.forEach((role, r) => {   
          if (volunteer.roles.includes(role)) {

            // note: index is r; one for each role
            numberOfConstraintsForEach[r] = numberOfConstraintsForEach[r] +
              volunteer.notAvailable.length +
              volunteer.with.length +
              volunteer.notWith.length;
          }; // end of if role in volunteer.roles
        });  // end of for each role
    });  // end of for each volunteer

    let constraintsWithIndex = [];
    // for (let cnt in numberOfConstraintsForEach) {
    for (let cnt = 0; cnt < numberOfConstraintsForEach.length; cnt++) {
        constraintsWithIndex.push([numberOfConstraintsForEach[cnt], cnt]);
    };
    constraintsWithIndex.sort((left, right) => {
        return left[0] > right[0] ? -1 : 1;
    });


    let order = [];
    // for (let idx in constraintsWithIndex) {
    for (let idx = 0; idx < constraintsWithIndex.length; idx++) {
      order.push(constraintsWithIndex[idx][1]);
    }

    // console.log("MMS: order:");
    // console.log(order);

    return order;
  },  // end of function getRolesOrder


  // Gets the order of roles or volunteers (descending by the number of constraints),
  // to make assignments for the most difficult ones first.
  // If getting order of volunteers, and some people have been assigned more than others, 
  //    put the ones who have been assigned at the beginning.
  getVolOrder: function(volunteerIdxes, volunteers, weeklyEvent) {

    // from   https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    // shuffles an array
    function shuffle(array) {
        var currentIdx = array.length, tempValue, randomIdx;
        // console.log("MMS (shuffle): currentIdx:  " + currentIdx);

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
    volunteerIdxes = shuffle(volunteerIdxes);
    // volunteerIdxes.forEach(idx => {
    //     console.log(idx + ":  " + volunteers[idx].firstName);
    // });

    // numberOfConstraintsForEach has the number of dates to avoid, people to 
    //    schedule with, and people to avoid scheduling with.  
    //    Used to determine order, assigning volunteers for the most difficult first.
    //    (Difficult being the role with the most constraints)
    //    Length = length of roles when getting the order for roles,
    //          and length of volunteers when getting the order for volunteers.
    //    Initialize with an array of 0s.
    let numberOfConstraintsForEach = [];
    const numVols = volunteerIdxes.length;
    for (let i = 0; i < numVols; i++) numberOfConstraintsForEach.push(0);

    // Add the numberOfConstraintsForEach to each role or volunteer
    //   as it is found while going through the volunteers 
    //   (since that information is stored with the volunteers)
    volunteerIdxes.forEach((idx, v) => {
        // weekly event day of week and time must also match
        let times = [];
        volunteers[idx].prefTimes.forEach(prefTime => times.push(prefTime.day + prefTime.time) );
        if ( times.includes(weeklyEvent.day + weeklyEvent.time)) {
        // note: index is v; one for each volunteer (heavily weight "with").
        //   Gets re-adjusted after first time through all available volunteers.
        numberOfConstraintsForEach[v] = numberOfConstraintsForEach[v] +
            volunteers[idx].notAvailable.length +
            (volunteers[idx].with.length * 5) +
            volunteers[idx].notWith.length;
        };
    });  // end of for each volunteer

    // set up constraintsWithIndex; used to order the volunteers
    let constraintsWithIndex = [];
    for (let cnt in numberOfConstraintsForEach) {
        constraintsWithIndex.push([numberOfConstraintsForEach[cnt], volunteerIdxes[cnt]]);
    };
    constraintsWithIndex.sort((left, right) => {
        return left[0] > right[0] ? -1 : 1;
    });

    let order = [];
    for (let idx in constraintsWithIndex) {
      order.push(constraintsWithIndex[idx][1]);
    }; // end of for each idx in constraintsWithIndex

    return order;
    
},  // end of function getVolOrder



  // put volunteers who have been assigned fewer times at the beginning.
  adjVolOrder: function(orderedIdxes, volunteers, weeklyEvent, numVolsNeededPerDate, numVolsAvailableForWEandRole, datesDone) {
    // console.log("BEGIN adjVolOrder: " + orderedIdxes); // mms
    // If just one volunteer, no need to look at order
    if (orderedIdxes.length === 1) return orderedIdxes;

    // If no constraints - (with, notWith, notAvailable), mixing up the order can result in
    //    some volunteers being assigned more than others, so don't change.
    // For each volunteer available...
    let numVolunteersWithConstraints = 0;
    orderedIdxes.forEach(index => {
        // ... add the number of volunteers to look to schedule with, and...
        numVolunteersWithConstraints += volunteers[index].with.length 
        // ... add the number of volunteers to look to AVOID scheduling with, and...
            + volunteers[index].notWith.length 
        // ... add the number of dates not available.
            + volunteers[index].notAvailable.length;
    });
    // If there are no constraints, return without changing the order.
    if (numVolunteersWithConstraints === 0) return orderedIdxes;

    // Now, put volunteers who haven't been assigned their fair share
    //   at the beginning of order, so they are attempted first.
    // Everyone should be assigned the total number of slots so far / available volunteers.

    
    // Get the number of available volunteers (this could be a fraction, if a volunteer is available
    //   for more than one role or more than one weekly event - when that's implemented)
    // While doing this loop, save the percentPreferred...we'll need this a few lines down.
    let availVols = 0;
    let percentPref = [];  // one for each volunteerIdxes
    orderedIdxes.forEach(idx => {
        volunteers[idx].prefTimes.forEach(prefTime => {
            if ((prefTime.day === weeklyEvent.day) && (prefTime.time === weeklyEvent.time)) {
                availVols = availVols + (prefTime.percentPreferred);
            };
            percentPref.push(prefTime.percentPreferred);
        });
    });
    // console.log("MMS: availVols for " + weeklyEvent.day + "; " + weeklyEvent.time + " is:  " + availVols);
    
    // Number of spots filled so far is the number of dates completed * the number of volunteers in each of those spots.
    const numSpotsSoFar = datesDone * numVolsNeededPerDate;
    // console.log("MMS: datesDone: " + datesDone);
    // console.log("MMS: numVolsNeededPerDate:  " + numVolsNeededPerDate);
    // console.log("MMS: numSpotsSoFar:  " + numSpotsSoFar + " (datesDone * numVolsNeed...)");

    // targetNumAssignments is the number of times each volunteer should be assigned so far.
    // Everyone should be close to (thus, truncating) the number of spots so far/available people
    // This might not happen, yet, if there were constraints that prevented it 
    //    i.e. they haven't been available for enough dates, yet
    const targetNumAssignments = Math.trunc(numSpotsSoFar/numVolsAvailableForWEandRole);
    // console.log("MMS: numVolsAvailableForWEandRole: " + numVolsAvailableForWEandRole);
    // console.log("MMS: targetNumAssignments:  " + targetNumAssignments + " (trunc: numSpots... / volsAvail...)");

    const orderCopy = [...orderedIdxes];
    // console.log("MMS: orderedIdxes (in adjVolOrder)");
    // console.log(orderedIdxes);
    // console.log("MMS: orderCopy (in adjVolOrder)");
    // console.log(orderCopy);

    let idx;
    // orderedIdxes.forEach((idx,i) => {
    for (let i = 0; i < orderedIdxes.length; i++) {
        // If the volunteer hasn't been assigned the expected number of times, put them at the beginning of the order

        // console.log("MMS: volunteers[idx].numTimesAssigned < (targetNumAssignments * percentPref[i]))   ...");
        // console.log(" i: " + i);
        // console.log(" orderedIdxes[i]  (idx): " + orderedIdxes[i]);
        idx = orderedIdxes[i];
        // console.log("  volunteers[idx].firstName:  " + volunteers[idx].firstName);
        // console.log("  volunteers[idx].numTimesAssigned: " + volunteers[idx].numTimesAssigned);
        // console.log("  targetNumAssignments:  " + targetNumAssignments);
        // console.log("  percentPref[i]:  " + percentPref[i]);

        if (volunteers[idx].numTimesAssigned < (targetNumAssignments * percentPref[i])) {
            // console.log("  TRUE - moving " + idx + " to beginning");  // mms
            // Remove one element from position i (should have a value of idx).
            orderCopy.splice(i, 1);
            // Remove 0 elements, then insert idx in position 0 (at beginning).
            orderCopy.splice(0, 0, idx);
        };
    };  // end of forEach idx in orderedIdxes
    // console.log("After putting lesser scheduled first (adjVolOrder): " + orderCopy); // mms

    // console.log("Length of orderedIdxes " + orderedIdxes.length);
    // orderedIdxes.forEach(x => console.log(x + "; "));

    // console.log("Length of orderCopy " + orderCopy.length);
    // orderCopy.forEach(x => console.log(x + "; "));

    // console.log("MMS: - after putting skipped volunteers first:");
    // console.log("MMS: orderedIdxes (in adjVolOrder)");
    // console.log(orderedIdxes);
    // console.log("MMS: orderCopy (in adjVolOrder)");
    // console.log(orderCopy);

    // orderCopy.forEach(idx => {
    //     orderedIdxes[idx] = orderCopy[idx];
    // });
    // for (let idx = 0; idx < orderCopy.length; idx++) {
    //     orderedIdxes[idx] = orderCopy[idx];
    // };

    // console.log("MMS: returning - orderedIdxes (in adjVolOrder)");
    // console.log(orderedIdxes);

    return orderCopy;
},  // end of function adjVolOrder



getRoleAndWEVolunteerIdxes: function(volunteers, role, weeklyEvent) {

    // console.log("MMS (getRoleAndWEVolunteerIdxes) Role: " + role);
    // console.log("MMS (getRoleAndWEVolunteerIdxes) weeklyEvent: " + weeklyEvent.day + "; " + weeklyEvent.time);

    // currDayTime is the day/time for the weeklyEvent currently being worked with
    const currDayTime = weeklyEvent.day + weeklyEvent.time;

    // push the index for each volunteer available for this day/time and role
    let roleAndWEVolunteerIdxes = [];
    // numVolsAvailableForWEandRole starts at 0; add each volunteer (can be a fraction)
    //    as you find volunteers available for this weekly event and role
    let numVolsAvailableForWEandRole = 0;

    // check each volunteer to see if they are available this day of week & time, 
    //   and for this role
    // Didn't use filter, because we need the indicies, not a subset of the volunteers array
    volunteers.forEach((volunteer, v) => {
        // get all the day/time (weekly events) this volunteer is available for 
        let volDayTime = [];
        volunteer.prefTimes.forEach(prefTime => volDayTime.push(prefTime.day + prefTime.time));

        // if the volunteer is available for this day/time (Weekly event), and this role
        if (volDayTime.includes(currDayTime) && volunteer.roles.includes(role)) {
            // then add the index for this volunteer to roleAndWEVolunteerIdxes array
            roleAndWEVolunteerIdxes.push(v);
            // and add to numVolsAvailableForWEandRole (proportional to # roles)
            numVolsAvailableForWEandRole = numVolsAvailableForWEandRole + (1/volunteer.roles.length);
        };  // end of if day/time included and role included
    });  // end of for each volunteer

    // console.log("MMS in getRoleAndWEVolunteerIdxes:");
    // roleAndWEVolunteerIdxes.forEach(idx => console.log(idx)); // MMS testing

    return [roleAndWEVolunteerIdxes, numVolsAvailableForWEandRole];
},  // end of function getRoleAndWEVolunteerIdxes


// given a date, returns an array of all dates in that week.
// assumes Monday is the first day of the week
datesThisWeek: function(date, moment) {
    // Get all dates for this week.  Week begins on Monday.  Find first day of the week,
    //    then build array of dates to search.

    // day is the next day to add to the array
    let day;

    // searchDate is the date passed in (date) in the format needed.
    const searchDate = moment(date).format("YYYY-MM-DD");
    
    // get the date of the Monday of the week "date" is in.
    // moment returns a Sunday for the start of the week, we need a Monday,
    // so add one day to the Sunday returned to get Monday
    //   If "date" is a Sunday, use Saturday so moment returns the previous Sunday,
    //   and adding one day gets the previous Monday (rather than the next day)
    if (moment(date).format("ddd") === "Sun") {
        day = moment(date).add(-1,"days").startOf("week").add(1,"days").format("YYYY-MM-DD");
    } else {
        day = moment(date).startOf("week").add(1,"days").format("YYYY-MM-DD");
    };

    // push the day found, plus the next 6 days (7 total) to get the whole week.
    let datesThisWeek = [];
    for (let i = 0; i < 7; i++) {
        datesThisWeek.push(day);
        day = moment(day).add(1,"days").format("YYYY-MM-DD");
    };

    return datesThisWeek;
}, // end of function datesThisWeek


// checks - 
//      Available this date (don't need - already filtered out)
//      Available this role (don't need - already filtered out)
//      Not already assigned this weekend
//      No notWith people already assigned (can't be assigned if someone they can't serve with
//          has already been assigned)
//      Available this date
volCanBeAssigned: function(volunteer, slate, date, time, searchDates, roles, volunteers, moment) {
// returns TRUE if ok to schedule this volunteer
    // console.log(" ");
    // console.log(" ");
    // console.log("$$$ MMS: In volCanBeAssigned - findName $$$");
    // console.log("$$$ MMS: volunteer.firstName:  " + volunteer.firstName);

    function findNameInSlate(name, subSlate, roles) {
        // The name hasn't been found, yet.
        let found = false;

        // Get elements with the names
        let resultsNameSearch;
        // console.log("$$$ MMS: In findNameInSlate (in volCanBeAssigned)");     // mms
        // console.log("$$$ MMS: name: " + name);     // mms
        // console.log("$$$ MMS: subSlate: ");     // mms
        // subSlate.forEach(x => console.log(x));     // mms
        // console.log("$$$ MMS: roles: ");     // mms
        // roles.forEach(role => console.log(role));     // mms

        // for each event in the part of the slate passed in,
        //    look for the given name in each role
        // LEFT OFF - (just needs fixing for performance) ...                // MMS - did I do that??
        //   ...if this volunteer isn't this role, no need to check everything!
        for (let subSlateIdx = 0; subSlateIdx < subSlate.length; subSlateIdx++) {
            let thisOneEventSlate = subSlate[subSlateIdx];
            // console.log("$$$$$$$$$$$ new subSlate");     // mms
            // console.log("subSlateIdx: " + subSlateIdx);     // mms
            // console.log("subSlate: ");     // mms
            // subSlate.forEach(x => console.log(x));     // mms

            // For each role, look for the given name
            for (let rolesIdx = 0; rolesIdx < roles.length; rolesIdx++) {
                let role = roles[rolesIdx];

                // Get volunters to search from thisOneEventSlate (leaving out withFlag)
                let volunteers = thisOneEventSlate[role].map(vol => {if (!vol.withFlag) {return vol.name};});

                // Is name in the current part of the slate for this role?
                resultsNameSearch = volunteers.includes(name);

                // console.log("$$$$$$$$$$$$$$$$$$$$$$ just in for each roles $$$$$$$$$$");
                // console.log("@@@ MMM: resultsNameSearch: " + resultsNameSearch);
                // console.log("$$$ MMS: subSlateIdx: " + subSlateIdx);
                // console.log("$$$ MMS: thisOneEventSlate:  " + thisOneEventSlate);
                // console.log("$$$ MMS: thisOneEventSlate.date:  " + thisOneEventSlate.date);
                // console.log("$$$ MMS: thisOneEventSlate.time:  " + thisOneEventSlate.time);
                // console.log("$$$ MMS: thisOneEventSlate[" + role + "]:  " + thisOneEventSlate[role]);
                // console.log("$$$ MMS: thisOneEventSlate[" + role + "].length:  " + thisOneEventSlate[role].length);
                // thisOneEventSlate[role].forEach(x => console.log(x));  // mms
                // console.log("$$$ MMS: role:  " + role);
                // console.log("$$$ MMS: name:  " + name);
                // console.log("$$$ MMS: resultsNameSearch:  " + resultsNameSearch);
                // if at least one name is found, set found to true and exit for loop
                if (resultsNameSearch != false) {
                    found = true;
                    rolesIdx = roles.length; // force loop to end
                };
                // console.log("$$$ MMS: found: " + found);
            };  // of for each role

            // no need to continue searching in other roles if the name has been found
            // if (found) console.log(name + " already in slate."); // mms
            if (found) break;
            if (found) console.log("ERROR ERROR ERROR ERROR  this should never console.log!!");

        };  // of for subSlateIdx 0 to length of subSlate (each event in subSlate)
        
        return found;
    };  // end of function findNameInSlate (defined in function volCanBeAssigned)


    // NOT ALREADY ASSIGNED THIS WEEKEND
    // Check to make sure this volunteer isn't already assigned another role this weekend.
    function checkAlreadyAssigned(volunteer, slate, dates, roles) {
        // to be returned. True if already assigned, false otherwise
        let isAlreadyAssigned;  

        // A volunteer should only be scheduled once per recurring event.  
        // This section looks for the given volunteer in the schedule for the given dates.
        
        // Name to search for
        const searchName = volunteer.firstName + " " + volunteer.lastName;
        // console.log("$$$ MMS: searchName: " + searchName);

        // Get part of slate for this set of dates (this week)
        let thisWeekSlate = slate.filter(event => dates.includes(event.date));
        // console.log("$$$ MMS:  ============ THIS WEEK SLATE (MMS) ============");
        // thisWeekSlate.forEach(x => {  // mms
            // console.log(x);        // mms
            // console.log(x.date);   // mms
            // console.log(x.time);   // mms
            // x.EM.forEach(y => console.log(y));  // mms
        // });  // mms

        // findNameInSlate returns true if the given name is found in the part of the slate passed in.
        let isNameInSlate;
        isNameInSlate = findNameInSlate(searchName, thisWeekSlate, roles);
        // console.log("isNameInSlate: " + isNameInSlate); // MMS
        // if (isNameInSlate) console.log(volunteer.firstName + " is already in assigned.");

        // if found, then volunteer is already scheduled this week, and can't be scheduled again.
        isAlreadyAssigned = isNameInSlate;        

        return isAlreadyAssigned;
    };  // end of function checkAlreadyAssigned (defined in function volCanBeAssigned)


    // NO NOTWITH PEOPLE ALREADY ASSIGNED
    // (can't be assigned if someone they can't serve with has already been assigned)
    // Returns TRUE if there IS a conflict
    function isNotwithConflict(volunteer, slate, date, time) {

        // Assume there's no volunteer conflict, until one is found
        let isConflict = false;

        // There may be more than one "notWith", so get all the notWith names, and search for each one
        // Get names to be searched
        let notWithNames = [];
        let foundVol;
        volunteer.notWith.forEach(volId => {
            foundVol = volunteers.filter(vol => vol._id === volId);
            // foundVol.forEach(x => console.log(JSON.parse(JSON.stringify(x))));
            notWithNames.push(foundVol[0].firstName + " " + foundVol[0].lastName);
        });


        // Only need to search this specific event.
        // const thisDateSlate = thisWeekSlate.filter(event => (event.date === date) && (event.time === time));
        const thisDateSlate = slate.filter(event => (event.date === date) && (event.time === time));

        // Search for each name.  If found, this volunteer can't be scheduled here. Return false.
        notWithNames.forEach(name => {
            const isNameInSubSlate = findNameInSlate(name, thisDateSlate, roles); 
            // if (isNameInSubSlate) console.log(name + " has a notWith conflict.");  // mms
            if (isNameInSubSlate) return isConflict = true;
        })

        return isConflict;  // will be false if we get here - no conflicts found
    };  // end of function isNotwithConflict (defined in function volCanBeAssigned)


    // AVAILABLE THIS DATE
    // volunteer is NOT available if the date is found 
    function isVolunteerAvailable(volunteer, date) {
        // Assume the volunteer is available, unless found otherwise
        let volAvail = true;

        // This is the date we're trying to fill
        // console.log("@@@ MMS: date: " + date);
        // console.log("@@@ MMS: volunteer.firstName: " + volunteer.firstName);


        // Build an array of all the dates the volunteer is NOT available
        let volNotAvailable = [];
        // volunteer.notAvailable.forEach((notAvailDate,x) => {
        for (let x = 0; x < volunteer.notAvailable.length; x++) {
            const notAvailDate = volunteer.notAvailable[x];
            volNotAvailable.push(notAvailDate);
            // console.log("@@@ MMS: notAvailable " + x + ":  " + notAvailDate);
        };

        // console.log("@@@ MMS: volNotAvailable.length:  " + volNotAvailable.length);
        // console.log("@@@ MMS: volNotAvailable:");
        // volNotAvailable.forEach(x => console.log(x));

        // if the date/time is found in the dates the volunteer is not available,
        //   then the volunteer is not available
        if (volNotAvailable.includes(date)) {
            volAvail = false;
        };
            
        // if (!volAvail) console.log(volunteer.firstName + " is not available on this date.");  // mms

        // volAvail is true if the volunteer is available to serve this date.
        return volAvail;
    };  // end of function isVolunteerAvailable (defined in function volCanBeAssigned)

    // Will be true if the volunteer is a good match for this position; 
    //   false otherwise.
    let canBeAssigned;

    // NOT ALREADY ASSIGNED THIS WEEKEND
    // checkALreadyAssigned returns true if a volunteer has already been assigned a role this date
    // if one is found, volunteer can't be assigned, returns false in canBeAssigned
    canBeAssigned = !checkAlreadyAssigned(volunteer, slate, searchDates, roles);
    // console.log("$$$ MMS: after checkAlreadyAssigned, canBeAssigned: " + canBeAssigned);
    if (!canBeAssigned) return canBeAssigned;  // no need to continue...

    // NO NOTWITH PEOPLE ALREADY ASSIGNED
    // (can't be assigned if someone they can't serve with has already been assigned)
    // isNotwithConflict returns true if there IS a conflict with the current volunteer
    //    being assigned with another volunteer they can't serve with.
    // If this happens, volunteer can't be assigned, returns false in canBeAssigned
    canBeAssigned = !isNotwithConflict(volunteer, slate, date, time);
    // console.log("$$$ MMS: after isNotwithConflict, canBeAssigned: " + canBeAssigned);
    if (!canBeAssigned) return canBeAssigned;  // no need to continue...

    // AVAILABLE THIS DATE
    // isVolunteerAvailable returns true if the volunteer is available then
    canBeAssigned = isVolunteerAvailable(volunteer, date); // to be defined
    // console.log("$$$ MMS: after isVolunteerAvailable, canBeAssigned: " + canBeAssigned);

    // return whether the volunteer met all the criteria to be assigned at this date/time
    //   in this role
    return canBeAssigned;
},  // end of volCanBeAssigned function


// assign volunteer a spot (put in slate),
//   and "pencil in" (put in schedul with withFlag on) possible "with" volunteers
//    -- If this volunteer scheduled has "with" volunteers noted, pencil them in where they might be able to be scheduled.
scheduleVolunteer: function(volunteer, role, date, time, slate, volunteers, currentVolunteerIdx) {

    // where to update the assignment in the array (which object)
    const timeDateIndex = slate.findIndex(timeDate => 
        timeDate.date === date && timeDate.time === time
    );

    // get volunteer name
    let volunteerName = volunteer.firstName.concat(" ", volunteer.lastName);

    // push the assignment.
    // withFlag is used when "penciling in" a volunteer that might be assigned
    //   based on another volunteer's assignment (when they are supposed to be scheduled together)
    slate[timeDateIndex][role].push({
        name: volunteerName,
        withFlag: false
    });

    // increment the number of times this volunteer has been scheduled.
    volunteers[currentVolunteerIdx].numTimesAssigned++;

    return [slate, volunteers];
},  // of scheduleVolunteer function



// "Pencil in" "with" volunteers.
pencilInWithVolunteers: function(slate, volunteers, currentVolunteerIdx, volIdxes, date, time, searchDates, roles, role, moment) {
    // Is there any with volunteers?  If not, return
    // If there are, findWithVolunteers returns the indices of those volunteers
    // const withVolIds = this.findWithVolunteers(currentVolunteerIdx, volunteers);
    const withVolIds = volunteers[currentVolunteerIdx].with;
    console.log("withVolIds for " + volunteers[currentVolunteerIdx].firstName + ":");
    console.log(withVolIds);
    console.log("Length of withVolIds: " + withVolIds.length);

    // if (withVolIds.length === 0) return slate;

    // for each vol found...
    withVolIds.forEach(volId => {
        console.log("volId (looking for): " + volId);
        let found = false, id = 0, volIdx;
        // get volunteer index into volunteers for that volunteer
        // for (let id = 0; id < volIdxes.length; id++) {
        while ((!found) && id < volIdxes.length) {
            console.log("--- id: " + id);
            console.log("--- volunteers[id].firstName: " + volunteers[id].firstName);
            console.log("--- volunteers[id]._id: " + volunteers[id]._id);
            
            if (volunteers[id]._id === volId) {
                console.log("Found! " + id);
                found = true;
                volIdx = id;
            };

            id++;
        };

        console.log("after 'while'; volIdx: " + volIdx + "; ");
        console.log("volunteer name: " + volunteers[volIdx].firstName);
        // if that volunteer could be assigned
        if (this.volCanBeAssigned(volunteers[volIdx], slate, date, time, searchDates, roles, volunteers, moment)) {
            console.log("Volunteer " + volunteers[volIdx].firstName + " can be assigned.");
            // then pencil in (put in slate with flag)

            // where to update the assignment in the array (which object)
            const timeDateIndex = slate.findIndex(timeDate => 
                timeDate.date === date && timeDate.time === time
            );

            // get volunteer name
            let volunteerName = volunteers[volIdx].firstName.concat(" ", volunteers[volIdx].lastName);

            // push the assignment.
            // withFlag is used when "penciling in" a volunteer that might be assigned
            //   based on another volunteer's assignment (when they are supposed to be scheduled together)
            slate[timeDateIndex][role].push({
                name: volunteerName,
                withFlag: true
            });

        };

    });

    return slate;
    // i/0;// mms
},  // of pencilInWithVolunteers function



// the withFlag is no longer needed, and may be confusing when displaying/printing
//   the schedule.  Drop it, and add a space before all volunteers except the first
//   for each time slot in the slate.
// The roles are keys in the slate, so we need them.

dropWithFlag: function(slate, roles) {

    // For each "line" (volunteer assignments for one date/time event - one line of the displayed slate)...
    slate.forEach(lineOfSlate => {
        // and for each role in that line,
        // replace the object for each volunteer (with "name" and "withFlag" keys) with
        //    a string with the volunteer's name (appended with a space if it's not the first)
        roles.forEach(role => {
            let volunteers = [];

            // build the array of volunteers without the withFlag,
            //   dropping those with the flag, as well as the flag itself for everyone,
            //   and appending a space before all volunteers but the first
            //   (commas get appended after the names automatically later when the table is built to display)
            lineOfSlate[role].forEach((volunteer, v) => {
                if (!volunteer.withFlag) {
                    if (v === 0) {
                        volunteers.push(volunteer.name)
                    } else {
                        volunteers.push(" " + volunteer.name)
                    };
                };
            });

            // replace old list of volunteers (were objects with withFlag) with
            //  simple array of volunteer names (with spaces appended to all but the first name)
            lineOfSlate[role] = volunteers;
        });
    });
    
    return slate;
}  // end of dropWithFlag function


};