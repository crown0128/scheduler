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
  },
  
  scheduleId: {
    type: Schema.Types.ObjectId,
    ref: "Schedule"
  }

});

const Role = mongoose.model("Role", RoleSchema);

module.exports = Role;