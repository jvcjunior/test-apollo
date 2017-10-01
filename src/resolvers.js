import User from './model/user';
import { generateToken } from './auth';

const resolveFunctions = {
  Query: {
    users() {
      return [];
    },
  },
  Mutation: {
    RegisterEmail: async (root, args) => {
      const { name, email, password } = args;
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
