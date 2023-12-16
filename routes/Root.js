const path = require('path');
const express = require('express');

const router = express.Router();

router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

router.all('/*', (req, res) => { // applies to every HTTP request method
    res.status(404);
    res.sendFile(path.join(__dirname, '..', 'build', '404_error.html'));
});


module.exports = router;