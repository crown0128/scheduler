const router = require("express").Router();

const volunteersController = require("../controllers/volunteersController");

router  
    .route("/api/volunteers")
    .get(volunteersController.findAll)
    .post(volunteersController.create);

// for "/api/volunteers/:id"    
router 
    .route("/api/volunteers/:id")
    .delete(volunteersController.remove)

module.exports = router;