const Teacher = require("../models/teacher");
const HttpError = require("../models/http-error");
const ObjectId = require("mongoose").ObjectId;

async function teacherExists(teacherID) {
  let exists = await Teacher.exists({ _id: teacherID });
  return exists;
}

async function addTeacher(req, res, next) {
  const { firstName, lastName, hiredDate } = req.body;
  try {
    const teacherToAdd = new Teacher({
      firstName: firstName,
      lastName: lastName,
      hiredDate: new Date(hiredDate),
      teachedClassroomIds: [],
    });
    await teacherToAdd.save();
    res
      .status(201)
      .json({ professeur: teacherToAdd.toObject({ getters: true }) });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Erreur lors de l'ajout du professeurs", 500));
  }
}

module.exports = { teacherExists: teacherExists, addTeacher: addTeacher };

/**
 * _id: {type: mongoose.Types.ObjectId},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    hiredDate: {type: Date, required: true},
    teachedClassroomIds: [{type: mongoose.Types.ObjectId, required: false, ref:"Classroom"}],
 */
