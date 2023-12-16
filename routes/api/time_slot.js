const path = require('path');
const express = require('express');

const TimeSlotController = require(path.join(__dirname, '..', '..', 'controllers', 'timeSlotController.js'));
const router = express.Router();


router.route('/time_slots')
    .get(TimeSlotController.getAllTimeSlots)
    .post(TimeSlotController.createNewTimeSlot)
    .put(TimeSlotController.updateTimeSlot)
    .delete(TimeSlotController.deleteTimeSlot);

router.route('/time_slots/:id').get(TimeSlotController.getTimeSlot);

module.exports = router;