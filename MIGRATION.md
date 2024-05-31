## Upgrading from `2.x` to `3.x`

The `3.x` of the Sentry FullStory integration supports Sentry JavaScript SDK `8.x` and above. If you need to support Sentry JavaScript SDK 7.x or lower, please use version 2.x of this integration.

In `3.x` the `SentryFullStory` export has been removed in favour the `fullStoryIntegration` export.

```js
// before (2.x)
import SentryFullStory from '@sentry/fullstory';

Sentry.init({
  dsn: '__DSN__',
  integrations: [
    new SentryFullStory('__SENTRY_ORG_SLUG__', { client: FullStory }),
  ],
  // ...
});

// after (3.x)
import { fullStoryIntegration } from '@sentry/fullstory';

Sentry.init({
  dsn: '__DSN__',
  integrations: [
    fullStoryIntegration('__SENTRY_ORG_SLUG__', { client: FullStory }),
  ],
  // ...
});
```

The package has also been changed to emit ESM and CJS in a more standard manner. This should not affect you unless you were directly importing the SDK from `node_modules` or applying [`patch-package`](https://www.npmjs.com/package/patch-package). Here are the new export conditions:

```json
{
  "main": "./dist/cjs/index.js",
  "module": "./dist/es/index.mjs",
  "types": "./dist/cjs/index.d.ts",
  "exports": {
    "import": {
      "types": "./dist/es/index.d.ts",
      "default": "./dist/es/index.mjs"
    },
    "require": {
      "types": "./dist/cjs/index.d.cts",
      "default": "./dist/cjs/index.cjs"
    }
  }
}
```

Finally, the package is now licensed under the MIT instead of the Apache-2.0 LICENSE. [Sentry uses MIT for all of their SDKs](https://open.sentry.io/licensing/), so this change was made to align with that.
