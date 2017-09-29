'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _user = require('../model/user');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
//import { find, filter } from 'lodash';

var resolveFunctions = {
  Query: {
    places: function (_places) {
      function places() {
        return _places.apply(this, arguments);
      }

      places.toString = function () {
        return _places.toString();
      };

      return places;
    }(function () {
      return places;
    })
  },
  Mutation: {
    RegisterEmail: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(root, args, context, info) {
        var email, user;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // const res = await Posts.insert(args)
                // return prepare(await Posts.findOne({_id: res.insertedIds[1]}))
                console.log('*************************');
                console.log('ARGS MUUTAION REGISTER EMAIL', args);
                console.log('*************************');
                email = args.email;
                _context.next = 6;
                return _user.User.findOne({ email: email.toLowerCase() });

              case 6:
                user = _context.sent;

                if (!user) {
                  _context.next = 9;
                  break;
                }

                return _context.abrupt('return', {
                  token: null,
                  error: 'EMAIL_ALREADY_IN_USE'
                });

              case 9:

                user = new _user.User({
                  name: name,
                  email: email,
                  password: password
                });
                _context.next = 12;
                return user.save();

              case 12:
                return _context.abrupt('return', {
                  token: generateToken(user),
                  error: null
                });

              case 13:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      function RegisterEmail(_x, _x2, _x3, _x4) {
        return _ref.apply(this, arguments);
      }

      return RegisterEmail;
    }()
  }
};

exports.default = resolveFunctions;