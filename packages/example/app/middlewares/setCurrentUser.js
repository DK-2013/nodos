import User from '../entities/User';
import Guest from '../entities/Guest';

export default async (request) => {
  const { userId } = request.session;
  const currentUser = userId
    ? await User.query().findById(userId)
    : new Guest();

  request.currentUser = currentUser;
};
