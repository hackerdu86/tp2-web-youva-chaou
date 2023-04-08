const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const classroomSchema = new Schema({
    title: {type: String, required: true},
    discipline: {type: String, required: true},
    teacherID: {type: mongoose.Types.ObjectId, required: true, ref: "Teacher"},
    studentIDs: [{type: mongoose.Types.ObjectId, required: false, ref: "Student"}],
});

module.exports = mongoose.model("Classroom", classroomSchema);