const path = require('path');
const express = require('express');

const enrollmentController = require(path.join(__dirname, '..', '..', 'controllers', 'enrollmentController.js'));
const router = express.Router();


router.route('/enrollments')
    .get(enrollmentController.getAllEnrollments)
    .post(enrollmentController.createNewEnrollment)
    .delete(enrollmentController.deleteEnrollment);

router.route('/enrollments/:id')
    .get(enrollmentController.getEnrollment);

module.exports = router;