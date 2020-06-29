import PostModel from '../models/Post.model';
import { findUserById } from './UserService';
import { deleteAllCommentsByPostIds } from './CommentService';

const findPosts = async (keyword) => {
  let filter = {}
  if (keyword) {
    const match = { $regex: keyword, $options: "i" }
    filter = { $or: [{ title: match }, { body: match }] }
  }
  try {
    const posts = await PostModel.find(filter);
    return posts;
  } catch (err) {
    throw err
  }
}

const findPostById = async (postId) => {
  try {
    const post = await PostModel.findById(postId);
    return post;
  } catch (err) {
    throw err;
  }
}

const findPostsByAuthorId = async (authorId) => {
  try {
    const posts = await PostModel.find({ author: authorId });
    return posts;
  } catch (err) {
    throw err;
  }
}

const createNewPost = async (data) => {
  try {
    const user = await findUserById(data.author);
    if (!user) {
      throw new Error("Specified user doesn't exist....")
    } else {
      const post = new PostModel({
        ...data
      });
      const result = await post.save();
      return result;
    }
  } catch (err) {
    throw err
  }
}
const modifyPost = async (_id, data) => {
  try {
    const post = await PostModel.findById(_id);
    const old = { ...post }
    if (!post) {
      throw new Error("Specified post doesn't exist....")
    }
    // we need following checks as in our update input type these fields are optional, so someone can pass null as well & it will break Post Schema
    if (typeof data.title === 'string') {
      post.title = data.title
    }
    if (typeof data.body === 'string') {
      post.body = data.body
    }
    if (typeof data.published === 'boolean') {
      post.published = data.published
    }
    await post.save();
    console.log(post, old);
    return { post, old }
  } catch (err) {
    throw err;
  }
}

const deletePostById = async (_id) => {
  try {
    const post = await PostModel.findById(_id);
    if (!post) {
      throw new Error("Specified post doesn't exist....");
    } else {
      await post.remove();
      // remove comments associated with this post
      const comments = await deleteAllCommentsByPostIds([post._id]);
      return { post, comments };
    }
  } catch (err) {
    throw err;
  }
}

const deleteAllPostsByAuthorId = async (authorId) => {
  const posts = await PostModel.find({ author: authorId });
  await PostModel.deleteMany({ author: authorId });
  const postIds = [];
  let comments = [];
  posts.map((currentValue) => {
    postIds.push(currentValue._id);
  });
  if (postIds.length > 0) {
    comments = await deleteAllCommentsByPostIds(postIds);
  }
  return { posts, comments };
}

export {
  findPosts,
  findPostsByAuthorId,
  findPostById,
  modifyPost,
  createNewPost,
  deleteAllPostsByAuthorId,
  deletePostById
};
