const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RoleSchema = new Schema({

  // start date of Role
  roleName: {
    type: String,
    required: "Name of role is required."
  },

  numberNeeded: {
    type: Number,
    default: 1
  }
  
});

const WeeklyEventSchema = new Schema({
    
  // when does the event happen each week
  // one document for each week (day/time)
  // 1 for Sunday... 7 for Saturday
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

});


const ScheduleSchema = new Schema({
    
  // start date of schedule
  name: {
    type: String,
    required: Date.now.toString(),
    unique: true
  },

  // start date of schedule
  startDate: {
    type: String,
    required: "Start date is required."
  },

  // start date of schedule
  endDate: {
    type: String,
    required: "End date is required."
  },

  // if more than one schedule run, use to append to the name
  //   (for future release)
  version: {
    type: Number,
    default: 0
  },

  // name of role and number of people needed for each role
  roles: [RoleSchema],

  // day of week and time of day for each weekly recurring event
  weeklyEvents: [WeeklyEventSchema],
  
});

const Schedule = mongoose.model("Schedule", ScheduleSchema);

module.exports = Schedule;