import { objectType, inputObjectType } from 'nexus';

// Profile Type
export const Profile = objectType({
  name: 'Profile',
  description: 'A User Profile',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');
    t.nonNull.string('firstName');
    t.nonNull.string('lastName');
    t.nonNull.field('user', {
      type: 'User',
      resolve: (parent, _, context) => {
        return context.prisma.profile
          .findUnique({
            where: { id: parent.id },
          })
          .user();
      },
    });

    t.string('fullName', {
      description: 'The first and last name of a user',
      resolve({ firstName, lastName }) {
        return [firstName, lastName].filter((n) => Boolean(n)).join(' ');
      },
    });
  },
});

export const ProfileCreateInput = inputObjectType({
  name: 'ProfileCreateInput',
  description: 'Profile Input for relational Create',
  definition(t) {
    t.nonNull.string('firstName');
    t.nonNull.string('lastName');
  },
});

export const ProfileRelationalCreateInput = inputObjectType({
  name: 'ProfileRelationalCreateInput',
  description: 'Input to Add a new user',
  definition(t) {
    t.nonNull.field('create', { type: 'ProfileCreateInput' });
  },
});
