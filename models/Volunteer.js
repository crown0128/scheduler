const mongoose = require('mongoose');
require('mongoose-type-email');

const Schema = mongoose.Schema;

const prefTimesSchema = new Schema(
{
  weeklyEventId: {
    type: Number,
    ref: "WeeklyEvent"
  },

  percentPreferred: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  }
  
})

const VolunteerSchema = new Schema({
  _id: {
    type: Number,
    required: true
  },
    
  // first name of Volunteer
  firstName: {
    type: String,
    required: true
  },

  // last name of Volunteer
  lastName: {
    type: String,
    required: true
  },

  // email of Volunteer
  email: {
    type: mongoose.SchemaTypes.Email
  },

  // pic
  image: {
    type: String
  },

  // array of roles by role id the volunteer can do
  roles: [
    {
        type: Number,
        ref: "Role",
        required: true
    }
  ],

  // weekly event times preferred
  //   & % each event is preferred 
  //   (if willing to volunteer at more than one)
  //   %s should sum to 100 for each volunteer
  prefTimes: [prefTimesSchema],

  // arrays of volunteer Ids the volunteer wants to be scheduled with
  with: [
    {
        type: Number,
        ref: "Volunteer"
    }
  ],

  // arrays of volunteer Ids the volunteer should NOT be scheduled with
  notWith: [
    {
        type: Number,
        ref: "Volunteer"
    }
  ],

  // array of eventInfo ids when the volunteer is NOT available
  notAvailable: [
    {
        type: Number,
        ref: "EventInfo"
    }
  ]

});



// first & last name combination must be unique
VolunteerSchema.index({ "firstName": 1, "lastName": 1 }, { unique: true });

const Volunteer = mongoose.model("Volunteer", VolunteerSchema);

module.exports = Volunteer;