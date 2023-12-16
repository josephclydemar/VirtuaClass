const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const accountSchema = new Schema(
    {
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        account_type: {
            type: String,
            required: true
        },
        user_id: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true
        }
    },
    {
        timestamps: true
    }
);



module.exports = mongoose.model('accounts', accountSchema);