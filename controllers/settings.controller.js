// logic for settings routes
import Settings from "../models/settings.model.js";

export const getSingleSetting = async (req, res) => {
  let id = req.params.id;
  try {
    const setting = await Settings.findById(id);
    res.status(200).json(setting);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export const getSettingsOfUser = async (req, res) => {
  let id = req.params.id;
  try {
    const setting = await Settings.findOne({ userId: id });
    res.status(200).json(setting);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export const addSettings = async (req, res) => {
  const givenSettings = req.body;
  const { userId } = givenSettings;
  if (userId) {
    const newSettings = new Settings(givenSettings);
    try {
      await newSettings.save();
      res.status(201).json({ 'message': 'successfully added new Settings', 'Settings': newSettings });
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  } else {
    res.status(409).json({ 'message': 'cannot add settings for undefined userId' });
  }
}

export const updateSettings = async (req, res) => {
  const newSettings = req.body;
  const id = req.params.id;
  try {
    Settings.findById(id, function (err, settingFound) {
      settingFound.set('userId', newSettings.userId);
      settingFound.set('contacts', newSettings.contacts);
      settingFound.set('language', newSettings.language);
      settingFound.set('prefersDarkMode', newSettings.prefersDarkMode);
      settingFound.set('contactStartPage', newSettings.contactStartPage);
      settingFound.set('mealCategories', newSettings.mealCategories);
      settingFound.set('mealTags', newSettings.mealTags);
      settingFound.save().then(settingUpdated => {
        res.status(201).json({ 'info': 'Settings updated', settingUpdated })
      });
    });
  } catch (error) {
    res.status(400).json({ 'info': `Update of setting ${id} failed`, 'message': error.message });
  }
}

export const deleteSettings = async (req, res) => {
  const id = req.params.id;
  Settings.findByIdAndDelete(id, {}, function (err, settings) {
    if (err) {
      res.status(400).json({ 'info': `Deletion of Settings ${id} failed`, 'message': err.message });
    } else {
      res.status(201).json({ 'info': 'Settings deleted, id: ', id, settings })
    }
  });
}

export const deleteSettingOfUser = async (userId) => {
  Settings.deleteOne({ userId: userId }, {}, function (err) {
    if (err) {
      console.log('error on delete settings for user ' + userId, err);
    } else {
      console.log('settings for user ' + userId + ' deleted');
    }
  });
}

export const updateUserContacts = async (req, res) => {
  const newContacts = req.body;
  const id = req.params.id;
  try {
    const setting = await Settings.findOne({ userId: id });
    setting.set('contacts', newContacts);
    setting.save().then(settingSaved => {
      res.status(201).json({ 'info': 'Updated user contacts', settingSaved })
    });
  } catch (error) {
    res.status(400).json({ 'info': `Update of contacts for user ${id} failed`, 'message': error.message });
  }
}

export const updateUserDarkModePreference = async (req, res) => {
  const newDarkModePreference = req.body;
  let id = req.params.id;
  try {
    const setting = await Settings.findOne({ userId: id });
    setting.set('prefersDarkMode', newDarkModePreference);
    setting.save().then(settingSaved => {
      res.status(201).json({ 'info': 'Updated user\'s dark mode preference', settingSaved })
    });
  } catch (error) {
    res.status(400).json({ 'info': `Update of dark mode preference for user ${id} failed`, 'message': error.message });
  }
}

export const updateUserLanguage = async (req, res) => {
  let newLanguage = req.body;
  let id = req.params.id;
  try {
    const setting = await Settings.findOne({ userId: id });
    setting.set('language', newLanguage);
    setting.save().then(settingSaved => {
      res.status(201).json({ 'info': 'Updated user language', settingSaved })
    });
  } catch (error) {
    res.status(400).json({ 'info': `Update of language for user ${id} failed`, 'message': error.message });
  }
}

export const updateSingleUserSetting = async (req, res) => {
  let newSetting = req.body;
  let id = req.params.id;
  try {
    const setting = await Settings.findOne({ userId: id });
    setting.set(newSetting.key, newSetting.value);
    setting.save().then(settingSaved => {
      res.status(201).json({ 'info': `Updated user ${newSetting.key}`, settingSaved });
    });
  } catch (error) {
    res.status(400).json({ 'info': `Update of ${newSetting.key} for user ${id} failed`, 'message': error.message });
  }
}
