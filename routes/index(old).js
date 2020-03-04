const router = require('express').Router();
const volunteerRoutes = require("./volunteers");
const scheduleRoutes = require("./schedules");


router.use("/volunteers", volunteerRoutes);
router.use("/schedules", scheduleRoutes);


module.exports = router;