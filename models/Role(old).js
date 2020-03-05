const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RoleSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
    
  // what schedule the role belongs to
  scheduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Schedule"
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

const Role = mongoose.model("Role", RoleSchema);

module.exports = Role;