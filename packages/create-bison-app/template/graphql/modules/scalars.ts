import {
  DateTimeResolver,
  EmailAddressResolver,
  JSONObjectResolver,
  PhoneNumberResolver,
  URLResolver,
} from 'graphql-scalars';
import { asNexusMethod } from 'nexus';

export const JSON = asNexusMethod(JSONObjectResolver, 'json');
export const DateTime = asNexusMethod(DateTimeResolver, 'date');
export const Email = asNexusMethod(EmailAddressResolver, 'email');
export const PhoneNumber = asNexusMethod(PhoneNumberResolver, 'phone');
export const URL = asNexusMethod(URLResolver, 'url');
