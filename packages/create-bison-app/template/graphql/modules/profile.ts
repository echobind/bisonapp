import { objectType } from '@nexus/schema';

// Profile Type
export const Profile = objectType({
  name: 'Profile',
  description: 'A User Profile',
  definition(t) {
    t.model.id();
    t.model.firstName();
    t.model.lastName();
    t.model.createdAt();
    t.model.updatedAt();
    t.model.user();

    t.string('fullName', {
      nullable: true,
      description: 'The first and last name of a user',
      resolve({ firstName, lastName }) {
        return [firstName, lastName].filter((n) => Boolean(n)).join(' ');
      },
    });
  },
});
