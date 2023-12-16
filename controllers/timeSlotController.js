const path = require('path');
const TimeSlotModel = require(path.join(__dirname, '..', 'models', 'TimeSlot.js'));


const getAllTimeSlots = async (req, res) => {
    try {
        const TimeSlots = await TimeSlotModel.find({}).sort({ createdAt: 1 });
        res.json( TimeSlots );
    } catch (err) {
        res.json({ message: err.message });
    }
};


const createNewTimeSlot = async (req, res) => {
    try {
        const conflict = await TimeSlotModel.findOne({ time_of_day: req.body.time_of_day, day_of_week: req.body.day_of_week }).exec();
        if (conflict === undefined) {
            res.status(409);
            res.json({
                message: 'Time slot conflict',
                conflict: true
            });
            return;
        }

        const newTimeSlot = await TimeSlotModel.create(
            {
                time_of_day: req.body.time_of_day,
                day_of_week: req.body.day_of_week
            }
        );
        res.json( newTimeSlot );
        return;
    } catch(err) {
        res.json({ message: err.message });
        return;
    }
};

const updateTimeSlot = async (req, res) => {

};

const deleteTimeSlot = async (req, res) => {

};

const getTimeSlot = async (req, res) => {
    TimeSlotModel.findById(req.params.id).then(result => {
        res.json( result );
    }).catch(err => {
        res.json({ message: 'Error retrieving Time Slot' });
        console.error( err );
    });
}

module.exports = {
    getAllTimeSlots,
    createNewTimeSlot,
    updateTimeSlot,
    deleteTimeSlot,
    getTimeSlot
};