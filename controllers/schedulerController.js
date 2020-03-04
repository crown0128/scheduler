const db = require("../models");

// Defining methods for the BooksController
module.exports = {
  findAllSchedules: function(req, res) {
    db.Schedule.find(req.query)
      .then(dbSchedules => res.json(dbSchedules))
      .catch(err => res.status(422).json(err));
  },
//   findById: function(req, res) {
//     db.Book.findById(req.params.id)
//       .then(dbSchedules => res.json(dbSchedules))
//       .catch(err => res.status(422).json(err));
//   },
  createSchedule: function(req, res) {
    db.Schedule.create(req.body)
      .then(dbSchedules => res.json(dbSchedules))
      .catch(err => res.status(422).json(err));
  },
//   update: function(req, res) {
//     db.Book.findOneAndUpdate({ _id: req.params.id }, req.body)
//       .then(dbSchedules => res.json(dbSchedules))
//       .catch(err => res.status(422).json(err));
//   },
  removeSchedule: function(req, res) {
    db.Schedule.findById({ _id: req.params.id })
      .then(dbSchedules => dbSchedules.remove())
      .then(dbSchedules => res.json(dbSchedules))
      .catch(err => res.status(422).json(err));
  },

  findAllVolunteers: function(req, res) {
    db.Volunteer.find(req.query)
      .then(dbVolunteers => res.json(dbVolunteers))
      .catch(err => res.status(422).json(err));
  },
//   findById: function(req, res) {
//     db.Book.findById(req.params.id)
//       .then(dbVolunteers => res.json(dbVolunteers))
//       .catch(err => res.status(422).json(err));
//   },
  createVolunteer: function(req, res) {
    db.Volunteer.create(req.body)
      .then(dbVolunteers => res.json(dbVolunteers))
      .catch(err => res.status(422).json(err));
  },
//   update: function(req, res) {
//     db.Book.findOneAndUpdate({ _id: req.params.id }, req.body)
//       .then(dbVolunteers => res.json(dbVolunteers))
//       .catch(err => res.status(422).json(err));
//   },
  removeVolunteer: function(req, res) {
    db.Volunteer.findById({ _id: req.params.id })
      .then(dbVolunteers => dbVolunteers.remove())
      .then(dbVolunteers => res.json(dbVolunteers))
      .catch(err => res.status(422).json(err));
  }
};

    // db.Role.create({ 
    //     "_id": 10,
    //     scheduleId: 1,
    //     roleName: "Outreach Volunteer",
    //     numberNeeded: 2
    // })
    // .then(dbRole => {
    //     console.log(dbRole);
    // })
    // .catch(({ message }) => {
    //     console.log(message);
    // });