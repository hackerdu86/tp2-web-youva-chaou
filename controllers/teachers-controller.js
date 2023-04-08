const Teacher = require("../models/teacher");
const HttpError = require("../models/http-error");


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
        res
        .status(201)
        .json({ modified: true });
      } catch {
        return next(
          new HttpErreur("Erreur lors de la mise à jour du professeur", 500)
        );
      }
    }
  }

//Usage functions
async function teacherExists(teacherId) {
    let exists = await Teacher.exists({ _id: teacherId });
    return exists;
  }

  
module.exports = { teacherExists: teacherExists, addTeacher: addTeacher, getTeacher: getTeacher, modifyTeacher: modifyTeacher };
