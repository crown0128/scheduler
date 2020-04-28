module.exports = {


  // extract volunteer names from volunteers to display in component
  getVolunteerNames: function(volunteers) {
    let volunteerNames = [];
      volunteers.forEach((volunteer) => {
        const newVol = {
          id: volunteer._id,
          name: volunteer.firstName + " " + volunteer.lastName
        };
        volunteerNames.push(newVol);
      });  // end of forEach volunteer
      return volunteerNames;
    },
  



  getRolesAndTimeSlots: function(schedules, roles) {

    let timeSlots = [];

    // Get all role names from schedules, remove dups & alphabetize
    schedules.forEach((schedule, index) => {
      roles[index] = schedule.roles;
      roles[index] = roles[index].map(role => role.roleName);
    });

    // flatten array, so only one level deep
    roles = [].concat.apply([], roles);
    // remove duplicates
    roles = roles.filter((a, b) => roles.indexOf(a) === b);
    // sort the array
    roles = roles.sort();
    
    let nth = 0;
    // Get all time slots from schedules
    schedules.forEach((schedule, index) => {
      schedule.weeklyEvents.forEach((weeklyEvent, i) => {
        const slot = {
          index: nth++,
          scheduleName: schedule.name, 
          day: weeklyEvent.day,
          time: weeklyEvent.time
        };

        // Add the slot to the timeSlots array (or initiate it, if the first one)
        if (timeSlots.length === 0) {
          timeSlots = [slot]
        } else {
          timeSlots.push(slot);
        };
      });

    });

    // remove duplicate day/time combinations in timeslots
    timeSlots = timeSlots.filter((timeSlot, index, self) => 
      index === self.findIndex((t) => (
        t.day === timeSlot.day && t.time === timeSlot.time
      ))
    );
 
    return [roles, timeSlots];
  },


//   handleReturnToVolunteerList: function(){
//     return;
//   }

};
