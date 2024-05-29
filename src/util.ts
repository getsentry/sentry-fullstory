import type { Client, EventHint } from '@sentry/types';
import { FullStoryClient } from './types';

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

const isError = (exception: unknown): exception is Error => {
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
  client,
}: {
  hint?: EventHint;
  sentryOrg: string;
  baseSentryUrl: string;
  client: Client;
}) {
  try {
    // No docs on this but the SDK team assures me it works unless you bind another Sentry client
    const { dsn } = client.getOptions();
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

export function getFullStoryUrl(
  fullStoryClient: FullStoryClient
): Promise<string> | string {
  // getCurrentSessionURL isn't available until after the FullStory script is fully bootstrapped.
  // If an error occurs before getCurrentSessionURL is ready, make a note in Sentry and move on.
  // More on getCurrentSessionURL here: https://help.fullstory.com/develop-js/getcurrentsessionurl
  try {
    const res = fullStoryClient.getCurrentSessionURL?.(true);
    if (!res) {
      throw new Error('No FullStory session URL found');
    }

    return res;
  } catch (e) {
    const reason = e instanceof Error ? e.message : String(e);
    throw new Error(`Unable to get url: ${reason}`);
  }
}
