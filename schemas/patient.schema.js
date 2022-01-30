const mongoose = require("mongoose");
const dbUtill = require("../dbUtill/utills");

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: 255,
    },
    email: {
        type: String,
        required: true,
        max: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6,
    },
    history: [
        {key: String, value: String}
    ],
    dob: {
        type: Date,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model(dbUtill.PATIENT, patientSchema);
