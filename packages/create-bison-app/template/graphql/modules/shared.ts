import { enumType, inputObjectType } from 'nexus';

// the following items are migrated from the prisma plugin
export const SortOrder = enumType({
  name: 'SortOrder',
  description: 'Sort direction for filtering queries (ascending or descending)',
  members: ['asc', 'desc'],
});

export const StringFilter = inputObjectType({
  name: 'StringFilter',
  description: 'A way to filter string fields. Meant to pass to prisma where clause',
  definition(t) {
    t.string('contains');
    t.string('endsWith');
    t.string('equals');
    t.compare('gt');
    t.compare('gte');
    t.list.nonNull.string('in');
    t.compare('lt');
    t.compare('lte');
    t.list.nonNull.string('notIn');
    t.string('startsWith');
  },
});
