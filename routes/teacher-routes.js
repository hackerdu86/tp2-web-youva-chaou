const express = require("express");

const teacherController = require("../controllers/teachers-controller");
const teacher = require("../models/teacher");
const router = express.Router();


router.post("/", teacherController.addTeacher)

router.get("/:id", teacherController.getTeacher)

router.patch("/:id", teacherController.modifyTeacher);

module.exports = router;
