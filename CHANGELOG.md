# Changelog

## 4.0.0

The Sentry FullStory integration has been updated to be compatible with Sentry JavaScript SDK 9.x. If you need to support Sentry JavaScript SDK 8.x or lower, please use version 3.x of this integration.

- **BREAKING CHANGES:** feat!: upgrade to Sentry SDK v9 (#101)
- **BREAKING CHANGES:** Use TypeScript `5.8.2` to build the Sentry FullStory integration (#102)

Thanks @seanparmelee for the contribution!

## 3.0.1

Fix: don't send FS events for non-errors (#100)

Thanks @seanparmelee for the contribution!

## 3.0.0

The Sentry FullStory integration has been updated to be compatible with Sentry JavaScript SDK 8.x. If you need to support Sentry JavaScript SDK 7.x or lower, please use version 2.x of this integration.

Configuration for the SDK now looks like so:

```js
import { fullStoryIntegration } from '@sentry/fullstory';

// ...

Sentry.init({
  dsn: '__DSN__',
  integrations: [
    fullStoryIntegration('__SENTRY_ORG_SLUG__', { client: FullStory }),
  ],
  // ...
});
```

- **BREAKING CHANGES:** feat: add support for sentry v8 (#92)

Thanks @seanparmelee for the contribution!

## 2.1.0

Add support for `@fullstory/browser` v2 (#86)

Thanks @seanparmelee for the contribution!

## 2.0.0

Refactoring the whole integration so it's platform agnostic.

**BREAKING CHANGES:** users now must provide the `FullStory` client as an option in the args.

## 1.1.8

Allow a custom FullStory Client to be passed as an option (e.g. from Segment)
Catch exceptions when accessing the client's API methods

## 1.1.7

Ensures Fullstory client is initalized before accessing it

## 1.1.6

Ignores Sentry's performance monitoring transactions when creating FullStory events

## 1.1.5

Adds the index.d.ts file that was accidentally removed in the previous version

## 1.1.4

Adds better type checking and fixes error when hint.originalException is null

## 1.1.3

Add check for undefined error

## 1.1.2

Fixed typo in Readme and updated instructions for new Security and Privacy page.

## 1.1.1

Updating `@fullstorydev/browser` dependancies to `@fullstory/browser`
Adds Typescript output files to dist

## 1.1.0

Updating the call to `FS.event` to include the `message` and `name` properties of the original exception.

## 1.0.0

Initial Release
