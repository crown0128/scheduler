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
  
};



//   getSchedules: function(){
//     return;
//   },



//   handleReturnToVolunteerList: function(){
//     return;
//   }

// exports.getVolunteers = getVolunteers;
// exports.getSchedules = getSchedules;
// exports.handleReturnToVolunteerList = handleReturnToVolunteerList;