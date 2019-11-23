# sentry-fullstory
The Sentry-FullStory integration creates a link from the Sentry Error to the FullStory replay. It also creates a link from the FullStory event to the Sentry error.

## Pre-Requisites

For the Sentry-FullStory integration to work, you must have the [Sentry browser SDK package](https://www.npmjs.com/package/@sentry/browser) and FullStory running. 

## Installation
To install the stable version:
```
npm install --save sentry-fullstory
```
This assumes you are using npm as your package manager.

## Setup

Once you have Sentry configured and set up, adding this integration is as simple as importing it and adding it to the list of integrations in your `Sentry.init`:

```
import * as Sentry from '@sentry/browser';
import SentryFullStory from '@sentry/sentry-fullstory';
 
Sentry.init({
  dsn: '__DSN__',
  integrations: [ new SentryFullStory('__SENTRY_ORG_SLUG__'), ],
  // ...
});
  ```
  

You can get the value of `__SENTRY_ORG_SLUG__` from the URL of your sentry organization. Example: `https://sentry.io/organizations/fullstory/` where `fullstory` would be the value of `__SENTRY_ORG_SLUG__`.
