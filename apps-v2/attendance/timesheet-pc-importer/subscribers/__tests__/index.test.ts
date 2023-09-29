import configureMockStore from 'redux-mock-store';

import snapshotDiff from 'snapshot-diff';

import Events from '../../Events';
import UseCases from '../../UseCases';
import subscribers from '..';
import EventEmitter from '@attendance/libraries/Event/emitter';

const createStore = configureMockStore();

jest.mock('../../UseCases', () => {
  const act = jest.requireActual('../../UseCases');
  const mocks = jest.requireActual('../../__mocks__/UseCases');
  act.default.register(mocks.service);
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

describe('Event:', () => {
  describe.each(Object.keys(Events))('%s:', (key) => {
    let before;
    let after;
    it('should subscribe', async () => {
      // Arrange
      const store = createStore({});
      await subscribers(store);

      // Act
      Events[key].publish();

      // Assert
      before = store.getActions();
      expect(before).toMatchSnapshot();

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

    it('is shown diff', () => {
      expect(snapshotDiff(before, after)).toMatchSnapshot();
    });
  });
});
