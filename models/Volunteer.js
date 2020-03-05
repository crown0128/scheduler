const mongoose = require('mongoose');
require('mongoose-type-email');

const Schema = mongoose.Schema;

const prefTimesSchema = new Schema({
  weeklyEventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WeeklyEvent"
  },

  percentPreferred: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  }
  
})

// const roleSchema = new Schema({
//   roleName: {
//     type: String,
//     required: true
//   }
// })

const VolunteerSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
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
  roles: [String],

  // weekly event times preferred
  //   & % each event is preferred 
  //   (if willing to volunteer at more than one)
  //   %s should sum to 100 for each volunteer
  prefTimes: [prefTimesSchema],

  // arrays of volunteer Ids the volunteer wants to be scheduled with
  with: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Volunteer"
    }
  ],

  // arrays of volunteer Ids the volunteer should NOT be scheduled with
  notWith: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Volunteer"
    }
  ],

  // array of eventInfo ids when the volunteer is NOT available
  notAvailable: [{ type: Date }]

});

// first & last name combination must be unique
VolunteerSchema.index({ "firstName": 1, "lastName": 1 }, { unique: true });


const Volunteer = mongoose.model("Volunteer", VolunteerSchema);

module.exports = Volunteer;