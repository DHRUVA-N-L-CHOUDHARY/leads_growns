const express = require('express');
const { downloadLeads } = require('../controllers/leadsController');

const router = express.Router();

router.get('/download-leads', downloadLeads);

module.exports = router;
