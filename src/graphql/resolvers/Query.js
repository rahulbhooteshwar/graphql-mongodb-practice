import { findUsers } from '../../services/UserService';
import { findPosts } from '../../services/PostService';
import { findComments } from '../../services/CommentService';

const Query = {
  posts: (_parent, { keyword }) => {
    return findPosts(keyword);
  },
  users: (_parent, { keyword }) => {
    return findUsers(keyword);
  },
  comments: () => {
    return findComments();
  }
}

export { Query as default }