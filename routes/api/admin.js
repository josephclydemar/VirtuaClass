const path = require('path');
const express = require('express');

const AdminController = require(path.join(__dirname, '..', '..', 'controllers', 'adminController.js'));
const router = express.Router();


router.route('/admins')
    .get(AdminController.getAllAdmins)
    .post(AdminController.createNewAdmin)
    .put(AdminController.updateAdmin)
    .delete(AdminController.deleteAdmin);

router.route('/admins/:id').get(AdminController.getAdmin);

module.exports = router;