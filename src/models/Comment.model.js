import mongoose from 'mongoose';
import modalUtil from './util/modal-util';

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, required: true },
  post: { type: Schema.Types.ObjectId, required: true },
  created_at: Date,
  updated_at: Date
});

commentSchema.pre('save', (next) => {
  modalUtil.initDates(commentSchema, next);
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;