const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RoleSchema = new Schema({
  // what schedule the role belongs to
  scheduleId: {
    type: Schema.Types.ObjectId,
    ref: "Schedule"
  }

  // start date of Role
  roleName: {
    type: String,
    required: "Name of role is required."
  }
  
});

const Role = mongoose.model("Role", RoleSchema);

module.exports = Role;