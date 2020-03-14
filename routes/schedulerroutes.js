const router = require("express").Router();

const schedulerController = require("../controllers/schedulerController");

// routes to access the database

// routes for SCHEDULES table
// -------------------------- 

// to "get" all schedules
// and to create a new schedule
router  
    .route("/api/schedules")
    .get(schedulerController.findAllSchedules)
    .post(schedulerController.createSchedule);

// to update a schedule
router 
    .route("/api/schedules/sched")
    .post(schedulerController.updateSchedule);

// to delete a schedule by it's id
router  
    .route("/api/schedules/id/:id")
    .delete(schedulerController.removeSchedule);

// routes for VOLUNTEERS table 
// -------------------------- 

// to delete a volunteer by the id
//  or to find one volunteer by id
router 
    .route("/api/volunteers/id/:id")
    .delete(schedulerController.removeVolunteer)
    .get(schedulerController.findOneVolunteer);

// to update a volunteer
router
    .route("/api/volunteers/volunteer")
    .post(schedulerController.updateVolunteer);

// to get all the volunteers
// or to create a new volunteer
router  
    .route("/api/volunteers")
    .get(schedulerController.findAllVolunteers)
    .post(schedulerController.createVolunteer);

module.exports = router;