import configureMockStore from 'redux-mock-store';

import { Permission } from '../../../../domain/models/access-control/Permission';
import { User } from '@apps/domain/models/User';

import App from '../App';

const mockStore = configureMockStore();

describe('initialize()', () => {
  it('should initialize app', () => {
    // Arrange
    const store = mockStore();
    const app = App(store.dispatch);
    const user: User = {
      id: 'abcd001',
      employeeCode: '001',
      employeeName: 'FUGA HOGE',
      employeePhotoUrl: '',
      departmentCode: 'SD-0001',
      departmentName: 'SD',
      title: 'Senior Engineer',
      managerName: 'XXX',
      isDelegated: true,
    };
    const permission = { mockPermission: true } as unknown as Permission;

    // Act
    app.initialize(user, permission);

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('showErrorNotification()', () => {
  it('should dispatch to show error notifications', () => {
    const store = mockStore();
    const app = App(store.dispatch);

    const error = {
      message: 'test',
    } as Error;

    app.showErrorNotification(error);

    expect(store.getActions()).toMatchSnapshot();
  });

  it('should dispatch to hide error notifications', () => {
    const store = mockStore();
    const app = App(store.dispatch);

    app.hideErrorNotification();

    expect(store.getActions()).toMatchSnapshot();
  });

  it('should dispatch to reset error notifications', () => {
    const store = mockStore();
    const app = App(store.dispatch);

    app.resetErrorNotification();

    expect(store.getActions()).toMatchSnapshot();
  });
});
