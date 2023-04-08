const HttpError = require("../models/http-error");
const teacherController = require("../controllers/teachers-controller");
const Classroom = require("../models/classroom");
const Student = require("../models/student");
const Teacher = require("../models/teacher");

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
      try {
        let teacher = await Teacher.findOneAndUpdate(
          { _id: teacherId },
          { $push: { teachedClassroomIds: classroomToAdd.id } }
        );
        teacher.teachedClassroomIds.push(classroomToAdd._id);
      } catch (err) {
        console.log(err);
        return next(
          new HttpError(
            "Erreur lors de la récupération du professeur pour ajouter le cours",
            500
          )
        );
      }

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

async function modifyClassroom(req, res, next) {
  const { title, discipline } = req.body;
  const classroomId = req.params.id;
  let classroomExist = await classroomExists(classroomId);
  if (!classroomExist) {
    next(new HttpError("Ce cours ne peut être modifié, il n'existe pas", 404));
  } else {
    try {
      let classroom = await Classroom.findById(classroomId);
      classroom.title = title;
      classroom.discipline = discipline;
      await classroom.save();
      res.status(201).json({ modified: true });
    } catch {
      return next(
        new HttpErreur("Erreur lors de la mise à jour du cours", 500)
      );
    }
  }
}

async function deleteClassroom(req, res, next) {
  const classroomId = req.params.id;
  let classroomExist = await classroomExists(classroomId);

  if (!classroomExist) {
    return next(new HttpError("Le cours en question n'existe pas", 204));
  } else {
    try {
      let classroomTeacherId = await Classroom.findById(classroomId);
      classroomTeacherId = classroomTeacherId.id;
      Classroom.deleteOne({ _id: classroomId });
      try {
        let classroomTeacher = await Teacher.findById(classroomTeacherId);
        classroomTeacher.teachedClassroomIds = classroomTeacher.teachedClassroomIds.filter((id) => {
          return id !== classroomId;
        });
        classroomTeacher.save();
      } catch (err) {
        new HttpError(
          "Erreur lors de la récupération du professeur qui enseigne le cours",
          500
        );
      }
      try {
        let registeredStudents = await Student.find({
          registeredClassroomIds: { $in: { classroomId } },
        });
        registeredStudents.registeredClassroomIds =
          classroomTeacher.teachedClassroomIds.filter((classroomIds) => {
            return classroomIds !== classroomId;
          });
        registeredStudents.save();
      } catch (err) {
        console.log(err);
        new HttpError(
          "Erreur lors des étudiants qui sont inscrits à ce courss",
          500
        );
      }
      res.status(200).json({ message: "Cours supprimé" });
    } catch (err) {
      console.log(err);
      new HttpError("Erreur lors de la suppression du cours", 500);
    }
  }
}

//Usage functions
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
