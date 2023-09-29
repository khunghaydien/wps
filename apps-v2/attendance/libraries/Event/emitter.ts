import uuid from 'uuid';

const $subscriptions: Record<
  string,
  {
    id: string;
    namespace: string;
    callback: (data?: unknown) => void;
  }[]
> = {};

const publish = <T = unknown>(
  eventName: string,
  data?: T
): Promise<unknown> => {
  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.NODE_ENV !== 'test'
  ) {
    console.log(`EventService.publish('${eventName}')`);
  }
  const events = $subscriptions[eventName];
  if (!events) {
    return;
  }
  return Promise.allSettled(
    events.map(
      ({ callback }) =>
        new Promise((resolve, reject) => {
          try {
            resolve(callback(data));
          } catch (e) {
            reject(e);
          }
        })
    )
  );
};

const subscribe = <T = unknown>(
  eventName: string | string[],
  callback: (data?: T) => void
): (() => void) => {
  const unsubscribing = [];
  [].concat(eventName).forEach((customEventName) => {
    const [eventName, namespace = ''] = customEventName.split('.', 2);
    if (!eventName) {
      return;
    }
    const subscription = {
      id: uuid(),
      namespace,
      callback,
    };
    const events = $subscriptions[eventName] || [];
    if (namespace) {
      const idx = events.findIndex((event) => event.namespace === namespace);
      if (idx !== -1) {
        events.splice(idx, 1, subscription);
      } else {
        events.push(subscription);
      }
    } else {
      events.push(subscription);
    }
    $subscriptions[eventName] = events;
    unsubscribing.push(() => {
      const events = $subscriptions[eventName];
      if (!events) {
        return;
      }
      const idx = events.findIndex((event) => event.id === subscription.id);
      if (idx !== -1) {
        events.splice(idx, 1);
      }
    });
  });

  return () => {
    unsubscribing.forEach((r) => r());
  };
};

const unsubscribe = (eventName: string | string[]): void => {
  [].concat(eventName).forEach((customEventName) => {
    const [eventName, namespace = ''] = customEventName.split('.', 2);
    if (!eventName) {
      return;
    }
    if (namespace) {
      const events = $subscriptions[eventName] || [];
      const idx = events.findIndex((event) => event.namespace === namespace);
      if (idx !== -1) {
        events.splice(idx, 1);
      }
    } else {
      delete $subscriptions[eventName];
    }
  });
};

const clear = () => {
  Object.keys($subscriptions).forEach((key) => {
    delete $subscriptions[key];
  });
};

export default {
  publish,
  subscribe,
  unsubscribe,
  clear,
};
