# sentry-fullstory

The Sentry-FullStory integration seamlessly integrates the Sentry and FullStory platforms. When you look at a browser error in Sentry, you will see a link to the FullStory session replay at that exact moment in time. When you are watching a FullStory replay and your user experiences an error, you will see a link that will take you to that error in Sentry.

## Pre-Requisites

For the Sentry-FullStory integration to work, you must have the [Sentry browser SDK package](https://www.npmjs.com/package/@sentry/browser) and the [FullStory browser SDK package](https://www.npmjs.com/package/@fullstory/browser).

### On-Premise Installations

If you are using on-premise Sentry (not sentry.io), then you must have Sentry version 10+.

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

### Code Changes

To set up the integration, both FullStory and Sentry need to be initialized. Please add the following code:


```
import * as Sentry from '@sentry/browser';
import * as FullStory from '@fullstory/browser';
import SentryFullStory from '@sentry/fullstory';

FullStory.init({ orgId: '__FULLSTORY_ORG_ID__' });

Sentry.init({
  dsn: '__DSN__',
  integrations: [ new SentryFullStory('__SENTRY_ORG_SLUG__'), ],
  // ...
});
  ```

Replace `__SENTRY_ORG_SLUG__` with the slug of your organization. You can get that value from the URL of your sentry organization. Example: `https://sentry.io/organizations/fullstory/` where `fullstory` would be the value of `__SENTRY_ORG_SLUG__`.


You also need to replace `__FULLSTORY_ORG_ID__` with the value of `_fs_org` in the FullStory recording snippet on your [FullStory settings page](https://help.fullstory.com/hc/en-us/articles/360020623514).


### Sentry Settings Change

In order for this integration to work properly, you need to whitelist the `fullStoryUrl` field in your Sentry settings. If you don't, the FullStory URL might be scrubbed because the session ID matches a credit card regex. To do this change, go to `Settings` -> `Security & Privacy` and add `fullStoryUrl` to the `Global Safe Fields` entry.


![Settings](https://i.imgur.com/zk0hShj.png)

## How it works

In Sentry, you should see additional context of your error that has the `fullStoryUrl` below the breadcrumbs and other information:

![Sentry](https://i.imgur.com/O4r4Wvq.png)


In FullStory, you should see an event called `Sentry Error` on the right sidebar that has a link to the error in Sentry:

![FullStory](https://i.imgur.com/FutjI0R.png)

## Development

### Before you start...

To get up and running with this project, you'll need a few things:

- Access to a FullStory account
- Access to a Sentry instance
- A test project that
  - has `@sentry/browser`, `@fullstory/browser` and `@sentry/fullstory` installed (See [Pre-Requisites](#pre-requisites))
  - has implemented all the changes described in [Setup](#setup)
  - can generate errors on command (optional, but great for testing)

### Helpful Tips

To test your changes, you'll need to tell the package manager to refer to your modified code instead of the versions installed on your test project.

In your cloned/forked directory of this project, run `yarn link`. Then navigate to the test project and run `yarn link @sentry/fullstory`. This will create a symlink with the installed `@sentry/fullstory` package direct your test project to use the local one instead. This is applicable for all work on node modules, not just `@sentry/fullstory`.

When actively making changes the project should be run with `yarn watch`, to allow for hot reloading. Otherwise, `yarn build` must be run after each change, since the test project will only use the files in `dist/`, not `src/`.

### Releases

We use [craft](https://github.com/getsentry/craft) and [publish](https://github.com/getsentry/publish) to generate consistent releases for this project. See the 'getsentry/publish' docs for instructions on how to setup a new release. Before doing so, you will have to update the CHANGELOG, otherwise craft will throw an error in the workflow action.
