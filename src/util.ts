import { EventHint } from '@sentry/types';

/**
 * Get the project ID from a Sentry DSN
 * @param {string} dsn
 */
export const getProjectIdFromSentryDsn = (dsn: string) => {
  return new URL(dsn).pathname.replace('/', '');
};

const isError = (exception: string | Error): exception is Error => {
  return (exception as Error).message !== undefined;
};

/**
 * Get the message and name properties from the original exception
 * @param {EventHint} hint
 */
export const getOriginalExceptionProperties = (hint?: EventHint) => {
  if (hint && hint.originalException && isError(hint.originalException)) {
    const originalException = hint.originalException;
    const { name, message } = originalException;
    return { name, message };
  }

  return {};
};
