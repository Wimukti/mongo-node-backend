const Symptoms = require("../schemas/symptom.schema");

//logic and database calls related to self diagnosis system routes are here.


module.exports = {
    getSymptoms: async () => {
        const result = await Symptoms.find().sort({["symptom"]: 1});
        return result;
    },

    //add symptom
    addSymptom: async (body) => {
        await Symptoms.create(body);
    },
    //get the suggested disease
    getDisease: async (symptoms) => {

        const docs = await Symptoms.find({_id: {$in: symptoms}});
        const map = new Map();
        if (docs.length > 0) {
            docs.forEach((disease) => {
                if (!map.get(disease.disease)) {
                    map.set(disease.disease, [])
                    map.get(disease.disease).push(disease.symptom);
                } else {
                    map.get(disease.disease).push(disease.symptom);
                }
            });
        }
        let result = {shouldCheck: true};
        const updatedSymptoms = [];
        const updatedResult = [];
        const removeSymptoms = [];
        map.forEach((symptom, key) => {
            if (symptom.length >= 2) {

                result = {
                    shouldCheck: false,
                    disease: [key]
                }
                return;
            } else {
                map.forEach((symptom, key) => {
                    if (!updatedSymptoms.includes(key)) {
                        updatedSymptoms.push(key);
                        removeSymptoms.push(symptom[0]);
                    }
                })
            }
        })
        if (!result.shouldCheck) {
            if (symptoms.length == 2) {
                result.percentage = "100%"
            } else if (symptoms.length == 3) {
                map.forEach((symp) => {
                    if (symp.length == 3) {
                        result.percentage = "100%"
                    } else if (symp.length == 2) {
                        result.percentage = "66.66%"
                    }
                })
            }
        }
        if (!result.shouldCheck) {
            docs.filter((d) => {
                if (d.disease == result.disease) {
                    result.disease = [d];
                }
            })
            return result;
        }
        await Promise.all(
            updatedSymptoms.map(async (disease) => {
                const allSymptoms = await Symptoms.find({disease}).select(["symptom", "disease"]);
                allSymptoms.forEach((symp) => {
                    if (!removeSymptoms.includes(symp.symptom)) {
                        updatedResult.push(symp);
                    }
                });
            })
        );
        result = {shouldCheck: true, symptoms: updatedResult}
        if (result.shouldCheck) {
            if (symptoms.length == 2) {
                result.percentage = "66.66%";
            } else if (symptoms.length == 3) {
                result.percentage = "50%"
            }
        }
        return result;
    }
}