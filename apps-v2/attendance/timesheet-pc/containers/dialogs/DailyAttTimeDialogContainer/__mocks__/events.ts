import events from '../events';

const create = (eventName: string) => ({
  eventName,
  publish: jest.fn(),
  subscribe: jest.fn(),
});

const original = jest.requireActual('../events');

export default Object.keys(original.default).reduce((obj, key) => {
  obj[key] = create(original.default[key].eventName);
  return obj;
}, {}) as typeof events;
