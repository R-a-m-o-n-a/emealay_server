import mongoose from 'mongoose';

const imageSchema = mongoose.Schema({
  name: String,
  categoryName: String,
  categoryId: String,
  url: String,
  cloudinaryPublicId: String,
  createdAt: {
    type: Date,
    default: new Date()
  }
});

const Image = mongoose.model('Image', imageSchema);
export default Image;
