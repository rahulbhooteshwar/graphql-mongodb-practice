import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { GraphQLServer, PubSub } from 'graphql-yoga';

// resolvers
import Query from './graphql/resolvers/Query';
import Mutation from './graphql/resolvers/Mutation';
import Subscription from './graphql/resolvers/Subscription';

// internal resolvers
import User from './graphql/resolvers/User';
import Post from './graphql/resolvers/Post';
import Comment from './graphql/resolvers/Comment';


dotenv.config();

(async () => {
  const dbConnection = mongoose.connection;
  dbConnection.on('open', () => {
    console.log('Connected to Database...');
  })

  dbConnection.on('error', () => {
    console.error('Error in connecting to DB');
    process.exit(1);
  })
  await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
  // =============================================================

  const pubsub = new PubSub();

  const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment
  }

  const server = new GraphQLServer({
    typeDefs: './src/graphql/schema.graphql',
    resolvers,
    context: {
      pubsub
    }
  })


  server.start(() => {
    console.log('server started at http://localhost:4000');
  })
})();






