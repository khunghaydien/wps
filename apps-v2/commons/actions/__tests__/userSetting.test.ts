import { AnyAction } from 'redux';
import configureMockStore from 'redux-mock-store';
import thunk, { ThunkDispatch } from 'redux-thunk';

import moment from 'moment';

import ApiMock, { ErrorResponse } from '../../../../__tests__/mocks/ApiMock';
import { getUserSetting } from '../userSetting';
import { userSettingRemote } from './mocks/userSettingRemote';

const middlewares = [thunk];
// const mockStore = configureMockStore(middlewares);
const mockStore = configureMockStore<
  any,
  ThunkDispatch<undefined, undefined, AnyAction>
>(middlewares);

describe('getUserSetting()', () => {
  const mockUserSettingApi = (props: Record<string, any> | Error = {}) => {
    ApiMock.mockReturnValue({
      '/user-setting/get':
        props instanceof Error
          ? new ErrorResponse(props)
          : { ...userSettingRemote, ...props },
    });
  };

  beforeEach(() => {
    ApiMock.reset();
  });

  it('should store user setting into state', async () => {
    // Arrange
    mockUserSettingApi();
    const store = mockStore({});

    // Act
    await store.dispatch(getUserSetting());

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
  it('should handle error', async () => {
    // Arrange
    mockUserSettingApi(new Error('TEST ERROR'));
    const store = mockStore({});

    // Act
    await store.dispatch(getUserSetting());

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
  it('should initialize a global variable `empInfo`', async () => {
    // Arrange
    mockUserSettingApi({
      id: 'salesforce user id',
      language: 'en-GB',
    });
    const store = mockStore({});

    // Act
    await store.dispatch(getUserSetting({ currentLanguage: 'ja-JP' }));

    // Assert
    expect((global as any).empInfo).toEqual({
      userId: 'salesforce user id',
      locale: '',
      timeZone: undefined,
      language: 'ja-JP',
    });
  });
  it('should set language of user setting if current language is missing', async () => {
    // Arrange
    mockUserSettingApi({
      id: 'salesforce user id',
      language: 'en-GB',
    });
    const store = mockStore({});

    // Act
    await store.dispatch(getUserSetting());

    // Assert
    expect((global as any).empInfo.language).toBe('en-GB');
  });
  it('should initialize document.documentElement.lang with language of user setting', async () => {
    // Arrange
    mockUserSettingApi({
      id: 'salesforce user id',
      language: 'en-GB',
    });
    const store = mockStore({});
    document.documentElement.lang = null;

    // Act
    await store.dispatch(getUserSetting());

    // Assert
    expect(document.documentElement.lang).toBe('en-GB');
  });
  it('should initialize document.documentElement.lang with current language', async () => {
    // Arrange
    mockUserSettingApi({
      id: 'salesforce user id',
      language: 'en-GB',
    });
    const store = mockStore({});
    document.documentElement.lang = undefined;

    // Act
    await store.dispatch(getUserSetting({ currentLanguage: 'ja-JP' }));

    // Assert
    expect(document.documentElement.lang).toBe('ja-JP');
  });
  it('should set moment locale using locale', async () => {
    // Arrange
    mockUserSettingApi({
      locale: 'en-GB',
    });
    const store = mockStore({});

    // Act
    await store.dispatch(getUserSetting());

    // Assert
    expect(moment.locale()).toEqual('en-gb');
  });
  it('should initialize a global variable `organization`', async () => {
    // Arrange
    mockUserSettingApi({
      organization: {
        id: 'salesforce org id',
        isSandbox: true,
        enableErrorTracking: true,
      },
    });
    const store = mockStore({});

    // Act
    await store.dispatch(getUserSetting({ currentLanguage: 'ja-JP' }));

    // Assert
    expect((global as any).organization).toEqual({
      id: 'salesforce org id',
      isSandbox: true,
      enableErrorTracking: true,
    });
  });
  it.each(['', undefined, null])(
    'should set default value to currency symbol if falsy (%p)',
    async (falsy: any) => {
      // Arrange
      mockUserSettingApi({
        currencySymbol: falsy,
      });
      const store = mockStore({});

      // Act
      await store.dispatch(getUserSetting());

      // Assert
      expect(store.getActions()[0].payload.currencySymbol).toBe('');
    }
  );
});
