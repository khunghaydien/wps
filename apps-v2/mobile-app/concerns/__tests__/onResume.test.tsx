import React from 'react';
import { Provider } from 'react-redux';
import { cleanup, render } from 'react-testing-library';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import onResume from '../onResume';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

// Mock document
let hidden = false; // eslint-disable-line no-unused-vars
Object.defineProperty(document, 'hidden', {
  configurable: true,
  get() {
    return hidden;
  },
  set(bool: unknown) {
    hidden = Boolean(bool);
  },
});

describe('onResume', () => {
  const store = mockStore({});

  afterEach(cleanup);

  test('add visibilitychange event listener on componentDidMount', () => {
    // Arrange
    const map: Record<string, any> = {};
    window.addEventListener = jest.fn((event, cb) => {
      map[event] = cb;
    });

    const mock = jest.fn(() => <div />);
    const handler = jest.fn();

    // Run
    const Component = onResume(handler)(mock);
    render(
      <Provider store={store}>
        <Component />
      </Provider>
    );

    // Assert
    // @ts-ignore
    expect(map.visibilitychange).toBe(Component.resumeHandler);
  });

  test('remove visibilitychange event listener on componentWillUnmount', () => {
    // Arrange
    const map: Record<string, any> = {};
    window.addEventListener = jest.fn((event, cb) => {
      map[event] = cb;
    });
    window.removeEventListener = jest.fn((event, _cb) => {
      delete map[event];
    });

    const mock = jest.fn(() => <div />);
    const handler = jest.fn();

    // Run
    const Component = onResume(handler)(mock);
    render(
      <Provider store={store}>
        <Component />
      </Provider>
    );
    cleanup();

    // Assert
    expect(map.visibilitychange).toBeUndefined();
  });

  test('onResume handler should be called with Dispatch on page shown', () => {
    // Arrange
    const mock = jest.fn(() => <div />);
    const handler = jest.fn();

    const Component = onResume(handler)(mock);
    render(
      <Provider store={store}>
        <Component />
      </Provider>
    );

    // @ts-ignore
    document.hidden = false;

    // Run
    document.dispatchEvent(new Event('visibilitychange'));

    // Assert
    expect(handler).toHaveBeenCalled();
    expect(handler.mock.calls[0][0].length).toBe(1);
  });

  test('onResume handler should be called with upstream props on page shown', () => {
    // Arrange
    const mock = jest.fn(() => <div />);
    const handler = jest.fn();

    const Component = onResume(handler)(mock);
    const upstreamProps = {
      test: 1,
      targetDate: '2019-10-10',
    };
    render(
      <Provider store={store}>
        <Component {...upstreamProps} />
      </Provider>
    );

    // @ts-ignore
    document.hidden = false;

    // Run
    document.dispatchEvent(new Event('visibilitychange'));

    // Assert
    expect(handler).toHaveBeenCalled();
    expect(handler.mock.calls[0][1].test).toBe(1);
    expect(handler.mock.calls[0][1].targetDate).toBe('2019-10-10');
  });

  test('onResume handler should be not called with Dispatch on page hidden', () => {
    // Arrange
    const mock = jest.fn(() => <div />);
    const handler = jest.fn();

    const Component = onResume(handler)(mock);
    render(
      <Provider store={store}>
        <Component />
      </Provider>
    );

    // @ts-ignore
    document.hidden = true;

    // Run
    document.dispatchEvent(new Event('visibilitychange'));

    // Assert
    expect(handler).not.toHaveBeenCalled();
  });
});
