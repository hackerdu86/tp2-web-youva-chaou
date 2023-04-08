const { v4: uuidv4 } = require("uuid");
const { response } = require("express");
const Classroom = require("../models/classroom");
const HttpError = require("../models/http-error");
const teacherController = require("../controllers/teachers-controller");
const teacher = require("../models/teacher");

async function addClassroom(req, res, next) {
  const { title, discipline, teacherID } = req.body;
  let teacherExists = await teacherController.teacherExists(teacherID);
  if (!teacherExists) {
    return next(new HttpError("Le professeur n'existe pas", 404));
  }
  try {
    const classroomToAdd = new Classroom({
      _id: v4(),
      title: title,
      discipline: discipline,
      teacherID: teacherID,
      studentIDs: [],
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

async function getClassroom(req, res, next) {}

async function modifyClassroom(req, res, next) {}

async function deleteClassroom(req, res, next) {}

module.exports = {
  addClassroom: addClassroom,
  getClassroom: getClassroom,
  modifyClassroom: modifyClassroom,
  deleteClassroom: deleteClassroom,
};
