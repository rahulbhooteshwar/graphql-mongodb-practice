import { findPostsByAuthorId } from '../../services/PostService';
import { findCommentsByAuthorId } from '../../services/CommentService';
const User = {
  posts: (parent) => {
    return findPostsByAuthorId(parent._id);
  },
  comments: (parent) => {
    return findCommentsByAuthorId(parent._id);
  }
}

export { User as default }