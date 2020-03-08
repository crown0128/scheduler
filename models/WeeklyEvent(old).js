const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const WeeklyEventSchema = new Schema({
    
  day: {
    type: String,
    required: "Date / time of event is required.",
    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  },

  // time of weekly event 
  time: {
    type: String,
    required: true
  },
  
  scheduleId: {
    type: Schema.Types.ObjectId,
    ref: "Schedule"
  }
});

const WeeklyEvent = mongoose.model("WeeklyEvent", WeeklyEventSchema);

module.exports = WeeklyEvent;