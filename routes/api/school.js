const path = require('path');
const express = require('express');

const SchoolController = require(path.join(__dirname, '..', '..', 'controllers', 'schoolController.js'));
const router = express.Router();


router.route('/school')
    .get(SchoolController.getAllSchoolInfo)
    .post(SchoolController.createNewSchoolInfo)
    .put(SchoolController.updateSchoolInfo);

module.exports = router;