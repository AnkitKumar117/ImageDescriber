import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  filename: String,
  file_originalname: String,
  description: String,
  status: { type: String, default: 'pending' },
  isActive: { type: Boolean, default: true },
  uploadedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null }
});

export default mongoose.model('Image', ImageSchema);
