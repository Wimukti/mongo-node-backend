const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");


//all the routes related to patient
router.use("/patient", require("./patientRoutes"));

//all the routes related to doctor
router.use("/doctor", require("./doctorRoutes"));

//all the routes related to appointment
router.use("/appointment", require("./appointmentRoutes"))

//Route to get symptoms
router.use("/symptom", require("./symptomRoutes"))

//Route to get user information
router.get("/me", auth.checkToken, (req, res) => res.status(201).send({success: 1, result: req.user}))

module.exports = router;
