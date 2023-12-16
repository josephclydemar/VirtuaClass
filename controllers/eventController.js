const path = require('path');
const EventModel = require(path.join(__dirname, '..', 'models', 'Event.js'));

const getAllEvent = async (req, res) => {
    try {
        const Events = await EventModel.find({}).sort({ createdAt: -1 });
        res.json( Events );
        return;
    } catch (err) {
        res.json({ message: 'Error retrieving Events' });
        console.error(err);
        return;
    }
};

const createNewEvent = async (req, res) => {
    try {
        const conflict = await EventModel.findOne({ event_datetime: req.body.event_datetime }).exec();
        if (conflict) {
            res.status(409);
            res.json({
                message: 'Event conflict',
                conflict: true
            });
            console.error('Event conflict');
            return;
        }

        const newEvent = await EventModel.create(
            {
                event_datetime: req.body.event_datetime,
                event: req.body.event,
            }
        );
        console.log( newEvent );
        res.json( newEvent );
        return;
    } catch(err) {
        res.json({ message: err.message });
        return;
    }
};

const updateEvent = async (req, res) => {
    try {
        const result = await EventModel.updateOne(
            {
                _id: req.body.id,
            },
            {
                $set: {
                    event_datetime: req.body.event_datetime,
                    event: req.body.event
                }
            }
        );
        res.json( result );
        return;
    } catch(err) {
        res.json({ message: err.message });
        return;
    }
};

const deleteEvent = async (req, res) => {
    try {
        const result = await EventModel.deleteOne(
            {
                _id: req.body.id
            }
        );
        res.json( result );
        return;
    } catch(err) {
        res.json({ message: err.message });
        return;
    }
};



module.exports = {
    getAllEvent,
    createNewEvent,
    updateEvent,
    deleteEvent,
};