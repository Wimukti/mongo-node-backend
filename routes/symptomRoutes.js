const express = require("express");
const symptomRouter = express.Router();
const {getAllSymptoms, addSymptom, getDisease} = require("../controller/symptomController");


//get all the symptoms
symptomRouter.get("/", getAllSymptoms);

//add new symptom for a disease
symptomRouter.post("/", addSymptom);

//get the suggested disease
symptomRouter.post("/disease", getDisease);


module.exports = symptomRouter;