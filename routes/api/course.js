const path = require('path');
const express = require('express');

const CourseController = require(path.join(__dirname, '..', '..', 'controllers', 'courseController.js'));
const router = express.Router();


router.route('/courses')
    .get(CourseController.getAllCourses)
    .post(CourseController.createNewCourse)
    .put(CourseController.updateCourse)
    .delete(CourseController.deleteCourse);

router.route('/courses/:id')
    .get(CourseController.getCourse)

module.exports = router;