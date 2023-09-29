import React from 'react';
import { Provider } from 'react-redux';
import { cleanup, render } from 'react-testing-library';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import lifecycle from '../index';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('lifecycle', () => {
  const store = mockStore({});

  describe('componentDidMount', () => {
    beforeEach(cleanup);

    const mock = jest.fn(() => <div data-testid="mock" />);
    const hook = jest.fn();
    const Component = lifecycle({
      componentDidMount: hook,
    })(mock);
    const props = { test: true };
    render(
      <Provider store={store}>
        <Component {...props} />
      </Provider>
    );

    test('should receive props', () => {
      const { test } = hook.mock.calls[0][1];
      expect({ test }).toEqual(props);
    });

    test('should be called on mount ', () => {
      expect(hook).toHaveBeenCalled();
    });

    test('should be called with dipatch and props', () => {
      expect(hook.mock.calls[0].length).toEqual(2);
    });
  });

  describe('componentWillUnmount', () => {
    const mock = jest.fn(() => <div />);
    const hook = jest.fn();
    const Component = lifecycle({
      componentWillUnmount: hook,
    })(mock);
    const props = { test: true };
    render(
      <Provider store={store}>
        <Component {...props} />
      </Provider>
    );
    cleanup();

    test('should receive props', () => {
      const { test } = hook.mock.calls[0][1];
      expect({ test }).toEqual(props);
    });

    test('should be called on mount ', () => {
      expect(hook).toHaveBeenCalled();
    });

    test('should be called with dipatch and props', () => {
      expect(hook.mock.calls[0].length).toEqual(2);
    });
  });
});
