import { UseFormSetError } from 'react-hook-form';

/**
 * Sets errors on the frontend from a tRPC Response. Assumes BisonError is used in the backend and react-hook-form.
 */
export function setErrorsFromTRPCError(setError: UseFormSetError<any>, error: ErrorResponse) {
  const errorObjects = error.data.invalidArgs || {};
  Object.keys(errorObjects).forEach((key) => {
    setError(key, { type: 'manual', message: errorObjects[key] });
  });
}

interface ErrorResponse {
  data: {
    code: string;
    invalidArgs: Record<string, any>;
    path: string;
  };
  message: string;
}
