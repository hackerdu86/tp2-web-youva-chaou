const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const teacherSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    hiredDate: {type: Date, required: true},
    teachedClassroomIds: [{type: mongoose.Types.ObjectId, required: false, ref:"Classroom"}],
});

module.exports = mongoose.model("Teacher", teacherSchema);