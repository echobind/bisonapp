/**
 * Builds up a Prisma include object based on the presence of connect/create keys
 */
export function buildPrismaIncludeFromAttrs(attrs: Record<string, any>) {
  const include = Object.keys(attrs).reduce((prev, curr) => {
    const value = attrs[curr];
    const isObject = typeof value === 'object';
    const isRelation = isObject && Object.keys(value).find((v) => v.match(/connect|create/));

    if (isRelation) {
      prev[curr] = true;
    }

    return prev;
  }, Object.create(null));

  const hasInclude = Object.keys(include).length;
  return hasInclude ? include : undefined;
}
