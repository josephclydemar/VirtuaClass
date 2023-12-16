const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const timeSlotSchema = new Schema(
    {
        time_of_day: {
            type: String,
            required: true
        },
        day_of_week: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model('time_slots', timeSlotSchema);