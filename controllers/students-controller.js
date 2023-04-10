const Student = require("../models/student");
const Classroom = require("../models/classroom");
const HttpError = require("../models/http-error");
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
      res.status(201).json({ modified: true });
    } catch {
      return next(
        new HttpError("Erreur lors de la mise à jour de l'étudiant", 500)
      );
    }
  }
}

async function addClassroomToStudent(req, res, next) {
  const { studentId, classroomId } = req.params;
  let studentExist = await studentExists(studentId);
  let classroomExist = await classroomExists(classroomId);
  if (!studentExist) {
    return next(new HttpError("L'étudiant en question n'existe pas", 404));
  } else if (!classroomExist) {
    return next(new HttpError("Le cours en question n'existe pas", 404));
  } else {
    try {
      await Student.findOneAndUpdate(
        { _id: studentId },
        { $push: { registeredClassroomIds: classroomId } }
      );
      try {
        await Classroom.findOneAndUpdate(
          { _id: classroomId },
          { $push: { studentIds: studentId } }
        );
        res
          .status(201)
          .json({ message: "L'étudiant a bien été inscrit au cours" });
      } catch (err) {
        console.log(err);
        return next(
          new HttpError(
            "Erreur lors de l'ajout de l'étudiant à la liste des étudiants inscrit au cours"
          ),
          500
        );
      }
    } catch (err) {
      console.log(err);
      return next(
        new HttpError(
          "Erreur lors de l'ajout du cours à la liste des cours auxquels l'étudiant est inscrit"
        ),
        500
      );
    }
  }
}

async function deleteStudent(req, res, next) {

}

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
  deleteStudent: deleteStudent
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
