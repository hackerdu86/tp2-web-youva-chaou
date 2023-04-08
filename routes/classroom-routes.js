const express = require("express");

const classroomController = require("../controllers/classrooms-controller")
const router = express.Router();

router.post('/', classroomController.addClassroom); 

router.get("/:id", classroomController.getClassroom);

router.patch("/:id", classroomController.modifyClassroom);

module.exports = router;
