const express = require("express");
const patientRouter = express.Router();
const patientController = require("../controller/patientController");
const auth = require("../middlewares/auth");


//patient login and register routes
patientRouter.post("/register", patientController.registerUser);
patientRouter.post("/login", patientController.loginUser);

//make an appointment
patientRouter.post("/appointment", auth.checkToken, patientController.addAppointment);

//get appointments
patientRouter.get("/me/appointment", auth.checkToken, patientController.getAppointments);

//get the current notifications
patientRouter.get("/me/appointment/new", auth.checkToken, patientController.getNotifications);

//get suggested doctor for each patient according to the history
patientRouter.get("/getSuggestions", auth.checkToken, patientController.getSuggestedDoctors);


module.exports = patientRouter;
