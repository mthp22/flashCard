import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, default: 'General' },
  mastered: { type: Boolean, default: false },
  review: { type: Boolean, default: false }
});

export default mongoose.model('Card', cardSchema);
