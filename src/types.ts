type WebArgs = (now?: true) => string | null;
type ReactNativeArgs = () => Promise<string>;

type GetCurrentSessionURLType = WebArgs | ReactNativeArgs;

export type FullStoryClient = {
  event(eventName: string, eventProperties: { [key: string]: any }): void;
  getCurrentSessionURL?: GetCurrentSessionURLType;
};
