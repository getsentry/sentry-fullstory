# Sentry FullStory

The `@sentry/fullstory` integration seamlessly integrates the Sentry and FullStory platforms. When you look at a browser error in Sentry, you will see a link to the FullStory session replay at that exact moment in time. When you are watching a FullStory replay and your user experiences an error, you will see a link that will take you to that error in Sentry.

## Pre-Requisites

For the Sentry-FullStory integration to work, you must have the [Sentry Browser SDK package](https://www.npmjs.com/package/@sentry/browser) or the [Sentry React Native SDK package](https://www.npmjs.com/package/@sentry/react-native) and the [FullStory Browser SDK package](https://www.npmjs.com/package/@fullstory/browser) or the [FullStory React Native SDK package](https://www.npmjs.com/package/@fullstory/react-native) respectively.

### On-Premise Installations

If you are using on-premise Sentry (not sentry.io), then you must have Sentry version `20.6.0` or higher.

## Installation

To install the stable version:

with npm:

```
npm install --save @sentry/fullstory
```

with yarn:

```
yarn add @sentry/fullstory
```

## Setup

First, grab your Sentry organization slug. You can get that value from the URL of your sentry organization. Example: `https://fullstory.sentry.io/` where `fullstory` would be the value of the organization slug.

Next, grab your FullStory organization ID. You can get that value from the FullStory recording snippet on your [FullStory settings page](https://help.fullstory.com/hc/en-us/articles/360020623514).

### Code Changes

To set up the integration, both FullStory and Sentry need to be initialized. Make sure to replace `__FULLSTORY_ORG_ID__` with your FullStory organization ID and `__SENTRY_ORG_SLUG__` with your Sentry organization slug.

#### Browser

```javascript
import * as Sentry from '@sentry/browser';
import { fullStoryIntegration } from '@sentry/fullstory';

import { FullStory, init } from '@fullstory/browser';
// v1 import:
// import * as FullStory from '@fullstory/browser';

init({ orgId: '__FULLSTORY_ORG_ID__' });

Sentry.init({
  dsn: '__DSN__',
  integrations: [
    fullStoryIntegration('__SENTRY_ORG_SLUG__', { client: FullStory }),
  ],
});
```

#### React Native

```javascript
import * as Sentry from '@sentry/react-native';
import { fullStoryIntegration } from '@sentry/fullstory';

import FullStory from '@fullstory/react-native';

FullStory.init({ orgId: '__FULLSTORY_ORG_ID__' });

Sentry.init({
  dsn: '__DSN__',
  integrations: [
    fullStoryIntegration('__SENTRY_ORG_SLUG__', { client: FullStory }),
  ],
});
```

### Sentry Settings Change

In order for this integration to work properly, you need to whitelist the `fullStoryUrl` field in your Sentry settings. If you don't, the FullStory URL might be scrubbed because the session ID matches a credit card regex. To do this change, go to `Settings` -> `Security & Privacy` and add `fullStoryUrl` to the `Global Safe Fields` entry.

![Settings](https://i.imgur.com/zk0hShj.png)

## How it works

In Sentry, you should see additional context of your error that has the `fullStoryUrl` below the breadcrumbs and other information:

![Sentry](https://i.imgur.com/O4r4Wvq.png)

In FullStory, you should see an event called `Sentry Error` on the right sidebar that has a link to the error in Sentry:

![FullStory](https://i.imgur.com/FutjI0R.png)

## Contributing

We welcome community contributions to `@sentry/fullstory`! If you have an idea for a feature or a bug fix, don't hesitate to open an issue or a pull request.

See the [Contributing Guide](CONTRIBUTING.md) for more information.

## Version Compatibility

The Sentry FullStory integration is compatible with Sentry JavaScript SDK 9.x and above. If you need to support Sentry JavaScript SDK 8.x, please use version 3.x of this integration.

| Sentry FullStory Integration Version | Sentry JavaScript SDK Version |
| ------------------------------------ | ----------------------------- |
| 4.x                                  | 9.x                           |
| 3.x                                  | 8.x                           |
| 2.x                                  | 7.x                           |
