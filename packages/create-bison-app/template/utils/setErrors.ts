import { UseFormSetError } from 'react-hook-form';

/**
 * Sets errors on the frontend from a GraphQL Response. Assumes react-hook-form.
 */
export function setErrorsFromGraphQLErrors(
  setError: UseFormSetError<any>,
  errors: ErrorResponse[]
) {
  return (errors || []).forEach((e) => {
    const errorObjects = e.extensions.invalidArgs || {};
    Object.keys(errorObjects).forEach((key) => {
      setError(key, { type: 'manual', message: errorObjects[key] });
    });
  });
}

interface ErrorResponse {
  extensions: {
    code: string;
    invalidArgs: Record<string, any>;
    message: string;
  };
}
