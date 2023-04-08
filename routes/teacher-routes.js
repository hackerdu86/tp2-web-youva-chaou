const express = require("express");

const teacherController = require("../controllers/teachers-controller")
const router = express.Router();

//Actual routes

router.post("/", teacherController.addTeacher)

module.exports = router;
