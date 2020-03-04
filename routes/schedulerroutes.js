const router = require("express").Router();

const schedulerController = require("../controllers/schedulerController");

router  
    .route("/api/schedules")
    .get(schedulerController.findAllSchedules)
    .post(schedulerController.createSchedule);

// for "/api/schedules/:id"    
router 
    .route("/api/schedules/:id")
    .delete(schedulerController.removeSchedule);

router  
    .route("/api/volunteers")
    .get(schedulerController.findAllVolunteers)
    .post(schedulerController.createVolunteer);

// for "/api/volunteers/:id"    
router 
    .route("/api/volunteers/:id")
    .delete(schedulerController.removeVolunteer);

module.exports = router;