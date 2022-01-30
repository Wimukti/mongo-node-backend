const moment = require("moment");
const lodash = require("lodash");
const Joi = require("joi");
const {
    loginDoctor,
    createTimeslot,
    getDoctors,
    getDoctorSlots,
    getDoctorDetails,
    getAppointments, getNewAppointments, deleteTimeslot
} = require("../services/doctorService")


///Joi is used for do the validation
///this is where all the request and responses handling happens.


module.exports = {
    loginDoctor: async (req, res) => {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).max(25).required(),
            type: Joi.string().allow("")
        });
        const validation = schema.validate(req.body);
        if (validation.error) {
            res.status(401).send({message: validation.error.message});
            return;
        }
        const body = validation.value;
        try {

            const {user, token} = await loginDoctor(body);

            return res.status(200).json({
                sucess: 1,
                message: "login Sucess",
                token, user
            });

        } catch (error) {
            res.status(error.code || 401).send({message: error.message});
        }
    },

    addTimeslot: async (req, res) => {
        const schema = Joi.object({
            startTime: Joi.date().required(),
            endTime: Joi.date().required(),
            availability: Joi.boolean().default(true)
        });
        const validation = schema.validate(req.body);
        if (validation.error) {
            res.status(401).send({message: validation.error.message});
            return;
        }
        const {startTime, endTime} = validation.value;
        if (moment(startTime).isAfter(moment(endTime))) {
            res.status(401).send({message: "Start time should be before end time"});
            return;
        }

        if (moment(startTime).isBefore(moment())) {
            res.status(401).send({message: "Start time is passed"});
            return;
        }

        const doctorId = req.params.id;
        const body = validation.value;
        try {
            await createTimeslot(doctorId, body);
            res.status(201).send({success: 1});
        } catch (error) {
            res.status(error.code || 401).send({message: error.message});
        }
    },
    getAllDoctors: async (req, res) => {
        try {
            const history = [];
            if (req.user && req.user.history && req.user.history.length > 0) {
                req.user.history.forEach(record => {
                    history.push(record.value);
                })
            }
            const filter = req.query.filter;
            const result = await getDoctors(filter, lodash.uniq(history));
            res.status(201).send({success: 1, result});
        } catch (error) {
            res.status(error.status || 401).send({message: error.message});
        }
    },
    getDoctorSlots: async (req, res) => {
        const id = req.params.id;
        if (!id) {
            res.status(401).send({message: "Invalid id"});
            return;
        }
        try {
            const result = await getDoctorSlots(id);
            res.status(201).send({success: 1, result});
        } catch (error) {
            res.status(error.status || 401).send({message: error.message});
        }
    },
    getDetails: async (req, res) => {
        const id = req.user._id;
        if (!id) {
            res.status(401).send({message: "Invalid id"});
            return;
        }
        try {
            const result = await getDoctorDetails(id);
            res.status(201).send({success: 1, result});
        } catch (error) {
            res.status(error.status || 401).send({message: error.message});
        }
    },
    getAppointments: async (req, res) => {
        const id = req.user._id;
        try {
            const result = await getAppointments(id);
            res.status(201).send({success: 1, result});
        } catch (error) {
            console.log(error)
            res.status(error.status || 401).send({message: error.message});
        }
    },
    getNewAppointments: async (req, res) => {
        const id = req.user._id;
        try {
            const result = await getNewAppointments(id);
            res.status(201).send({success: 1, result});
        } catch (error) {
            res.status(error.status || 401).send({message: error.message})
        }
    },
    deleteTimeSlot: async (req, res) => {
        const schema = Joi.object(
            {timeslotId: Joi.string().required()}
        );
        const validation = schema.validate(req.params);
        if (validation.error) {
            res.status(401).send({message: validation.error.message});
            return;
        }
        const {timeslotId} = validation.value;
        try {
            await deleteTimeslot(timeslotId);
            res.status(201).send({success: 1, message: "Successfully deleted"});
        } catch (error) {
            res.status(error.status || 401).send({message: error.message})
        }
    }
}