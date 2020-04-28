import axios from 'axios';

module.exports = {


  getVolunteers: function(volunteers, volunteerNames){

    // axios call to get volunteers
    console.log("In fcns.js getVOlunteers");
    axios.get('/api/volunteers')
    .then(response => {
      volunteers = response.data;
      volunteers.forEach((volunteer, i) => {
        const newVol = {
          id: volunteer._id,
          name: volunteer.firstName + " " + volunteer.lastName
        };
        volunteerNames.push(newVol);
        volunteerNames.sort();
      })
    })
    .then(response => {
      return [volunteers, volunteerNames];
    });
    return [volunteers, volunteerNames];
  }
//   },



//   getSchedules: function(){
//     return;
//   },



//   handleReturnToVolunteerList: function(){
//     return;
//   }
};