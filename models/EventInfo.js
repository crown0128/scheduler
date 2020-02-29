const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// id of schedule the event info belongs to
// const ScheduleSchema = new Schema({
//     scheduleId: {
//         type: Schema.Types.ObjectId,
//         ref: "Schedule"
//     }
// })

// const roleSchema = new Schema({
//   roleId: {
//     type: Number,
//     ref: "Role"
//   },

//   numberVolunteersNeeded: {
//     type: Number
//   }
// });

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
  roles: [
    {
      roleId: {
        type: Number,
        ref: "Role"
      },

      numberVolunteersNeeded: {
        type: Number
      }
    }
  ]
});

const EventInfo = mongoose.model("EventInfo", EventInfoSchema);

module.exports = EventInfo;
