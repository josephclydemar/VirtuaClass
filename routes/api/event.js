const path = require('path');
const express = require('express');

const EventController = require(path.join(__dirname, '..', '..', 'controllers', 'eventController.js'));
const router = express.Router();

router.route('/events')
    .get(EventController.getAllEvent)
    .post(EventController.createNewEvent)
    .put(EventController.updateEvent)
    .delete(EventController.deleteEvent);

module.exports = router;