import * as React from 'react';
import { Provider } from 'react-redux';
import { cleanup, render } from 'react-testing-library';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  // @ts-ignore
  __get__,
  Permission,
} from '../../../domain/models/access-control/Permission';

import AccessControl from '../AccessControlContainer';

const defaultPermission = __get__('defaultPermission');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

class Stub extends React.Component<Record<string, unknown>> {
  render() {
    return <div data-testid="stub" />;
  }
}

describe('AccessControlContainer', () => {
  describe('権限 を持っている場合', () => {
    let store;
    beforeEach(() => {
      const userPermission: Permission = {
        ...defaultPermission,
        manageOverallSetting: true,
        manageCalendar: true,
        manageAttLeaveGrant: true,
      };
      window.empInfo = { permission: userPermission } as EmpInfo;
      store = mockStore({
        common: {
          proxyEmployeeInfo: { isProxyMode: true },
          accessControl: { permission: { ...userPermission } },
        },
      });
    });

    afterEach(cleanup);

    test('`children` がレンダリングされる', () => {
      const { getByTestId } = render(
        <Provider store={store}>
          <AccessControl
            requireIfByDelegate={[
              'manageOverallSetting',
              'manageCalendar',
              'manageAttLeaveGrant',
            ]}
          >
            <Stub />
          </AccessControl>
        </Provider>
      );

      expect(getByTestId('stub')).not.toBeUndefined();
      expect(getByTestId('stub')).not.toBeNull();
    });
  });

  describe('権限 を持ってない場合', () => {
    let store;
    beforeEach(() => {
      const userPermission: Permission = {
        ...defaultPermission,
      };
      window.empInfo = { permission: userPermission } as EmpInfo;
      store = mockStore({
        common: {
          proxyEmployeeInfo: { isProxyMode: true },
          accessControl: { permission: { ...userPermission } },
        },
      });
    });

    afterEach(cleanup);

    test('`children` がレンダリングされ無い', () => {
      const { queryByTestId } = render(
        <Provider store={store}>
          <AccessControl
            requireIfByDelegate={[
              'manageOverallSetting',
              'manageCalendar',
              'manageAttLeaveGrant',
            ]}
          >
            <Stub />
          </AccessControl>
        </Provider>
      );

      expect(queryByTestId('stub')).toBeNull();
    });
  });
});
