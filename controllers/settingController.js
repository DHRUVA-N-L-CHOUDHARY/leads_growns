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

