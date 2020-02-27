const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ScheduleSchema = new Schema({
  // start date of schedule
  startDate: {
    type: Date,
    required: "Start date is required."
  },

  // start date of schedule
  endDate: {
    type: Date,
    required: "End date is required."
  }
  
});

const Schedule = mongoose.model("Schedule", ScheduleSchema);

module.exports = Schedule;