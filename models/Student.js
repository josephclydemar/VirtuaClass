const mongoose = require('mongoose');


const Schema = mongoose.Schema;

// const myActivitySchema = new Schema(
//     {
//         activity_id: {
//             type: mongoose.SchemaTypes.ObjectId,
//             required: true
//         },
//         activity_score: {
//             type: Number,
//             required: true
//         }
//     }
// );

const studentSchema = new Schema(
    {
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        guardian_name: {
            type: String,
            required: true
        },
        contact: {
            type: String,
            required: true
        },
        account_type: {
            type: String,
            required: true
        },
        is_blocked: {
            type: Boolean,
            required: true
        },
        activities: {
            type: [{
                activity_id: {
                    type: mongoose.SchemaTypes.ObjectId,
                    required: true
                },
                activity_course_id: {
                    type: mongoose.SchemaTypes.ObjectId,
                    required: true
                },
                activity_score: {
                    type: Number,
                    required: true
                }
            }],
            required: true
        },
        courses_taken_id: {
            type: [mongoose.SchemaTypes.ObjectId],
            required: true
        }
    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model('students', studentSchema);