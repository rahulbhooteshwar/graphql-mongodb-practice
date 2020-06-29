import UserModel from '../models/User.model';
import { deleteAllPostsByAuthorId } from './PostService';
import { deleteAllCommentsByAuthorId } from './CommentService';

const findUsers = async (keyword) => {
  let filter = {}
  if (keyword) {
    const match = { $regex: keyword, $options: "i" }
    filter = { $or: [{ name: match }, { email: match }] }
  }
  try {
    const users = await UserModel.find(filter);
    return users;
  } catch (err) {
    throw err
  }
}

const findUserById = async (userId) => {
  try {
    const user = await UserModel.findById(userId);
    return user;
  } catch (err) {
    throw err;
  }
}

const modifyUser = async (_id, data) => {
  try {
    const user = await UserModel.findById(_id);
    if (!user) {
      throw new Error("Specified user doesn't exist....")
    }
    // we need following checks as in our update input type these fields are optional, so someone can pass null as well & it will break User Schema for name & email
    if (typeof data.email === 'string') {
      const userWithEmail = await UserModel.findOne({ email: data.email });
      if (userWithEmail) {
        throw new Error('Email Already Taken....')
      }
      user.email = data.email
    }
    if (typeof data.name === 'string') {
      user.name = data.name
    }
    if (typeof data.age !== 'undefined') {
      user.age = data.age
    }
    await user.save();
    return user
  } catch (err) {
    throw err;
  }
}

const createNewUser = async (data) => {
  try {
    const users = await UserModel.find({ email: data.email });
    if (users.length > 0) {
      throw new Error('Email Already Taken....')
    } else {
      const user = new UserModel({
        ...data
      });
      const result = await user.save();
      return result;
    }
  } catch (err) {
    throw err
  }
}

const deleteUserById = async (_id) => {
  try {
    const user = await UserModel.findById(_id);
    if (!user) {
      throw new Error("Specified user doesn't exist....");
    } else {
      await user.remove();
      // remove associated posts
      const { posts, comments } = await deleteAllPostsByAuthorId(_id);
      const commentsByAuthor = await deleteAllCommentsByAuthorId(_id);
      const allComments = comments.concat(commentsByAuthor);
      return { user, posts, comments: allComments};
    }
  } catch (err) {
    throw err;
  }
}


export {
  findUsers,
  findUserById,
  modifyUser,
  createNewUser,
  deleteUserById
}