# sentry-fullstory
The Sentry-FullStory integration creates a link from the Sentry error to the FullStory replay. It also creates a link from the FullStory event to the Sentry error.

## Pre-Requisites

For the Sentry-FullStory integration to work, you must have the [Sentry browser SDK package](https://www.npmjs.com/package/@sentry/browser) and FullStory running.

## Installation
To install the stable version:

with npm:
```
npm install --save sentry-fullstory
```

with yarn:
```
yarn add sentry-fullstory
```


## Setup

To set up the integration, both FullStory and Sentry need to be initialized. Please add the following code:


```
import * as Sentry from '@sentry/browser';
import FullStory from '@fullstorydev/browser';
import SentryFullStory from '@sentry/sentry-fullstory';

FullStory.init({ orgId = '__FULLSTORY_ORG_ID__' });

Sentry.init({
  dsn: '__DSN__',
  integrations: [ new SentryFullStory('__SENTRY_ORG_SLUG__'), ],
  // ...
});
  ```

Replace `__SENTRY_ORG_SLUG__` with the organization for your slug. You can get that value from the URL of your sentry organization. Example: `https://sentry.io/organizations/fullstory/` where `fullstory` would be the value of `__SENTRY_ORG_SLUG__`.


You also need to replace `__FULLSTORY_ORG_ID__` with the value of `_fs_org` in the FullStory recording snippet on your [FullStory settings page](https://help.fullstory.com/hc/en-us/articles/360020623514).
