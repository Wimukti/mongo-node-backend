const {genSaltSync, hashSync, compareSync} = require("bcrypt");
const {sign} = require("jsonwebtoken");
const Patient = require("../schemas/patient.schema");
const Appointment = require("../schemas/appointment.schema");
const Timeslot = require("../schemas/timeslot.schema");
const moment = require("moment");


//logic and database calls related to patient routes are here.
//moment library is used for anything related to time
//bcrypt library is used for hashing passwords


module.exports = {
    saveUser: async (data) => {
        const salt = genSaltSync(10);  //hashing password to save the user
        const dob = moment(data.dob);
        const updatedDob = dob.set("hour", 3);
        data.dob = updatedDob;
        data.password = hashSync(data.password, salt);
        const user = new Patient(data);
        const isExist = await Patient.findOne({email: data.email});
        if (isExist) {
            throw new Error("Email already exist");
            return;
        }
        const result = await user.save();
        return result;
    },
    loginPatient: async (data) => {
        const user = await Patient.findOne({email: data.email});
        if (user) {
            const result = compareSync(
                data.password,
                user.password
            );
            if (result) {
                const jsontoken = sign({result: user}, "secret", {
                    expiresIn: "1day",
                });
                const {_id, name, email, dob, history} = user
                const loggedUser = {
                    token: jsontoken,
                    user: {_id, name, email, dob, history, type: "patient"}
                };
                return loggedUser;

            } else {
                throw new Error("Invalid password");
            }
        } else {
            throw new Error("Invalid email");
        }

    },
    makeAppointment: async (patientId, data) => {
        const availability = await Timeslot.findById(data.timeslotId);
        if (availability.availability) {
            const result = await Appointment.create({
                patientId,
                doctorId: data.doctorId,
                timeslotId: data.timeslotId,
                appointmentNote: data.appointmentNote
            });
            await Timeslot.findByIdAndUpdate(data.timeslotId
                , {availability: false});
            return result;
        } else {
            throw new Error("Timeslot is unavailable");
        }

    },
    getAppointments: async (id) => {
        const result = await Appointment.find({patientId: id}).populate(["timeslotId", "patientId", "doctorId"]);
        await Appointment.updateMany({patientId: id, isPatientRead: false}, {isPatientRead: true});
        const currentDate = moment().toDate();
        const updatedAppointments = [];
        result.forEach((appointment) => {
            if (moment(appointment.timeslotId.startTime).isAfter(currentDate)) {
                appointment.doctorId.password = undefined;
                appointment.patientId.password = undefined;
                updatedAppointments.push(appointment);
            }
        });
        return updatedAppointments;
    },
    getNewAppointments: async (id) => {
        const result = await Appointment.find({
            patientId: id,
            isPatientRead: false
        }).populate(["timeslotId", "patientId", "doctorId"]);
        await Appointment.updateMany({doctorId: id, isDoctorRead: false}, {isPatientRead: true});
        return result;
    },
    getSuggestedDoctors: async (id, history) => {

    }

}