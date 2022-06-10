import {
  DateTimeResolver,
  EmailAddressResolver,
  JSONObjectResolver,
  PhoneNumberResolver,
  URLResolver,
} from 'graphql-scalars';
import { asNexusMethod } from 'nexus';
import { Kind, ObjectValueNode, ValueNode } from 'graphql';

const parseObject = (ast: ObjectValueNode) => {
  const value = Object.create(null);
  ast.fields.forEach((field) => {
    value[field.name.value] = parseAst(field.value);
  });

  return value;
};

const parseAst = (ast: ValueNode): any => {
  switch (ast.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value;
    case Kind.INT:
    case Kind.FLOAT:
      return parseFloat(ast.value);
    case Kind.OBJECT:
      return parseObject(ast);
    case Kind.LIST:
      return ast.values.map(parseAst);
    default:
      return null;
  }
};

export const JSON = asNexusMethod(JSONObjectResolver, 'json');
export const DateTime = asNexusMethod(DateTimeResolver, 'date');
export const Email = asNexusMethod(EmailAddressResolver, 'email');
export const PhoneNumber = asNexusMethod(PhoneNumberResolver, 'phone');
export const URL = asNexusMethod(URLResolver, 'url');
