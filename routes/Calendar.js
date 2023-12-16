const path = require('path');
const express = require('express');

const router = express.Router();


router.get('/calendar(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

module.exports = router;