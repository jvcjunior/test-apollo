'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadUsers = exports.clearCache = exports.load = exports.getLoader = undefined;

var _dataloader = require('dataloader');

var _dataloader2 = _interopRequireDefault(_dataloader);

var _user = require('../model/user');

var _graphqlMongooseLoader = require('@entria/graphql-mongoose-loader');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import type { ConnectionArguments } from 'graphql-relay';
var User = function User(data, _ref) {
  var user = _ref.user;

  _classCallCheck(this, User);

  this.id = data.id;
  this._id = data._id;
  this.name = data.name;

  // you can only see your own email, and your active status
  if (user && user._id.equals(data._id)) {
    this.email = data.email;
    this.active = data.active;
  }
};

exports.default = User;
var getLoader = exports.getLoader = function getLoader() {
  return new _dataloader2.default(function (ids) {
    return (0, _graphqlMongooseLoader.mongooseLoader)(_user.User, ids);
  });
};

var viewerCanSee = function viewerCanSee(viewer, data) {
  // Anyone can see another user
  return true;
};

var load = exports.load = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(context, id) {
    var data;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (id) {
              _context.next = 2;
              break;
            }

            return _context.abrupt('return', null);

          case 2:
            data = void 0;
            _context.prev = 3;
            _context.next = 6;
            return context.dataloaders.UserLoader.load(id);

          case 6:
            data = _context.sent;
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](3);
            return _context.abrupt('return', null);

          case 12:
            return _context.abrupt('return', viewerCanSee(context, data) ? new User(data, context) : null);

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[3, 9]]);
  }));

  return function load(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

var clearCache = exports.clearCache = function clearCache(_ref3, id) {
  var dataloaders = _ref3.dataloaders;

  return dataloaders.UserLoader.clear(id.toString());
};

var loadUsers = exports.loadUsers = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(context, args /*: ConnectionArguments*/) {
    var where, users;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            where = args.search ? { name: { $regex: new RegExp('^' + args.search, 'ig') } } : {};
            users = _user.User.find(where, { _id: 1 }).sort({ createdAt: -1 });
            return _context2.abrupt('return', (0, _graphqlMongooseLoader.connectionFromMongoCursor)({
              cursor: users,
              context: context,
              args: args,
              loader: load
            }));

          case 3:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function loadUsers(_x3, _x4) {
    return _ref4.apply(this, arguments);
  };
}();