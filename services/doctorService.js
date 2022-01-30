const moment = require("moment");
const {compareSync} = require("bcrypt");
const {sign} = require("jsonwebtoken");
const Doctor = require("../schemas/doctor.schema");
const Timeslot = require("../schemas/timeslot.schema");
const Appointment = require("../schemas/appointment.schema");


//logic and database calls related to doctor routes are here.

module.exports = {
    loginDoctor: async (data) => {
        const user = await Doctor.findOne({email: data.email});
        if (user) {
            const result = compareSync(
                data.password,
                user.password
            );
            user.type = "doctor";
            if (result) {
                const jsontoken = sign({result: user}, "secret", {
                    expiresIn: "1day",
                });
                const {_id, name, email, dob, field} = user
                const loggedUser = {
                    token: jsontoken,
                    user: {_id, name, email, dob, field, type: "doctor"}
                };
                return loggedUser;

            } else {
                throw new Error("Invalid password");
            }
        } else {
            throw new Error("Invalid email");
        }

    },
    createTimeslot: async (doctorId, data) => {
        const currentDate = moment();
        const {startTime, endTime} = data;
        const timeslots = await Timeslot.find({archived: false, doctorId, startTime: {$gte: currentDate}});
        timeslots.forEach(
            (slot) => {
                if ((moment(slot.startTime).isBetween(startTime, endTime)) || (moment(slot.endTime).isBetween(startTime, endTime))
                    || (moment(slot.startTime).isBefore(startTime) && moment(slot.endTime).isAfter(endTime) || moment(startTime).isSame(moment(slot.startTime)))
                ) {
                    throw new Error("Timeslots are overlapping")
                }
            }
        );
        await Timeslot.create({doctorId, startTime: data.startTime, endTime: data.endTime});
    },
    deleteTimeslot: async (id) => {
        const slot = await Timeslot.findById(id);
        if (!slot.availability) {
            throw new Error("Timeslot is already booked. Can't delete");
        }
        await Timeslot.findByIdAndUpdate(id, {archived: true});
    }
    ,
    getDoctors: async (filter, history) => {
        let newFilter;
        let result;
        if (filter.length == 1 && filter[0] == "") {
            result = await Doctor.find().select(["name", "email", "field", "dob"]);
        } else {
            const updatedFilter = filter.map((f) => {
                return {field: f}
            });
            newFilter = {$or: updatedFilter};
            result = await Doctor.find(newFilter).select(["name", "email", "field", "dob"]);
        }
        const suggested = [];
        const notSuggested = [];
        if (history) {
            if (history.length > 0 && history[0] != "") {
                result.forEach(doctor => {
                    if (history.includes(doctor.field)) {
                        const updatedDoctor = {
                            _id: doctor._id,
                            name: doctor.name,
                            email: doctor.email,
                            dob: doctor.dob,
                            filed: doctor.field,
                            suggested: true
                        }
                        suggested.push(updatedDoctor);
                    } else {
                        const updatedDoctor = {
                            _id: doctor._id,
                            name: doctor.name,
                            email: doctor.email,
                            dob: doctor.dob,
                            filed: doctor.field,
                            suggested: false
                        }
                        notSuggested.push(updatedDoctor);
                    }
                });
                const updatedList = suggested.concat(notSuggested);
                return updatedList;
            }

        }

        return result;
    },
    getDoctorSlots: async (id) => {
        const currentDate = moment().toDate();
        const result = await Timeslot.find({archived: false, doctorId: id, startTime: {$gte: currentDate}});
        const map = new Map();
        result.forEach((slot) => {
            const date = `${slot.startTime.getFullYear()}-${slot.startTime.getMonth() + 1}-${slot.startTime.getDate()}`;
            if (!map.get(date)) {
                map.set(date, []);
                map.get(date).push({
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    timeslotId: slot._id,
                    availability: slot.availability
                });
            } else {
                map.get(date).push({
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    timeslotId: slot._id,
                    availability: slot.availability
                });
            }

        });
        const timeslots = {};
        map.forEach((slot) => {
            const date = `${slot[0].startTime.getFullYear()}-${slot[0].startTime.getMonth() + 1}-${slot[0].startTime.getDate()}`;
            timeslots[date] = slot;
        });
        return timeslots;


    },
    getDoctorDetails: async (id) => {
        const result = await Doctor.findById(id);
        result.password = undefined;
        if (!result) {
            throw new Error("Doctor not found")
        }
        return result;
    },
    getAppointments: async (id) => {
        const result = await Appointment.find({doctorId: id}).populate(["timeslotId", "patientId", "doctorId"]);
        await Appointment.updateMany({doctorId: id, isDoctorRead: false}, {isDoctorRead: true});
        const currentDate = moment().toDate();
        const updatedAppointments = [];
        result.forEach((appointment) => {
            if (appointment.timeslotId) {
                if (moment(appointment.timeslotId.startTime).isAfter(currentDate)) {
                    if (appointment.doctorId) {
                        appointment.doctorId.password = undefined;
                    }
                    if (appointment.patientId) {
                        appointment.patientId.password = undefined;
                    }

                    updatedAppointments.push(appointment);
                }
            }
        });
        return updatedAppointments;
    }
    ,
    getNewAppointments: async (id) => {
        const result = await Appointment.find({
            doctorId: id,
            isDoctorRead: false
        }).populate(["timeslotId", "patientId", "doctorId"]);
        return result;
    }

}