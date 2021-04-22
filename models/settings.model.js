import mongoose from 'mongoose';

const settingsSchema = mongoose.Schema({
  userId: String,
  contacts: [],
  language: String,
  prefersDarkMode: Boolean,
  contactStartPageIndex: Number,
  mealCategories: [{
    name: String,
    icon: Object,
  }],
  mealTags: [String],
});

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
