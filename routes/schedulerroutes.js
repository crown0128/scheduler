const router = require("express").Router();

const schedulerController = require("../controllers/schedulerController");

router  
    .route("/api/schedules")
    .get(schedulerController.findAllSchedules)
    .post(schedulerController.createSchedule);

// for "/api/schedules/sched"    
router 
    .route("/api/schedules/sched")
    .post(schedulerController.updateSchedule);

router  
    .route("/api/schedules/id/:id")
    .delete(schedulerController.removeSchedule);

// router  
//     .route("/api/schedules/id")
    
// router
//     .route("/api/schedules")
//     .post(schedulerController.createSchedule);
//     // .post(schedulerController.createSchedule);
router 
    .route("/api/volunteers/id/:id")
    .delete(schedulerController.removeVolunteer);

router  
    .route("/api/volunteers")
    .get(schedulerController.findAllVolunteers)
    .post(schedulerController.createVolunteer);
    // .delete(schedulerController.removeVolunteer);

// router  
//     .route("/api/volunteer")
//     .post(schedulerController.createVolunteer);
// // for "/api/volunteers/:id"    

module.exports = router;