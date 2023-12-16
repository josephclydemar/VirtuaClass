const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const schoolSchema = new Schema(
    {
        schoolName: {
            type: String,
            required: true
        },
        mission: {
            type: String,
            required: true
        },
        vision: {
            type: String,
            required: true
        },
        objectives: {
            type: String,
            required: true
        },
        paymentLink: {
            type: String,
            required: true
        },
        contactInformation: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model('schools', schoolSchema);