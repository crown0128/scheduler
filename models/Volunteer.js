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

  // This is always 100% (1.00) for the initial release.
  // For a future release, volunteers can choose multiple
  //   day of week & time (weekly event) preferences.
  //   For example, available for both the Sunday 1pm and Wed 7pm events,
  //   but prefers Wed: percentPreferred for Sunday: 0.25, and Wed: 0.75.
  // Could add up to less than 100% (1.00) (i.e. if a volunteer 
  //   is only assigned 1/4 of the time.),
  // Shouldn't add up to more than 100% (1.00), but could, if someone is
  //   serving more often than others.
  percentPreferred: {
    type: Number,
    min: .01,
    max: 1.00,
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