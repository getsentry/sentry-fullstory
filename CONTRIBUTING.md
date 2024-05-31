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
