import Emitter from './emitter';

export default <T = unknown>(
  eventName: string
): {
  eventName: string;
  publish: (data: T) => ReturnType<typeof Emitter.publish>;
  subscribe: (
    callback: (data: T) => void
  ) => ReturnType<typeof Emitter.subscribe>;
} => ({
  eventName,
  publish: (data: T) => Emitter.publish(eventName, data),
  subscribe: (callback: (data: T) => void) =>
    Emitter.subscribe(eventName, callback),
});
