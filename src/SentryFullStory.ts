import * as Sentry from '@sentry/browser';
import { Event, EventHint } from '@sentry/types';
import * as FullStory from '@fullstory/browser';

import { doesFullStoryExist, getOriginalExceptionProperties, getSentryUrl } from './util';
import { FullStoryClient } from './types';

/**
 * This integration creates a link from the Sentry Error to the FullStory replay.
 * It also creates a link from the FullStory event to the Sentry error.
 * Docs on Sentry SDK integrations are here: https://docs.sentry.io/platforms/javascript/guides/angular/troubleshooting/#dealing-with-integrations
 */

type Options = {
  baseSentryUrl?: string;
  client?: FullStoryClient;
};

class SentryFullStory {
  public readonly name: string = SentryFullStory.id;
  public static id: string = 'SentryFullStory';
  sentryOrg: string;
  baseSentryUrl: string;
  client: FullStoryClient;

  constructor(sentryOrg: string, options: Options = {}) {
    this.sentryOrg = sentryOrg;
    this.client = options.client || FullStory;
    this.baseSentryUrl = options.baseSentryUrl || 'https://sentry.io';
  }

  setupOnce() {
    Sentry.addGlobalEventProcessor((event: Event, hint?: EventHint) => {
      const self = Sentry.getCurrentHub().getIntegration(SentryFullStory);
      // Run the integration ONLY when it was installed on the current Hub AND isn't a transaction
      if (self && event.type !== 'transaction' && doesFullStoryExist()) {

        const getFullStoryUrl = () => {
          // getCurrentSessionURL isn't available until after the FullStory script is fully bootstrapped.
          // If an error occurs before getCurrentSessionURL is ready, make a note in Sentry and move on.
          // More on getCurrentSessionURL here: https://help.fullstory.com/develop-js/getcurrentsessionurl
          try {
            return this.client.getCurrentSessionURL(true) || 'Current session URL API not ready'
          } catch (e) {
            const reason = e instanceof Error ? e.message : String(e)
            return `Unable to get url: ${reason}`
          }
        }

        event.contexts = {
          ...event.contexts,
          fullStory: {
            fullStoryUrl: getFullStoryUrl()
          },
        };

        try {
          this.client.event('Sentry Error', {
            sentryUrl: getSentryUrl({
              baseSentryUrl: this.baseSentryUrl,
              sentryOrg: this.sentryOrg,
              hint,
            }),
            ...getOriginalExceptionProperties(hint),
          });
        } catch (e) {
          console.debug('Unable to report sentry error details to FullStory')
        }
      }

      return event;
    });
  }
}

export default SentryFullStory;
