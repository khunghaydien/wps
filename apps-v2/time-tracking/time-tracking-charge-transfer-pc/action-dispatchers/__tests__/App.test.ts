import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import permission from '@apps/domain/models/access-control/Permission';

import ApiMock from '../../../../../__tests__/mocks/ApiMock';
import App from '../App';

afterEach(() => {
  ApiMock.reset();
});

describe('App', () => {
  describe('initialize', () => {
    test('should dispatch actions to initialize', async () => {
      // arrange
      ApiMock.mockReturnValue({
        '/user-setting/get': {
          useTimeTrackingChargeTransfer: true,
          useWorkTime: true,
        },
      });
      const store = configureMockStore([thunk])();
      const { initialize } = App(store.dispatch);

      // act
      await initialize({ userPermission: permission });

      // assert
      expect(store.getActions()).toMatchSnapshot();
    });

    test('should dispatch actions to display error', async () => {
      // arrange
      ApiMock.mockReturnValue({
        '/user-setting/get': {
          useTimeTrackingChargeTransfer: false,
          useWorkTime: true,
        },
      });
      const store = configureMockStore([thunk])();
      const { initialize } = App(store.dispatch);

      // act
      await initialize({ userPermission: permission });

      // assert
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('selectDelegatedEmployee', () => {
    test('should dispatch actions in the correct order', () => {
      // arrange
      const store = configureMockStore([thunk])();
      const { selectDelegatedEmployee } = App(store.dispatch);

      // act
      selectDelegatedEmployee(
        'id' as unknown as Parameters<typeof selectDelegatedEmployee>[0]
      );

      // assert
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('unselectDelegatedEmployee', () => {
    test('should dispatch actions in the correct order', () => {
      // arrange
      const store = configureMockStore([thunk])();
      const { unselectDelegatedEmployee } = App(store.dispatch);

      // act
      unselectDelegatedEmployee();

      // assert
      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
