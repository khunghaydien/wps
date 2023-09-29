import * as React from 'react';
import { Provider } from 'react-redux';
import { cleanup, render } from 'react-testing-library';
import { Dispatch } from 'redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import withDispatch from '../Dispatcher';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({});

describe('withDispatch', () => {
  afterEach(cleanup);

  test('Pass `dispatch` to downstream', () => {
    const mock = jest.fn(() => <div />);
    const Component = withDispatch(mock);
    render(
      <Provider store={store}>
        <Component />
      </Provider>
    );

    const { dispatch } = (
      mock.mock.calls[0] as Array<{
        dispatch: Dispatch;
      }>
    )[0];
    dispatch({
      type: 'TEST',
    });

    expect(dispatch).not.toBeNull();
    expect(store.getActions()).toEqual([{ type: 'TEST' }]);
  });
});
