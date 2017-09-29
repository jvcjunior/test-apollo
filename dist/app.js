'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _koaBodyparser = require('koa-bodyparser');

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _apolloServerKoa = require('apollo-server-koa');

var _graphqlTools = require('graphql-tools');

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// koa-router@next
var app = new _koa2.default(); // koa-bodyparser@next
// koa@2

var router = new _koaRouter2.default();
var PORT = 3000;

// koaBody is needed just for POST.
router.post('/graphql', (0, _koaBodyparser2.default)(), (0, _apolloServerKoa.graphqlKoa)({ schema: _schema2.default }));
router.get('/graphql', (0, _apolloServerKoa.graphqlKoa)({ schema: _schema2.default }));

router.get('/graphiql', (0, _apolloServerKoa.graphiqlKoa)({ endpointURL: '/graphql' }));

app.use(router.routes());
app.use(router.allowedMethods());
//app.listen(PORT);

exports.default = app;