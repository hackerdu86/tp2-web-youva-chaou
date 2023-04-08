const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const classroomSchema = new Schema({
    title: {type: String, required: true},
    discipline: {type: String, required: true},
    teacherId: {type: mongoose.Types.ObjectId, required: true},
    studentIds: [{type: mongoose.Types.ObjectId, required: false}],
});

module.exports = mongoose.model("Classroom", classroomSchema);