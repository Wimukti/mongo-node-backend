const express = require("express");
const appointmentRouter = express.Router();
const appointmentController = require("../controller/appointmentController");
const auth = require("../middlewares/auth");

//common route for remove an appointment
appointmentRouter.patch("/:id", auth.checkToken, appointmentController.removeAppointment);


module.exports = appointmentRouter;