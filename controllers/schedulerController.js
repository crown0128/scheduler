const db = require("../models");

module.exports = {

  // scheduler calls

  // get all schedules
  findAllSchedules: function(req, res) {
    db.Schedule.find(req.query)
      .then(dbSchedules => res.json(dbSchedules))
      .catch(err => res.status(422).json(err));
  },

  // insert a schedule
  createSchedule: function(req, res) {
    db.Schedule.create(req.body)
      .then(dbSchedules => res.json(dbSchedules))
      .catch(err => res.status(422).json(err));
  },

  // update a schedule
  updateSchedule: function(req, res) {
    db.Schedule.findOneAndUpdate({ _id: req.body }, req.body)
      .then(dbSchedules => res.json(dbSchedules))
      .catch(err => res.status(422).json(err));
  },
  
  // delete a schedule
  removeSchedule: function(req, res) {
    db.Schedule.findOneAndDelete({ _id: req.params.id } )
      .then(dbSchedules => res.json(dbSchedules))
      .catch(err => res.status(422).json(err));
  },


// Volunteer calls

// get all volunteers
  findAllVolunteers: function(req, res) {
    db.Volunteer.find(req.query)
      .then(dbVolunteers => {
        res.json(dbVolunteers);
      })
      .catch(err => res.status(422).json(err));
  },

  // insert a volunteer
  createVolunteer: function(req, res) {
    db.Volunteer.create(req.body)
      .then(dbVolunteers => res.json(dbVolunteers))
      .catch(err => res.status(422).json(err));
  },
 
 // delete a volunteer
  removeVolunteer: function(req, res) {
      db.Volunteer.findOneAndDelete({ _id: req.params.id } )
      .then(dbVolunteers => res.json(dbVolunteers))
      .catch(err => res.status(422).json(err));
  },
  
  // update one volunteer by id
  updateVolunteer: function(req, res) {
    db.Volunteer.findOneAndUpdate({ _id: req.body }, req.body)
      .then(dbVolunteers => res.json(dbVolunteers))
      .catch(err => res.status(422).json(err));
  },

  // get one volunteer by id
  findOneVolunteer: function(req,res) {
    db.Volunteer.findById({ _id: req.params.id })
      .then(dbVolunteers => res.json(dbVolunteers))
      .catch(err => res.status(422).json(err));
  }
};


