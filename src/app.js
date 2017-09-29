// import koa from 'koa'; // koa@2
// import koaRouter from 'koa-router'; // koa-router@next
// import koaBody from 'koa-bodyparser'; // koa-bodyparser@next
// import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa';
// import {makeExecutableSchema} from 'graphql-tools'
// import schema from './schema';

// const app = new koa();
// const router = new koaRouter();
// const PORT = 3000;

// // koaBody is needed just for POST.
// router.post('/graphql', koaBody(), graphqlKoa({ schema: schema }));
// router.get('/graphql', graphqlKoa({ schema: schema }));

// router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

// app.use(router.routes());
// app.use(router.allowedMethods());
// //app.listen(PORT);

// export default app;

// @flow

import 'isomorphic-fetch';

import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import convert from 'koa-convert';
import cors from 'kcors';
import graphqlHttp from 'koa-graphql';
import graphqlBatchHttpWrapper from 'koa-graphql-batch';
import logger from 'koa-logger';
import Router from 'koa-router';
import { print } from 'graphql/language';

import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa';

import { schema } from './schema';
import { jwtSecret } from './config';
import { getUser } from './auth';
import * as loaders from './loader';

const app = new Koa();
const router = new Router();

app.keys = jwtSecret;

const graphqlSettingsPerReq = async (req) => {

  const { user } = await getUser(req.header.authorization);

  const dataloaders = Object.keys(loaders).reduce((dataloaders, loaderKey) => ({
    ...dataloaders,
    [loaderKey]: loaders[loaderKey].getLoader(),
  }), {});

  return {
    graphiql: process.env.NODE_ENV !== 'production',
    schema,
    context: {
      user,
      req,
      dataloaders,
    },
    extensions: ({ document, variables, operationName, result }) => {
      console.log(print(document));
      console.log(variables);
      console.log(result);
    },
    formatError: (error) => {
      console.log(error.message);
      console.log(error.locations);
      console.log(error.stack);

      return {
        message: error.message,
        locations: error.locations,
        stack: error.stack,
      };
    },
  };
};

const graphqlServer = convert(graphqlHttp(graphqlSettingsPerReq));

// graphql batch query route
router.all('/graphql/batch', bodyParser(), graphqlBatchHttpWrapper(graphqlServer));

// graphql standard route
router.all('/graphql', graphqlServer);

router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

app.use(logger());
app.use(cors());
app.use(router.routes()).use(router.allowedMethods());

export default app;

