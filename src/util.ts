import type { EventHint, Hub } from '@sentry/types';

/**
 * Returns true if Fullstory is installed correctly.
 */
export function doesFullStoryExist() {
  return !!window[window['_fs_namespace']];
}

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

/**
 * Returns the sentry URL of the error. If we cannot get the URL, return a
 * string saying we cannot.
 */
export function getSentryUrl({
  hint,
  sentryOrg,
  baseSentryUrl,
  hub,
}: {
  hint?: EventHint;
  sentryOrg: string;
  baseSentryUrl: string;
  hub: Hub;
}) {
  try {
    // No docs on this but the SDK team assures me it works unless you bind another Sentry client
    const { dsn } = hub.getClient()?.getOptions() || {};
    if (!dsn) {
      console.error('No sn');
      return 'Could not retrieve url';
    }
    if (!hint) {
      console.error('No event hint');
      return 'Could not retrieve url';
    }
    const projectId = getProjectIdFromSentryDsn(dsn);
    return `${baseSentryUrl}/organizations/${sentryOrg}/issues/?project=${projectId}&query=${hint.event_id}`;
  } catch (err) {
    console.error('Error retrieving project ID from DSN', err);
    //TODO: Could put link to a help here
    return 'Could not retrieve url';
  }
}
