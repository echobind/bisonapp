import { ErrorOption } from 'react-hook-form';

/**
 * Sets errors on the frontend from a GraphQL Response. Assumes react-hook-form.
 */
export function setErrorsFromGraphQLErrors(setError: SetErrorFn, errors: ErrorResponse[]) {
  return (errors || []).forEach((e) => {
    const errorObjects = e.extensions.invalidArgs || {};
    Object.keys(errorObjects).forEach((key) => {
      setError(key, { type: 'manual', message: errorObjects[key] });
    });
  });
}

type SetErrorFn = (e: string, obj: ErrorOption) => void;

interface ErrorResponse {
  extensions: {
    code: string;
    invalidArgs: Record<string, any>;
    message: string;
  };
}
