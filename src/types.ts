type WebArgs = (now?: true) => string | null;
type ReactNativeArgs = () => Promise<string>;

type GetCurrentSessionURLType = WebArgs | ReactNativeArgs;

declare global {
  interface Window {
    [key: string]: any;
    _fs_namespace?: string;
  }
}

export type FullStoryClient = {
  event(eventName: string, eventProperties: { [key: string]: any }): void;
  getCurrentSessionURL?: GetCurrentSessionURLType;
};
