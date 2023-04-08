const Student = require("../models/student");
const HttpError = require("../models/http-error");
const { get } = require("express/lib/response");

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

//Usage functions
async function studentExists(studentId) {
    let exists = await Student.exists({ _id: studentId });
    return exists;
  }

module.exports = { addStudent: addStudent, getStudent: getStudent };
/**const studentSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  registeredClassroomId: {
    type: mongoose.Types.ObjectId,
    required: false,
    ref: "Classroom",
  },
}); */