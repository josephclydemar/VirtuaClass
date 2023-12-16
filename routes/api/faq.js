const path = require('path');
const express = require('express');

const FaqController = require(path.join(__dirname, '..', '..', 'controllers', 'faqController.js'));
const router = express.Router();


router.route('/faqs')
    .get(FaqController.getAllFaqs)
    .post(FaqController.createNewFaq)
    .put(FaqController.updateFaq)
    .delete(FaqController.deleteFaq);

router.route('/faqs/:id').get(FaqController.getFaq);

module.exports = router;