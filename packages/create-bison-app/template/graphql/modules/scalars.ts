import { DateTimeResolver, JSONObjectResolver } from 'graphql-scalars';
import { asNexusMethod } from 'nexus';

export const jsonScalar = asNexusMethod(JSONObjectResolver, 'json');
export const dateTimeScalar = asNexusMethod(DateTimeResolver, 'date');
