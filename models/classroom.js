const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const classroomSchema = new Schema({
    _id: {type: mongoose.Types.ObjectId},
    title: {type: String, required: true},
    discipline: {type: String, required: true},
    teacherID: {type: ObjectId, required: true, ref: "Teacher"},
    studentIds: [{type: mongoose.Types.ObjectId, required: false, ref: "Student"}],
});

module.exports = mongoose.model("Classroom", classroomSchema);