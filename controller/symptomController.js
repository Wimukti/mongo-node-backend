const {getSymptoms, addSymptom, getDisease} = require("../services/symptomService");
const Joi = require("joi");
const lodash = require("lodash");

///Joi is used for do the validation
///this is where all the request and responses handling happens.

module.exports = {
    getAllSymptoms: async (req, res) => {
        try {
            const result = await getSymptoms();
            res.status(201).send({success: 1, result});
        } catch (error) {
            res.status(error.status || 401).send({message: error.message});
        }
    },
    addSymptom: async (req, res) => {
        try {
            const body = req.body;
            await addSymptom(body);
            res.status(201).send({success: 1});
        } catch (error) {
            res.status(error.status || 401).send({message: error.message});
        }
    },
    getDisease: async (req, res) => {
        const schema = Joi.object(
            {symptoms: Joi.array().min(2).max(3)}
        );

        req.body.symptoms = lodash.uniq(req.body.symptoms)
        const validation = schema.validate(req.body);
        if (validation.error) {
            res.status(401).send({message: validation.error.message});
            return;
        }
        const {symptoms} = validation.value;
        try {
            const result = await getDisease(symptoms);
            res.status(201).send({success: 1, result})
        } catch (error) {
            res.status(error.status || 401).send({message: error.message});
        }
    }
}