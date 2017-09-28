import koa from 'koa'; // koa@2
import koaRouter from 'koa-router'; // koa-router@next
import koaBody from 'koa-bodyparser'; // koa-bodyparser@next
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa';
import {makeExecutableSchema} from 'graphql-tools'

const app = new koa();
const router = new koaRouter();
const PORT = 3000;


const typeDefs = [`
type Query {
  post(_id: String): Post
  posts: [Post]
  comment(_id: String): Comment
}
type Post {
  _id: String
  title: String
  content: String
  comments: [Comment]
}
type Comment {
  _id: String
  postId: String
  content: String
  post: Post
}
type Mutation {
  createPost(title: String, content: String): Post
  createComment(postId: String, content: String): Comment
}
schema {
  query: Query
  mutation: Mutation
}
`];

const prepare = (o) => {
  o._id = o._id.toString()
  return o
}

const Comments = [
    { id: 1, postId:1 , firstName: 'Tom', lastName: 'Coleman' },
    { id: 2, postId:1 ,firstName: 'Sashko', lastName: 'Stubailo' },
    { id: 3, postId:1 ,firstName: 'Mikhail', lastName: 'Novikov' },
  ];

  const Posts = [
    { id: 1, authorId: 1, title: 'Introduction to GraphQL', votes: 2 },
    { id: 2, authorId: 2, title: 'Welcome to Apollo', votes: 3 },
    { id: 3, authorId: 2, title: 'Advanced GraphQL', votes: 1 },
    { id: 4, authorId: 3, title: 'Launchpad is Cool', votes: 7 },
  ];

const resolvers = {
    Query: {
      post: async (root, {_id}) => {
        return prepare(await Posts.findOne(ObjectId(_id)))
      },
      posts: /*async*/ () => {
        return Posts/*(await Posts.map(prepare))*//*find({}).toArray()).map(prepare)*/
      },
      comment: async (root, {_id}) => {
        return prepare(await Comments.findOne(ObjectId(_id)))
      },
    },
    Post: {
      comments: async ({_id}) => {
        return (await Comments.find({postId: _id}).toArray()).map(prepare)
      }
    },
    Comment: {
      post: async ({postId}) => {
        return prepare(await Posts.findOne(ObjectId(postId)))
      }
    },
    Mutation: {
      createPost: async (root, args, context, info) => {
        const res = await Posts.insert(args)
        return prepare(await Posts.findOne({_id: res.insertedIds[1]}))
      },
      createComment: async (root, args) => {
        const res = await Comments.insert(args)
        return prepare(await Comments.findOne({_id: res.insertedIds[1]}))
      },
    },
  }

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  })


// koaBody is needed just for POST.
router.post('/graphql', koaBody(), graphqlKoa({ schema: schema }));
router.get('/graphql', graphqlKoa({ schema: schema }));

router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

app.use(router.routes());
app.use(router.allowedMethods());
//app.listen(PORT);

export default app;
