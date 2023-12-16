const path = require('path');
const express = require('express');

const ActivityController = require(path.join(__dirname, '..', '..', 'controllers', 'activityController.js'));
const router = express.Router();


router.route('/activities')
    .get(ActivityController.getActivities)
    .post(ActivityController.createNewActivity);

router.route('/activities/:id')
    .get(ActivityController.getActivity)
    .put(ActivityController.updateActivity)
    .delete(ActivityController.deleteActivity);

module.exports = router;