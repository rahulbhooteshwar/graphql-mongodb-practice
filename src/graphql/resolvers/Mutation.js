import { modifyComment, createNewComment, deleteCommentById } from "../../services/CommentService";
import { modifyPost, createNewPost, deletePostById } from "../../services/PostService";
import { modifyUser, createNewUser, deleteUserById } from "../../services/UserService";

const Mutation = {
  createUser: (_parent, { data }) => {
    return createNewUser(data);
  },
  createPost: async (_parent, { data }, { pubsub }) => {
    const post = await createNewPost(data);
    if (data.published) {
      // trigger subscription event
      pubsub.publish('post', {
        post: {
          mutation: "CREATED",
          data: post
        }
      })
    }
    return post;
  },
  createComment: async (_parent, { data }, { pubsub }) => {
    const comment = await createNewComment(data);
    pubsub.publish(`comment on post with id: ${data.post}`, { comment: { mutation: "CREATED", data: comment } });
    return comment;
  },
  deleteUser: async (_parent, { _id }, { pubsub }) => {
    const { user, posts, comments } = await deleteUserById(_id);
    // posts.map((post) => {
    //   if (post.published) {
    //     pubsub.publish('post', {
    //       post: {
    //         mutation: 'DELETED',
    //         data: post
    //       }
    //     })
    //   }
    // });
    // comments.map((comment) => {
    //   pubsub.publish(`comment on post with id: ${comment.post}`, { comment: { mutation: "DELETED", data: comment } });
    // });
    return user;
  },
  deletePost: async (_parent, { _id }, { pubsub }) => {
    const { post, comments } = await deletePostById(_id);
    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: post
        }
      })
    }
    // comments.map((comment) => {
    //   pubsub.publish(`comment on post with id: ${comment.post}`, { comment: { mutation: "DELETED", data: comment } });
    // })
    return post;
  },
  deleteComment: async (_parent, { _id }, { pubsub }) => {
    const commentToBeDeleted = await deleteCommentById(_id);
    pubsub.publish(`comment on post with id: ${commentToBeDeleted.post}`, { comment: { mutation: "DELETED", data: commentToBeDeleted } });
    return commentToBeDeleted;
  },
  updateUser: (_parent, { _id, data }) => {
    return modifyUser(_id, data);
  },
  updatePost: async (_parent, { _id, data }, { pubsub }) => {
    const { post, old } = await modifyPost(_id, data);
    if (typeof data.published === 'boolean') {
      if (old.published && !post.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: old
          }
        })
      } else if (!old.published && post.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: post
          }
        })
      }
    } else if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: post
        }
      })
    }
    return post;
  },
  updateComment: async (_parent, { _id, data }, { pubsub }) => {
    const comment = await modifyComment(_id, data);
    pubsub.publish(`comment on post with id: ${comment.post}`, { comment: { mutation: "UPDATED", data: comment } });
    return comment;
  }
}

export { Mutation as default }