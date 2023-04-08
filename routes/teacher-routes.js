const express = require("express");

const teacherController = require("../controllers/teachers-controller")
const router = express.Router();


router.post("/", teacherController.addTeacher)

router.get("/:id", teacherController.getTeacher)


module.exports = router;
