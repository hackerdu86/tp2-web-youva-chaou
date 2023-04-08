const express = require("express");

const studentController = require("../controllers/students-controller");
const student = require("../models/student");
const router = express.Router();

//Actual routes
router.post('/', studentController.addStudent);

router.get("/:id", studentController.getStudent);

router.patch("/:id", studentController.modifyStudent)

router.patch("/cours/:id", studentController.addClassroomToStudent);

module.exports = router;
