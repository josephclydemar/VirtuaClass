
const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const faqSchema = new Schema(
    {
        question: {
            type: String,
            required: true
        },
        answer: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);



module.exports = mongoose.model('faqs', faqSchema);