import mongoose from 'mongoose';
import modalUtil from './util/modal-util';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: Number,
  created_at: Date,
  updated_at: Date
});

userSchema.pre('save', (next) => {
  modalUtil.initDates(userSchema, next);
});

const User = mongoose.model('User', userSchema);

export default User;