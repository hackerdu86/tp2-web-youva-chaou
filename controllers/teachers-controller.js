const Teacher = require("../models/teacher");
const Classroom = require("../models/classroom");
const Student = require("../models/student");
const HttpError = require("../models/http-error");
const classroomsController = require("./classrooms-controller");
let ObjectId = require("mongoose").Types.ObjectId;

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

async function getTeacher(req, res, next) {
  const teacherId = req.params.id;
  let teacherExist = await teacherExists(teacherId);
  if (!teacherExist) {
    next(new HttpError("Ce professeur n'existe pas", 404));
  } else {
    try {
      const teacher = await Teacher.findById(teacherId);
      res.json({ professeur: teacher.toObject({ getters: true }) });
    } catch (err) {
      console.log(err);
      return next(
        new HttpError("Erreur lors de la récupération du professeur", 500)
      );
    }
  }
}

async function modifyTeacher(req, res, next) {
  const { firstName, lastName, hiredDate } = req.body;
  const teacherId = req.params.id;
  let teacherExist = await teacherExists(teacherId);
  if (!teacherExist) {
    next(
      new HttpError("Ce professeur ne peut être modifié, il n'existe pas", 404)
    );
  } else {
    try {
      let teacher = await Teacher.findById(teacherId);
      teacher.firstName = firstName;
      teacher.lastName = lastName;
      teacher.hiredDate = hiredDate;
      await teacher.save();
      res.status(201).json({ modified: true });
    } catch {
      return next(
        new HttpError("Erreur lors de la mise à jour du professeur", 500)
      );
    }
  }
}

async function addClassroomToTeacher(req, res, next) {
  const teacherId = req.params.id;
  let teacherExist = await teacherExists(teacherId);
  if (!teacherExist) {
    return next(new HttpError("Le professeur n'existe pas", 404));
  } else {
    try {
      const { title, discipline } = req.body;
      try {
        const classroomToAdd = new Classroom({
          title: title,
          discipline: discipline,
          teacherId: teacherId,
          studentIds: [],
        });
        await classroomToAdd.save();
        try {
          await Teacher.findOneAndUpdate(
            { _id: teacherId },
            { $push: { teachedClassroomIds: classroomToAdd._id } }
          );
        } catch (err) {
          console.log(err);
          return next(
            new HttpError(
              "Erreur lors de l'ajout du cours à la liste du professeur",
              500
            )
          );
        }
      } catch (err) {
        console.log(err);
        return next(
          new HttpError("Erreur lors de la création du nouveau cours", 500)
        );
      }
      res.status(200).json({
        message:
          "Cours créé et ajouté à la liste des cours enseigné du professeur",
      });
    } catch (err) {
      console.log(err);
      return next(
        new HttpError(
          "Les champs pour créer un nouveau cours ne sont pas remplis",
          500
        )
      );
    }
  }
}

async function deleteTeacher(req, res, next) {
  const teacherId = req.params.id;
  let teacherExist = teacherExists(teacherId);
  if (!teacherExist) {
    return next(new HttpError("Le professeur n'existe pas"), 500);
  } else {
    try {
      let teacher = await Teacher.findById(teacherId);
      const teachedClassroomsIds = teacher.teachedClassroomIds;
      for (let i = 0; i < teachedClassroomsIds.length; i++) {
        let classroomId = teachedClassroomsIds[i];
        await Student.updateMany(
          { registeredClassroomIds: classroomId },
          { $pull: { registeredClassroomIds: classroomId } }
        );
      }
      try {
        for (let i = 0; i < teachedClassroomsIds.length; i++) {
          let classroomId = teachedClassroomsIds[i];
          await Classroom.deleteOne({ _id: classroomId });
        }
        try {
          await Teacher.deleteOne({ _id: teacherId });
          res.status(200).json({
            message:
              "Le professeur a bien été supprimé ainsi que les cours qu'il enseignait",
          });
        } catch (err) {
          console.log(err);
          return next(
            new HttpError("Erreur lors de la suppression du professeurs"),
            500
          );
        }
      } catch (err) {
        console.log(err);
        return next(
          new HttpError(
            "Erreur lors de la suppression des cours du professeurs"
          ),
          500
        );
      }
    } catch (err) {
      console.log(err);
      return next(
        new HttpError(
          "Erreur lors de la suppression des cours dans les listes des étudiants qui est inscrit a au moins un des cours donné par ce professeur",
          500
        )
      );
    }
  }
}

//Usage functions
async function teacherExists(teacherId) {
  let exists = false;
  if (ObjectId.isValid(teacherId)) {
    exists = await Teacher.exists({ _id: teacherId });
  }
  return exists;
}

module.exports = {
  teacherExists: teacherExists,
  addTeacher: addTeacher,
  getTeacher: getTeacher,
  modifyTeacher: modifyTeacher,
  addClassroomToTeacher: addClassroomToTeacher,
  deleteTeacher: deleteTeacher,
};
