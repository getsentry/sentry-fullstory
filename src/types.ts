export interface FullStoryClient {
  event(eventName: string, eventProperties: { [key: string]: any }): void;
  getCurrentSessionURL(now?: boolean): string | null;
}
