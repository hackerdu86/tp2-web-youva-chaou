const express = require("express");

const studentController = require("../controllers/students-controller")
const router = express.Router();

//Actual routes
router.post('/', studentController.addStudent);

router.get("/:id", studentController.getStudent);

module.exports = router;
