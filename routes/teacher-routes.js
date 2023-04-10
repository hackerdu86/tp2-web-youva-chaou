const express = require("express");

const teacherController = require("../controllers/teachers-controller");
const teacher = require("../models/teacher");
const router = express.Router();


router.post("/", teacherController.addTeacher)

router.get("/:id", teacherController.getTeacher)

router.patch("/:id", teacherController.modifyTeacher);

router.patch("/:id/cours", teacherController.addClassroomToTeacher);

router.delete("/:id", teacherController.deleteTeacher);

module.exports = router;
