const Appointment = require("../schemas/appointment.schema");
const Timeslot = require("../schemas/timeslot.schema");

//Everything related to the logic of appointment route is here.

module.exports = {
    removeAppointment: async (id, deleteNote, user) => {
        console.log(deleteNote);
        if (user.field) {
            const result = await Appointment.findByIdAndUpdate(id, {
                state: "cancelled",
                deleteNote,
                deletedBy: user,
                isDoctorRead: true,
                isPatientRead: false
            });
            await Timeslot.findByIdAndUpdate(result.timeslotId, {availability: true});
        } else {
            const result = await Appointment.findByIdAndUpdate(id, {
                state: "cancelled",
                deleteNote,
                deletedBy: user,
                isDoctorRead: false,
                isPatientRead: true
            });
            await Timeslot.findByIdAndUpdate(result.timeslotId, {availability: true});
        }

    }
}