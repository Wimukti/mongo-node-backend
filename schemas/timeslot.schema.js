const mongoose = require("mongoose");
const dbUtill = require("../dbUtill/utills");

const timeslotSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Types.ObjectId,
        ref: dbUtill.DOCTOR,
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    availability: {
        type: Boolean,
        default: true,
        required: true,
    },
    archived: {
        type: Boolean,
        default: false
    }

}, {timestamps: true});

module.exports = mongoose.model(dbUtill.TIMESLOT, timeslotSchema);
