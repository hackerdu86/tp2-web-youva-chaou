const express = require("express");

const classroomController = require("../controllers/classrooms-controller")
const router = express.Router();

//Actual routes
router.post("/", classroomController.addClassroom); 


module.exports = router;
