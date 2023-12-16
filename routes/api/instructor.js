const path = require('path');
const express = require('express');

const InstructorController = require(path.join(__dirname, '..', '..', 'controllers', 'instructorController.js'));
const router = express.Router();


router.route('/instructors')
    .get(InstructorController.getAllInstructors)
    .post(InstructorController.createNewInstructor)
    .put(InstructorController.updateInstructor)
    .delete(InstructorController.deleteInstructor);

router.route('/instructors/:id')
    .get(InstructorController.getOneInstructor)
    .put(InstructorController.updateOneInstructor);

module.exports = router;