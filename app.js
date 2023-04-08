const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
//mongoose.set('strictQuery', true);

const classroomRoutes = require("./routes/classroom-routes");
const studentRoutes = require("./routes/student-routes");
const teacherRoutes = require("./routes/teacher-routes");

const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use("/cours", classroomRoutes);
app.use("/etudiants", studentRoutes);
app.use("/professeurs", teacherRoutes);

app.use((requete, reponse, next) => {
  return next(new HttpError("Route non trouvée", 404));
});

app.use((error, requete, reponse, next) => {
  if (reponse.headerSent) {
    return next(error);     
  }
  reponse.status(error.code || 500);
  reponse.json({
    message: error.message || "Une erreur inconnue est survenue",
  });
});

mongoose
.connect("mongodb://127.0.0.1:27017/schooldb")
.then(() => {
    app.listen(5000)
    console.log("Connexion à la base de données réussie");
})
.catch(erreur => {
    console.log(erreur);
});

