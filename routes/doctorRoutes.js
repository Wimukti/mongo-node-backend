const express = require("express");
const doctorRouter = express.Router();
const doctorController = require("../controller/doctorController");
const auth = require("../middlewares/auth");


//doctor login route
doctorRouter.post("/login", doctorController.loginDoctor);

//add timeslot
doctorRouter.post("/:id/timeslot", doctorController.addTimeslot);

//delete timeslot
doctorRouter.delete("/timeslot/:timeslotId", doctorController.deleteTimeSlot);

//get all doctors
doctorRouter.get("/", auth.getToken, doctorController.getAllDoctors);

//get a doctor details by id
doctorRouter.get("/:id", doctorController.getDoctorSlots);

//get appointments
doctorRouter.get("/me/appointment", auth.checkToken, doctorController.getAppointments);


doctorRouter.get("/me/appointment/new", auth.checkToken, doctorController.getNewAppointments)

module.exports = doctorRouter;
