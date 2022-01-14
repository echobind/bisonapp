import { ApolloError } from 'apollo-server-errors';

export class NotFoundError extends ApolloError {
  constructor(message: string) {
    super(message, 'NOT_FOUND');

    Object.defineProperty(this, 'name', { value: 'NotFoundError' });
  }
}
