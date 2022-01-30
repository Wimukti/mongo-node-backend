const {removeAppointment} = require("../services/appointmentService");
const Joi = require("joi");
///Joi is used for do the validation
///this is where all the request and responses handling happens.


module.exports = {

    //common function for patient and doctor to remove appointment
    removeAppointment: async (req, res) => {
        const id = req.params.id;
        const body = Joi.object({
            deleteNote: Joi.string().allow("")
        })
        const validation = body.validate(req.body);
        if (validation.error) {
            res.status(401).send({message: validation.error.message});
            return;
        }
        const {deleteNote} = validation.value;
        if (!id) {
            res.status(401).send({message: "Id is not valid"});
            return;
        }
        try {
            await removeAppointment(id, deleteNote, req.user);
            res.status(201).send({success: 1, message: "appointment removed"})

        } catch (error) {
            res.status(error.status || 401).send({message: error.message});
        }
    }
}

// thi sis comment
// thi sis comment
// new one
// new two
// new two
