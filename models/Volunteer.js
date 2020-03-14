const mongoose = require('mongoose');
require('mongoose-type-email');

const Schema = mongoose.Schema;

const prefTimesSchema = new Schema({

  // day of week
  day: {
    type: String,
    required: "Date / time of event is required.",
    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  },

  // time of weekly event 
  // so can't use time stamp / date datatype
  time: {
    type: String,
    required: true
  },

  // This is always 100% for the initial release.
  // For a future release, volunteers can choose multiple
  //   preferences, and total should equal 100%
  percentPreferred: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  }
  
})

const VolunteerSchema = new Schema({
    
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

  // array of roleNames the volunteer can do
  roles: [String],

  // weekly event times (day of week, and time of day) preferred
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
  notAvailable: [{ type: String }]

});

// first & last name combination must be unique
VolunteerSchema.index({ "firstName": 1, "lastName": 1 }, { unique: true });

const Volunteer = mongoose.model("Volunteer", VolunteerSchema);

module.exports = Volunteer;