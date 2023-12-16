const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const activitySchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        documents_link: {
            type: String,
            required: true
        },
        shortened_documents_link: {
            type: String,
            required: true
        },
        deadline: {
            type: Date,
            required: true
        },
        course_id: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true
        }
    },
    {
        timestamps: true
    }
);



module.exports = mongoose.model('activities', activitySchema);