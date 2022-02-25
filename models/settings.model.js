import mongoose from 'mongoose';

const settingsSchema = mongoose.Schema({
  userId: String,
  contacts: [],
  language: String,
  prefersDarkMode: Boolean,
  ownStartPageIndex: Number,
  contactStartPageIndex: Number,
  mealCategories: [{
    name: String,
    icon: Object,
  }],
  mealTags: [String],
  createdAt: {
    type: Date,
    default: new Date()
  },
});

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
