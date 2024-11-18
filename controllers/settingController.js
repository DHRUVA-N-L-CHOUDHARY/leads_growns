const Settings = require("../models/settings");
const { startCronJob, stopCronJob } = require("../corn/processOrdersCorn");

exports.toggleAutomatic = async (req, res) => {
  try {
    const { automaticVariable } = req.body;

    const settings = await Settings.findOneAndUpdate(
      {},
      { $set: { automaticVariable } },
      { new: true, upsert: true }
    );

    if (settings.automaticVariable) {
      startCronJob();
    } else {
      stopCronJob();
    }

    res.status(200).json({ message: 'automaticVariable updated'});
  } catch (error) {
    console.error('Error updating automaticVariable:', error); 
    res.status(500).json({ message: 'Error updating automaticVariable', error: error.message });
  }
};

exports.getAutomaticVariableStatus = async (req, res) => {
  try {
    const settings = await Settings.findOne();

    if (!settings) {
      return res.status(404).json({ message: 'Settings document not found' });
    }

    res.status(200).json({ automaticVariable: settings.automaticVariable });
  } catch (error) {
    console.error('Error fetching automaticVariable status:', error);
    res.status(500).json({ message: 'Error fetching automaticVariable status', error: error.message });
  }
};
