const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RoleSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

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
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
    
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

// day, time combination must be unique
WeeklyEventSchema.index({ "day": 1, "time": 1 }, { unique: true });

const ScheduleSchema = new Schema({
    _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
    
  // start date of schedule
  startDate: {
    type: Date,
    required: "Start date is required."
  },

  // start date of schedule
  endDate: {
    type: Date,
    required: "End date is required."
  },

  // if more than one schedule run, use to append to the name
  version: {
    type: Number,
    default: 0
  },

  roles: [RoleSchema],

  weeklyEvents: [WeeklyEventSchema],
  
});

const Schedule = mongoose.model("Schedule", ScheduleSchema);

module.exports = Schedule;