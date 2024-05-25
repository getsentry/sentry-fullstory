import type {
  Client,
  Event,
  EventHint,
  EventProcessor,
  Hub,
  Integration,
} from '@sentry/types';
import type {
  Client as ClientV8,
  Event as EventV8,
  EventHint as EventHintV8,
  Integration as IntegrationV8,
} from '@sentry/typesv8';
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

type ProcessEventOptions = {
  baseSentryUrl: string;
  client: FullStoryClient;
  event: Event;
  hint: EventHint;
  self: Integration | null;
  sentryClient?: Client;
  sentryOrg: string;
  fullStoryUrl?: string;
};

type ProcessEventOptionsV8 = {
  baseSentryUrl: string;
  client: FullStoryClient;
  event: EventV8;
  hint: EventHintV8;
  self: IntegrationV8 | undefined;
  sentryClient?: ClientV8;
  sentryOrg: string;
  fullStoryUrl?: string;
};

async function processEvent({
  baseSentryUrl,
  client,
  event,
  hint,
  self,
  sentryOrg,
  sentryClient,
  fullStoryUrl,
}: ProcessEventOptions | ProcessEventOptionsV8): Promise<Event | EventV8> {
  // Run the integration ONLY when it was installed on the current Hub AND isn't a transaction
  if (self && event.type !== 'transaction' && doesFullStoryExist()) {
    if (!fullStoryUrl) {
      try {
        fullStoryUrl = await getFullStoryUrl(client);
      } catch (e) {
        const reason = e instanceof Error ? e.message : String(e);
        console.error(`Unable to get FullStory session URL: ${reason}`);
      }
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
    client.event('Sentry Error', {
      sentryUrl: getSentryUrl({
        baseSentryUrl: baseSentryUrl,
        sentryOrg,
        hint,
        client: sentryClient,
      }),
      ...getOriginalExceptionProperties(hint),
    });
  } catch (e) {
    console.debug('Unable to report sentry error details to FullStory');
  }

  return event;
}

class SentryFullStory implements Integration {
  public readonly name: string = SentryFullStory.id;
  public static id = INTEGRATION_NAME;
  sentryOrg: string;
  baseSentryUrl: string;
  client: FullStoryClient;

  constructor(sentryOrg: string, options: Options) {
    this.sentryOrg = sentryOrg;
    this.client = options.client;
    this.baseSentryUrl = options.baseSentryUrl || 'https://sentry.io';
  }

  setupOnce(
    addGlobalEventProcessor: (callback: EventProcessor) => void,
    getCurrentHub: () => Hub
  ) {
    let fullStoryUrl: string | undefined;

    addGlobalEventProcessor(async (event, hint) => {
      const hub = getCurrentHub();
      return processEvent({
        baseSentryUrl: this.baseSentryUrl,
        client: this.client,
        event,
        hint,
        self: hub.getIntegration(SentryFullStory),
        sentryClient: hub.getClient(),
        sentryOrg: this.sentryOrg,
        fullStoryUrl,
      }) as Promise<Event>;
    });
  }
}

export function fullStoryIntegration(
  sentryOrg: string,
  options: Options
): IntegrationV8 {
  const fullStoryClient = options.client;
  const baseSentryUrl = options.baseSentryUrl || 'https://sentry.io';
  let fullStoryUrl: string | undefined;

  return {
    name: INTEGRATION_NAME,
    async processEvent(event, hint, client) {
      return processEvent({
        baseSentryUrl: baseSentryUrl,
        client: fullStoryClient,
        event,
        hint,
        self: client.getIntegrationByName(INTEGRATION_NAME),
        sentryClient: client,
        sentryOrg,
        fullStoryUrl,
      }) as Promise<EventV8>;
    },
  };
}

export default SentryFullStory;
