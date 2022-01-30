const mongoose = require("mongoose");
const dbUtill = require("../dbUtill/utills");

const symptomSchema = new mongoose.Schema({
    symptom: {
        type: String,
        required: true
    },
    disease: {
        type: String,
        required: true
    }
    ,
    archived: {
        type: Boolean,
        default: false
    }

}, {timestamps: true});

module.exports = mongoose.model(dbUtill.SYMPTOM, symptomSchema);
