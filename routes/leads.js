const express = require('express');
const { downloadLeads } = require('../controllers/leadsController');
const { toggleAutomatic } = require('../controllers/settingController');


const router = express.Router();

router.get('/download-leads', downloadLeads);

router.post('/toggle-automatic', toggleAutomatic);

module.exports = router;
