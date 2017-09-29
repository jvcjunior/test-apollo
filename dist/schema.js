'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphqlTools = require('graphql-tools');

var _resolvers = require('./resolvers');

var _resolvers2 = _interopRequireDefault(_resolvers);

var _schema = require('./model/user/schema');

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// resolvers
var schema = '\n  ' + _schema2.default + '\n\n  type Token {\n    token: String,\n    error: String\n  }\n\n  # the schema allows the following query:\n  type Query {\n    users: [User]\n  }\n  # this schema allows the following mutation:\n  type Mutation {\n    RegisterEmail (name: String, email: String, password: String): Token\n  }\n';
// models
exports.default = (0, _graphqlTools.makeExecutableSchema)({
  typeDefs: schema,
  resolvers: _resolvers2.default
});