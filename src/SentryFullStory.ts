import * as FullStory from '@fullstory/browser';
import { Event, EventHint, EventProcessor, Hub, Integration } from '@sentry/types';

import * as util from './util';

type Options = {
  baseSentryUrl?: string;
};

/** Get current DSN from hub */
function getDsnFromHub(hub: Hub): string | undefined {
  const client = hub.getClient();
  if (!client) {
    return undefined;
  }

  const options = client.getOptions();
  return options.dsn;
}

/**
 * Sentry Full Story integration.
 *
 * This integration creates a link from the Sentry Error to the FullStory replay.
 * It also creates a link from the FullStory event to the Sentry error.
 * Docs on Sentry SDK integrations are here: https://docs.sentry.io/platforms/javascript/advance-settings/#dealing-with-integrations
 */
class SentryFullStory implements Integration {
  /**
   * @inheritDoc
   */
  public static id: string = 'SentryFullStory';

  /**
   * @inheritDoc
   */
  public readonly name: string = SentryFullStory.id;

  private readonly _baseSentryUrl: string;

  constructor(private readonly _sentryOrg: string, options: Options = {}) {
    this._baseSentryUrl = options.baseSentryUrl || 'https://sentry.io';
  }

  /**
   * @inheritDoc
   */
  public setupOnce(addGlobalEventProcessor: (callback: EventProcessor) => void, getCurrentHub: () => Hub): void {
    addGlobalEventProcessor((event: Event, hint?: EventHint) => {
      const hub = getCurrentHub();
      if (!hub) {
        // eslint-disable-next-line no-console
        console.error('Could not access hub');
        return event;
      }

      const dsn = getDsnFromHub(hub);

      // Returns the sentry URL of the error
      // If we cannot get the URL, return a string saying we cannot
      const getSentryUrl = (): string => {
        try {
          if (!dsn) {
            // eslint-disable-next-line no-console
            console.error('No dsn');
            return 'Could not retrieve url';
          }
          if (!hint) {
            // eslint-disable-next-line no-console
            console.error('No event hint');
            return 'Could not retrieve url';
          }
          const projectId = util.getProjectIdFromSentryDsn(dsn);
          return `${this._baseSentryUrl}/organizations/${this._sentryOrg}/issues/?project=${projectId}&query=${hint.event_id}`;
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Error retrieving project ID from DSN', err);

          // TODO: Could put link to a help here
          return 'Could not retrieve url';
        }
      };

      const self = hub.getIntegration(SentryFullStory);
      // Run the integration ONLY when it was installed on the current Hub
      if (self) {
        // getCurrentSessionURL isn't available until after the FullStory script is fully bootstrapped.
        // If an error occurs before getCurrentSessionURL is ready, make a note in Sentry and move on.
        // More on getCurrentSessionURL here: https://help.fullstory.com/develop-js/getcurrentsessionurl
        event.contexts = {
          ...event.contexts,
          fullStory: {
            fullStoryUrl: FullStory.getCurrentSessionURL(true) || 'current session URL API not ready',
          },
        };
        // FS.event is immediately ready even if FullStory isn't fully bootstrapped
        FullStory.event('Sentry Error', {
          sentryUrl: getSentryUrl(),
          ...util.getOriginalExceptionProperties(hint),
        });
      }
      return event;
    });
  }
}

export default SentryFullStory;
