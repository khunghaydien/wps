import configureMockStore from 'redux-mock-store';

import snapshotDiff from 'snapshot-diff';

import Events from '../../events';
import UseCases from '../../UseCases';
import subscribers from '..';
import EventEmitter from '@attendance/libraries/Event/emitter';

const createStore = configureMockStore();

jest.mock('@attendance/timesheet-pc/UseCases', () => {
  const act = jest.requireActual('../../UseCases');
  const mocks = jest.requireActual('../../__mocks__/UseCases');
  act.default.register(mocks.methods);
  return {
    __esModule: true,
    default: act.default,
  };
});

jest.mock('../behaviors', () => {
  const act = jest.requireActual('../behaviors');
  return {
    __esModule: true,
    default: jest.fn((store) => {
      const methods = act.methods;
      return Object.keys(methods).reduce((obj, key) => {
        obj[key] = (...args) => {
          store.dispatch({
            type: `METHOD: ${key}`,
            arguments: args,
          });
        };
        return obj;
      }, {});
    }),
  };
});

const parameters = {
  Events: {
    initialized: {
      fetchedUserSetting: 'fetchedUserSetting',
      fetchedTimesheet: 'fetchedTimesheet',
    },
  },
};

describe('Event:', () => {
  describe.each(Object.keys(Events))('%s:', (key) => {
    let before;
    let after;
    it('should subscribe', async () => {
      // Arrange
      const store = createStore({});
      await subscribers(store);

      // Act
      Events[key].publish(parameters.Events[key]);

      // Assert
      before = store.getActions();
      expect(before).toMatchSnapshot();

      EventEmitter.clear();
    });

    it('should subscribe after initialized', async () => {
      // Arrange
      const store = createStore({});
      await subscribers(store);
      Events.initialized.publish(
        parameters.Events.initialized as unknown as Parameters<
          typeof Events.initialized.publish
        >[0]
      );
      store.clearActions();

      // Act
      Events[key].publish(parameters.Events[key]);

      // Assert
      after = store.getActions();
      expect(after).toMatchSnapshot();

      EventEmitter.clear();
    });

    it('is shown diff', () => {
      expect(snapshotDiff(before, after)).toMatchSnapshot();
    });
  });
});

describe('UseCases:', () => {
  describe.each(Object.keys(UseCases()))('%s:', (key) => {
    let before;
    let after;
    it('should subscribe', async () => {
      // Arrange
      const store = createStore({});
      await subscribers(store);

      // Act
      EventEmitter.publish(UseCases()[key].eventName, {});

      // Assert
      before = store.getActions();
      expect(before).toMatchSnapshot();

      EventEmitter.clear();
    });

    it('should subscribe after initialized', async () => {
      // Arrange
      const store = createStore({});
      await subscribers(store);
      Events.initialized.publish(
        parameters.Events.initialized as unknown as Parameters<
          typeof Events.initialized.publish
        >[0]
      );
      store.clearActions();

      // Act
      EventEmitter.publish(UseCases()[key].eventName, {});

      // Assert
      after = store.getActions();
      expect(after).toMatchSnapshot();

      EventEmitter.clear();
    });

    it('is shown diff', () => {
      expect(snapshotDiff(before, after)).toMatchSnapshot();
    });
  });
});

it('should call once', async () => {
  // Arrange
  const store = createStore({});
  await subscribers(store);
  const subscribe = jest.spyOn(EventEmitter, 'subscribe');

  // Act
  Events.initialized.publish(
    parameters.Events.initialized as unknown as Parameters<
      typeof Events.initialized.publish
    >[0]
  );
  const count = subscribe.mock.calls.length;
  Events.initialized.publish(
    parameters.Events.initialized as unknown as Parameters<
      typeof Events.initialized.publish
    >[0]
  );

  // Assert
  expect(subscribe).toHaveBeenCalledTimes(count);

  EventEmitter.clear();
});
