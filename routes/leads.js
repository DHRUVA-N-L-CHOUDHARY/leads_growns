const express = require('express');
const { downloadLeads } = require('../controllers/leadsController');
const { toggleAutomatic , getAutomaticVariableStatus } = require('../controllers/settingController');


const router = express.Router();

router.get('/download-leads', downloadLeads);

router.post('/toggle-automatic', toggleAutomatic);

router.get('/automatic-status', getAutomaticVariableStatus);

module.exports = router;
