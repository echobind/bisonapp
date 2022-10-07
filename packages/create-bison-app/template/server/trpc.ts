import { initTRPC, TRPCError } from '@trpc/server';
import { TRPC_ERROR_CODE_KEY } from '@trpc/server/rpc';

import type { Context } from './context';

import { transformer } from '@/lib/trpc';

export const t = initTRPC.context<Context>().create({
  transformer,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        invalidArgs: error instanceof BisonError ? error.invalidArgs : undefined,
        message: error.message,
      },
    };
  },
});

export class BisonError extends TRPCError {
  invalidArgs?: Record<string, any>;
  constructor(data: {
    message?: string;
    code: TRPC_ERROR_CODE_KEY;
    cause?: unknown;
    invalidArgs?: Record<string, any>;
  }) {
    const { invalidArgs, ...superData } = data;
    super(superData);

    this.invalidArgs = invalidArgs;
  }
}
