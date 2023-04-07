const express = require("express");

const classroomController = require("../controllers/classrooms-controller")
const router = express.Router();

//Actual routes
router.get("/", (req, res) => {
    res.send({"Hey":"Man"});
});


module.exports = router;
