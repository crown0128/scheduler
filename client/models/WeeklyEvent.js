const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const WeeklyEventSchema = new Schema({
  _id: {
    type: Number,
    required: true
  },
    
// id of schedule the event info belongs to
  scheduleId: {
      type: Number,
      ref: "Schedule"
  },
    
  // when does the event happen each week
  // one document for each week (day/time)
  // 1 for Sunday... 7 for Saturday
  day: {
    type: Number,
    required: "Date / time of event is required.",
    min: 1,
    max: 7
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

const WeeklyEvent = mongoose.model("WeeklyEvent", WeeklyEventSchema);

module.exports = WeeklyEvent;