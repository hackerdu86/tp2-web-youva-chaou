const HttpError = require("../models/http-error");
const teacherController = require("../controllers/teachers-controller");
const Classroom = require("../models/classroom");
const Student = require("../models/student");
const classroom = require("../models/classroom");

//Controllers
async function addClassroom(req, res, next) {
  const { title, discipline, teacherId } = req.body;
  let teacherExists = await teacherController.teacherExists(teacherId);
  if (!teacherExists) {
    return next(new HttpError("Le professeur n'existe pas", 404));
  } else {
    try {
      const classroomToAdd = new Classroom({
        title: title,
        discipline: discipline,
        teacherId: teacherId,
        studentIds: [],
      });
      await classroomToAdd.save();
      res
        .status(201)
        .json({ classe: classroomToAdd.toObject({ getters: true }) });
    } catch (err) {
      console.log(err);
      return next(new HttpError("Erreur lors de l'ajout de la classe", 500));
    }
  }
}

async function getClassroom(req, res, next) {
  const classroomId = req.params.id;
  let classroomExist = await classroomExists(classroomId);
  if (!classroomExist) {
    next(new HttpError("Cette classe n'existe pas", 404));
  } else {
    try {
      const classroom = await Classroom.findById(classroomId);
      res.json({ classe: classroom.toObject({ getters: true }) });
    } catch (err) {
      console.log(err);
      return next(
        new HttpError("Erreur lors de la récupération de la classe", 500)
      );
    }
  }
}

async function modifyClassroom(req, res, next) {}

async function deleteClassroom(req, res, next) {
  const classroomId = requete.params.classroomId;
  let classroom;
  try {
    classroom = await Classroom.findById(classroomId).populate("createur");
  } catch {
    return next(
      new HttpErreur("Erreur lors de la suppression de la place", 500)
    );
  }
  if (!place) {
    return next(new HttpErreur("Impossible de trouver la place", 404));
  }

  try {
    await place.remove();
    place.createur.places.pull(place);
    await place.createur.save();
  } catch {
    return next(
      new HttpErreur("Erreur lors de la suppression de la place", 500)
    );
  }
  reponse.status(200).json({ message: "Place supprimée" });
}

async function deleteClassroomLocal(classroomId) {}

//Usage functions
async function removeStudentFromStudentLists(studentID) {
  const classesWithStudentInscribed = await Classroom.find({
    studentIDs: { $in: { studentID } },
  }).exec();
  console.log(classesWithStudentInscribed);
}
async function classroomExists(classroomID) {
  let exists = await Classroom.exists({ _id: classroomID });
  return exists;
}

module.exports = {
  addClassroom: addClassroom,
  getClassroom: getClassroom,
  modifyClassroom: modifyClassroom,
  deleteClassroom: deleteClassroom,
};
