import { findUserById } from "../../services/UserService";
import { findCommentsByPostId } from "../../services/CommentService";

const Post = {
  author: (parent) => {
    return findUserById(parent.author);
  },
  comments: (parent) => {
    return findCommentsByPostId(parent._id);
  }
}

export { Post as default }