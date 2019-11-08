import * as Sentry from '@sentry/browser';

// NOTE: this will be a package hosted on NPM soon
import FullStory from './fullstory';

/**
 * This integration creates a link from the Sentry Error to the FullStory replay.
 * It also creates a link from the FullStory event to the Sentry error.
 * Docs on Sentry SDK integrations are here: https://docs.sentry.io/platforms/javascript/advance-settings/#dealing-with-integrations
 */

class SentryFullStory {
  constructor(sentryOrg, sentryProject) {
    this.name = 'SentryFullStory';
    this.sentryOrg = sentryOrg;
    this.sentryProject = sentryProject;
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

        // FS.event is immediately ready even if FullStory isn't fully bootstrapped
        FullStory.event('Sentry Error', {
          sentryUrl: `https://sentry.io/organizations/${this.sentryOrg}/projects/${this.sentryProject}/events/${hint.event_id}/`
        });
      }
      return event;
    });
  }
}

SentryFullStory.id = 'SentryFullStory';

export default SentryFullStory;
