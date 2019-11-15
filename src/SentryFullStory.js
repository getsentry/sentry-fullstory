import * as Sentry from '@sentry/browser';

import * as FullStory from './FullStoryWrapper';
import * as util from './util';

/**
 * This integration creates a link from the Sentry Error to the FullStory replay.
 * It also creates a link from the FullStory event to the Sentry error.
 * Docs on Sentry SDK integrations are here: https://docs.sentry.io/platforms/javascript/advance-settings/#dealing-with-integrations
 */

class SentryFullStory {
  constructor(sentryOrg, options = {}) {
    this.name = 'SentryFullStory';
    this.sentryOrg = sentryOrg;
    this.baseSentryUrl = options.baseSentryUrl || 'https://sentry.io';
  }
  setupOnce() {
    Sentry.addGlobalEventProcessor((event, hint) => {
      const self = Sentry.getCurrentHub().getIntegration(SentryFullStory);
      // Run the integration ONLY when it was installed on the current Hub
      if (self) {
        // getCurrentSessionURL isn't available until after the FullStory script is fully bootstrapped.
        // If an error occurs before getCurrentSessionURL is ready, make a note in Sentry and move on.
        // More on getCurrentSessionURL here: https://help.fullstory.com/develop-js/getcurrentsessionurl
        event.contexts = {
          ...event.contexts,
          fullStory: {
            url:
              FullStory.getCurrentSessionURL(true) ||
              'current session URL API not ready'
          }
        };

        let sentryUrl;
        try {
          //No docs on this but the SDK team assures me it works unless you bind another Sentry client
          const { dsn } = Sentry.getCurrentHub()
            .getClient()
            .getOptions();
          const projectId = util.getProjectIdFromSentryDsn(dsn);
          sentryUrl = `${this.baseSentryUrl}/organizations/${this.sentryOrg}/issues/?project=${projectId}&query=${hint.event_id}`;
        } catch (err) {
          console.error('Error retrieving project ID from DSN');
          //TODO: Could put link to a help here
          sentryUrl = 'Could not retrieve url';
        }

        // FS.event is immediately ready even if FullStory isn't fully bootstrapped
        FullStory.event('Sentry Error', { sentryUrl });
      }
      return event;
    });
  }
}

SentryFullStory.id = 'SentryFullStory';

export default SentryFullStory;
