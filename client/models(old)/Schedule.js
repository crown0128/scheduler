const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ScheduleSchema = new Schema({
    _id: {
    type: Number,
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
  }
  
});

const Schedule = mongoose.model("Schedule", ScheduleSchema);

module.exports = Schedule;