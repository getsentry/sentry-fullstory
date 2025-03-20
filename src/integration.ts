import type { Integration } from '@sentry/types';
import type { FullStoryClient } from './types';
import {
  doesFullStoryExist,
  getFullStoryUrl,
  getOriginalExceptionProperties,
  getSentryUrl,
} from './util';

/**
 * This integration creates a link from the Sentry Error to the FullStory replay.
 * It also creates a link from the FullStory event to the Sentry error.
 * Docs on Sentry SDK integrations are here: https://docs.sentry.io/platforms/javascript/guides/angular/troubleshooting/#dealing-with-integrations
 */

type Options = {
  client: FullStoryClient;
  baseSentryUrl?: string;
};

const INTEGRATION_NAME = 'SentryFullStory';

export function fullStoryIntegration(
  sentryOrg: string,
  options: Options
): Integration {
  const fullStoryClient = options.client;
  const baseSentryUrl = options.baseSentryUrl || 'https://sentry.io';
  let fullStoryUrl: string | undefined;

  return {
    name: INTEGRATION_NAME,
    async processEvent(event, hint, client) {
      const self = client.getIntegrationByName(INTEGRATION_NAME);
      // Run the integration ONLY when it was installed on the current Hub AND isn't a transaction
      if (self && event.type === undefined && doesFullStoryExist()) {
        if (!fullStoryUrl) {
          try {
            fullStoryUrl = await getFullStoryUrl(fullStoryClient);
          } catch (e) {
            const reason = e instanceof Error ? e.message : String(e);
            console.error(`Unable to get FullStory session URL: ${reason}`);
          }
        }

        if (fullStoryUrl) {
          event.contexts = {
            ...event.contexts,
            fullStory: {
              fullStoryUrl,
            },
          };
        }

        try {
          fullStoryClient.event('Sentry Error', {
            sentryUrl: getSentryUrl({
              baseSentryUrl: baseSentryUrl,
              sentryOrg,
              hint,
              client,
            }),
            ...getOriginalExceptionProperties(hint),
          });
        } catch (e) {
          console.debug('Unable to report sentry error details to FullStory');
        }
      }

      return event;
    },
  };
}
