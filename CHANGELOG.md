# Changelog

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
