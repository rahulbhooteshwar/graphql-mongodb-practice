import mongoose from 'mongoose';
import modalUtil from './util/modal-util';

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  published: { type: Boolean, required: true, default: false },
  author: { type: Schema.Types.ObjectId, required: true },
  comments: [Schema.Types.ObjectId],
  created_at: Date,
  updated_at: Date
});

postSchema.pre('save', (next) => {
  modalUtil.initDates(postSchema, next);
});

const Post = mongoose.model('Post', postSchema);

export default Post;