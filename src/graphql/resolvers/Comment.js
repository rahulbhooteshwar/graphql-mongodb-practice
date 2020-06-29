import { findPostById } from "../../services/PostService";
import { findUserById } from "../../services/UserService";

const Comment = {
  post: (parent) => {
    return findPostById(parent.post);
  },
  author: (parent) => {
    return findUserById(parent.author);
  }
}

export { Comment as default }