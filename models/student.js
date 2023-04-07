const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studentSchema = new Schema({
    _id: {type: mongoose.Types.ObjectId},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    registeredClassroomId: {type: mongoose.Types.ObjectId, required: false, ref: "Classroom"}
});

module.exports = mongoose.model("Student", studentSchema);