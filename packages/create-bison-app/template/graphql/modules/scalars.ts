import {
  DateTimeResolver,
  EmailAddressResolver,
  JSONObjectResolver,
  PhoneNumberResolver,
  URLResolver,
} from 'graphql-scalars';
import { asNexusMethod } from 'nexus';
import { GraphQLScalarType, Kind } from 'graphql';

export const ComparisonOperatorScalarType = new GraphQLScalarType({
  name: 'ComparisonOperator',
  description: 'Allows values typically used in comparison operators: string, number, Date object',
  // parseValue and serialize are used to ensure validity
  parseValue: (value) => {
    return typeof value === 'object' || typeof value === 'string' || typeof value === 'number' ? value
      : null
  },
  serialize: (value) => {
    return typeof value === 'object' || typeof value === 'string' || typeof value === 'number' ? value
      : null
  },
  parseLiteral: (ast) => {
    switch (ast.kind) {
      case Kind.STRING:
      case Kind.INT:
        return ast.value;
      case Kind.OBJECT: return parseObject(ast);
      default: return null
    }
  }
});

const parseObject = (ast) => {
  const value = Object.create(null);
  ast.fields.forEach((field) => {
    value[field.name.value] = parseAst(field.value);
  });
  return value;
}

const parseAst = (ast) => {
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
export const Comparison = asNexusMethod(ComparisonOperatorScalarType, 'compare');
