const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EventInfoSchema = new Schema({
  _id: {
    type: Number,
    required: true
  },

  // what schedule does this belong to
  scheduleId: {
    type: Number,
    ref: "Schedule"
  },

  // when is this particular event (date & time)
  when: {
    type: Date,
    required: "Date / time of event is required.",
    unique: true
  },

  // what roles are needed, and how many of each
  // roles: [roleSchema]
  // if missing, use what's in the roles collection
  roles: [
    {
      roleId: {
        type: Number,
        ref: "Role"
      },

      numberVolunteersNeeded: {
        type: Number,
        default: 1
      }
    }
  ]
});

const EventInfo = mongoose.model("EventInfo", EventInfoSchema);

module.exports = EventInfo;
