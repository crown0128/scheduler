const db = require("../models");

//  **** I changed all the error codes to 444 so I would know if it was coming from here
// or from the system.  They were 422.


// Defining methods for the BooksController
module.exports = {
  findAllSchedules: function(req, res) {
    console.log("findAllSchedules");
    db.Schedule.find(req.query)
      .then(dbSchedules => res.json(dbSchedules))
      .catch(err => res.status(500).json(err));
  },
//   findById: function(req, res) {
//     db.Book.findById(req.params.id)
//       .then(dbSchedules => res.json(dbSchedules))
//       .catch(err => res.status(50).json(err));
//   },
  createSchedule: function(req, res) {
    console.log("createSchedule");
    db.Schedule.create(req.body)
      .then(dbSchedules => res.json(dbSchedules))
      .catch(err => res.status(501).json(err));
  },

  updateSchedule: function(req, res) {
    console.log("In updateSchedule:");
    console.log(req.body);
    db.Schedule.findOneAndUpdate({ _id: req.body }, req.body)
      .then(dbSchedules => res.json(dbSchedules))
      // .catch(err => res.status(50).json(err));
      .catch(err => console.log(err));
  },
  
//   update: function(req, res) {
//     db.Book.findOneAndUpdate({ _id: req.params.id }, req.body)
//       .then(dbSchedules => res.json(dbSchedules))
//       .catch(err => res.status(50).json(err));
//   },
  removeSchedule: function(req, res) {
    console.log("in removeSchedule");
    console.log(req.params);
    db.Schedule.findOneAndDelete({ _id: req.params.id } )
      .then(dbSchedules => res.json(dbSchedules))
      .catch(err => console.log(err));
      // .catch(err => res.status(502).json(err));
  },

  findAllVolunteers: function(req, res) {
    console.log("findAllVolunteers");
    db.Volunteer.find(req.query)
      .then(dbVolunteers => {
        res.json(dbVolunteers);
      })
      .catch(err => res.status(503).json(err));
  },
//   findById: function(req, res) {
//     db.Book.findById(req.params.id)
//       .then(dbVolunteers => res.json(dbVolunteers))
//       .catch(err => res.status(50).json(err));
//   },
  createVolunteer: function(req, res) {
    console.log("in createVolunteer (schedulerController)");
    console.log(req.body);
    db.Volunteer.create(req.body)
      .then(dbVolunteers => res.json(dbVolunteers))
      .catch(err => console.log(err));
      // .catch(err => res.status(504).json(err));
  },
//   update: function(req, res) {
//     db.Book.findOneAndUpdate({ _id: req.params.id }, req.body)
//       .then(dbVolunteers => res.json(dbVolunteers))
//       .catch(err => res.status(50).json(err));
//   },
  removeVolunteer: function(req, res) {
    console.log("in removeVolunteer");
    console.log("req.params.id:");
    console.log(req.params);
      db.Volunteer.findOneAndDelete({ _id: req.params.id } )
      .then(dbVolunteers => res.json(dbVolunteers))
      .catch(err => console.log(err));
      // .catch(err => res.status(502).json(err));
  },

  
  updateVolunteer: function(req, res) {
    console.log("In updateVolunteer:");
    console.log(req.body);
    db.Volunteer.findOneAndUpdate({ _id: req.body }, req.body)
      .then(dbVolunteers => res.json(dbVolunteers))
      // .catch(err => res.status(50).json(err));
      .catch(err => console.log(err));
  },

  findOneVolunteer: function(req,res) {
    console.log("In findOneVolunteer");
    db.Volunteer.findById({ _id: req.params.id })
      .then(dbVolunteers => res.json(dbVolunteers))
      .catch(err => console.log(err));
      // .catch(err => res.status(505).json(err));
  }
};


