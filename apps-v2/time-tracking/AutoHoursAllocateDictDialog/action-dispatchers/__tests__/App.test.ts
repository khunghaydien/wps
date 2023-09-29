import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { Permission } from '@apps/domain/models/access-control/Permission';

import App from '../App';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const dummyPermission = {
  anyPermissionItem: true,
} as Record<string, boolean> as Permission;

describe('initialize()', () => {
  it('should initialize app', () => {
    // Arrange
    const store = mockStore();
    const app = App(store.dispatch);

    // Act
    app.initialize({
      targetDate: '2022-02-02',
      userPermission: dummyPermission,
      empId: 'empId',
    });

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('showErrorNotification()', () => {
  it('should dispatch to show error notifications', () => {
    // Arrange
    const store = mockStore();
    const app = App(store.dispatch);

    // Act
    const error = {
      message: 'test',
    } as Error;
    app.showErrorNotification(error);

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('hideErrorNotification()', () => {
  it('should dispatch to hide error notifications', () => {
    // Arrange
    const store = mockStore();
    const app = App(store.dispatch);

    // Act
    app.hideErrorNotification();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('resetErrorNotification()', () => {
  it('should dispatch to reset error notifications', () => {
    // Arrange
    const store = mockStore();
    const app = App(store.dispatch);

    // Act
    app.resetErrorNotification();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});
