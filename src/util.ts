import { EventHint } from '@sentry/types';

/**
 * Split the URL into different parts
 * taken from https://stackoverflow.com/questions/736513/how-do-i-parse-a-url-into-hostname-and-path-in-javascript
 * @param {string} url
 */
const splitUrlIntoParts = (url: string): RegExpMatchArray | null => {
  const reURLInformation = new RegExp(
    [
      '^(https?:)//', // protocol
      '(([^:/?#]*)(?::([0-9]+))?)', // host (hostname and port)
      '(/{0,1}[^?#]*)', // pathname
      '(\\?[^#]*|)', // search
      '(#.*|)$', // hash
    ].join(''),
  );
  return url.match(reURLInformation);
};

/**
 * Get the project ID from a Sentry DSN
 * @param {string} dsn
 */
export const getProjectIdFromSentryDsn = (dsn: string): string => {
  const parts = splitUrlIntoParts(dsn);
  if (!parts) {
    throw new Error('Cannot parse DSN');
  }
  return parts[5].replace('/', '');
};

const isError = (exception: string | Error): exception is Error => {
  return (exception as Error).message !== undefined;
};

/**
 * Get the message and name properties from the original exception
 * @param {EventHint} hint
 */
export const getOriginalExceptionProperties = (hint?: EventHint): { name: string; message: string } | Record<string, unknown> => {
  if (hint && hint.originalException && isError(hint.originalException)) {
    const originalException = hint.originalException;
    const { name, message } = originalException;
    return { name, message };
  }

  return {};
};
