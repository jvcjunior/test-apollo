import mongoose from 'mongoose';
//import { find, filter } from 'lodash';

import { User } from './model/user';

const resolveFunctions = {
  Query: {
    users() {
      return [];
    },
  },
  Mutation: {
    RegisterEmail: async (root, args, context, info) => {
          // const res = await Posts.insert(args)
          // return prepare(await Posts.findOne({_id: res.insertedIds[1]}))
          console.log('User', User);
          console.log('*************************');
          console.log('ARGS MUUTAION REGISTER EMAIL', args);
          console.log('*************************');
          const { email } = args;
          let user = await User.findOne({ email: email.toLowerCase() });

          if (user) {
            return {
              token: null,
              error: 'EMAIL_ALREADY_IN_USE',
            };
          }

          user = new User({
            name,
            email,
            password,
          });
          await user.save();

          return {
            token: generateToken(user),
            error: null,
          };
    },
  },
};

export default resolveFunctions;