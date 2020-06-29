import { findPostById } from "../../services/PostService";

const Subscription = {
  comment: {
    subscribe: async (_parent, { postId }, { pubsub }) => {
      const post = await findPostById(postId);
      if (post) {
        return pubsub.asyncIterator(`comment on post with id: ${postId}`);
      } else {
        throw new Error("Specified post doesn't exist or not published....")
      }
    }
  },
  post: {
    subscribe: (_parent, _args, { pubsub }) => {
      return pubsub.asyncIterator('post');
    }
  }
}

export { Subscription as default }