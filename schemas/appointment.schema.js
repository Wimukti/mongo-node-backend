const mongoose = require("mongoose");
const dbUtill = require("../dbUtill/utills");

const appointmentSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Types.ObjectId,
        ref: dbUtill.DOCTOR,
    },
    patientId: {
        type: mongoose.Types.ObjectId,
        ref: dbUtill.PATIENT,
    },
    timeslotId: {
        type: mongoose.Types.ObjectId,
        ref: dbUtill.TIMESLOT,
    },
    state: {
        type: String,
        default: "booked",
        required: true,
    }, appointmentNote: {
        type: String,
        required: false
    }, deleteNote: {
        type: String,
        required: false
    },
    deletedBy: {
        type: Object
    },
    isDoctorRead: {
        type: Boolean,
        default: false
    },
    isPatientRead: {
        type: Boolean,
        default: true
    }

}, {timestamps: true});

module.exports = mongoose.model(dbUtill.APPOINTMENT, appointmentSchema);
