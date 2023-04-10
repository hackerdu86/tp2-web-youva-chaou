const Student = require("../models/student");
const HttpError = require("../models/http-error");
const { add } = require("nodemon/lib/rules");
const classroomExists = require("./classrooms-controller").classroomExists;
let ObjectId = require("mongoose").Types.ObjectId;


async function addStudent(req, res, next) {
  const { firstName, lastName } = req.body;
  try {
    const studentToAdd = new Student({
      firstName: firstName,
      lastName: lastName,
      registeredClassroomId: [],
    });
    await studentToAdd.save();
    res
      .status(201)
      .json({ etudiant: studentToAdd.toObject({ getters: true }) });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Erreur lors de l'ajout de l'étudiant", 500));
  }
}

async function getStudent(req, res, next) {
  const studentId = req.params.id;
  let studentExist = await studentExists(studentId);
  if (!studentExist) {
    next(new HttpError("Cet étudiant n'existe pas", 404));
  } else {
    try {
      const student = await Student.findById(studentId);
      res.json({ etudiant: student.toObject({ getters: true }) });
    } catch (err) {
      console.log(err);
      return next(
        new HttpError("Erreur lors de la récupération de l'étudiant", 500)
      );
    }
  }
}

async function modifyStudent(req, res, next) {
  const { firstName, lastName } = req.body;
  const studentId = req.params.id;
  let studentExist = await studentExists(studentId);
  if (!studentExist) {
    next(
      new HttpError("Cet étudiant ne peut être modifié, il n'existe pas", 404)
    );
  } else {
    try {
      student = await Student.findById(studentId);
      student.firstName = firstName;
      student.lastName = lastName;
      await student.save();
      res
      .status(201)
      .json({ modified: true });
    } catch {
      return next(
        new HttpError("Erreur lors de la mise à jour de l'étudiant", 500)
      );
    }
  }
}

async function addClassroomToStudent(req, res, next) {}

//Usage functions
async function studentExists(studentId) {
    let exists = false;
    if (ObjectId.isValid(studentId)) {
      exists = await Student.exists({ _id: studentId });
    }
    return exists;
}

module.exports = {
  addStudent: addStudent,
  getStudent: getStudent,
  modifyStudent: modifyStudent,
  addClassroomToStudent: addClassroomToStudent,
};
/**const studentSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  registeredClassroomId: {
    type: mongoose.Types.ObjectId,
    required: false,
    ref: "Classroom",
  },
}); */
