import CommentModel from '../models/Comment.model';
import { findUserById } from './UserService';
import { findPostById } from './PostService';

const findComments = async () => {
  try {
    const comments = await CommentModel.find({});
    return comments;
  } catch (err) {
    throw err
  }
}

const findCommentById = async (commentId) => {
  try {
    const comment = await CommentModel.findById(commentId);
    return comment;
  } catch (err) {
    throw err;
  }
}

const findCommentsByAuthorId = async (authorId) => {
  try {
    const comments = await CommentModel.find({ author: authorId });
    return comments;
  } catch (err) {
    throw err;
  }
}
const findCommentsByPostId = async (postId) => {
  try {
    const comments = await CommentModel.find({ post: postId });
    return comments;
  } catch (err) {
    throw err;
  }
}

const modifyComment = async (_id, data) => {
  const comment = await CommentModel.findById(_id);
  if (!comment) {
    throw new Error("Specified comment doesn't exist....")
  }
  // we need following checks as in our update input type for these fields are optional, so someone can pass null as well & it will break comment Schema
  if (typeof data.text === 'string') {
    comment.text = data.text
  }
  await comment.save();
  return comment;
}

const createNewComment = async (data) => {
  try {
    const user = await findUserById(data.author);
    if (!user) {
      throw new Error("Specified user doesn't exist....")
    } else {
      const post = await findPostById(data.post);
      if (!post) {
        throw new Error("Specified post doesn't exist....")
      } else {
        const comment = new CommentModel({
          ...data
        });
        const result = await comment.save();
        return result;
      };
    }
  } catch (err) {
    throw err
  }
}
const deleteCommentById = async (_id) => {
  try {
    const commentToBeDeleted = await CommentModel.findById(_id);
    if (!commentToBeDeleted) {
      throw new Error("Specified comment doesn't exist....");
    } else {
      await commentToBeDeleted.remove();
      return commentToBeDeleted;
    }
  } catch (err) {
    throw err;
  }
}
const deleteAllCommentsByPostIds = async (postIds) => {
  const comments = await CommentModel.find({ post: { $in: postIds } });
  await CommentModel.deleteMany({ post: postIds });
  return comments;
}

const deleteAllCommentsByAuthorId = async (authorId) => {
  const comments = await CommentModel.find({ author: authorId });
  await CommentModel.deleteMany({ author: authorId });
  return comments;
}

export {
  findComments,
  findCommentById,
  findCommentsByAuthorId,
  findCommentsByPostId,
  modifyComment,
  createNewComment,
  deleteCommentById,
  deleteAllCommentsByPostIds,
  deleteAllCommentsByAuthorId
};