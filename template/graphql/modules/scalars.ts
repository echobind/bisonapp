import { DateTimeResolver, JSONObjectResolver } from 'graphql-scalars';
import { asNexusMethod } from '@nexus/schema';

export const jsonScalar = asNexusMethod(JSONObjectResolver, 'json');
export const dateTimeScalar = asNexusMethod(DateTimeResolver, 'date');
