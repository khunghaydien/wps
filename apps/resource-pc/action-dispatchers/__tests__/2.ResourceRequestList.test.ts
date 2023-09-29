import ApiMock, { ErrorResponse } from '../../../../__tests__/mocks/ApiMock';
import * as actions from '../Request';
import requestList from './mocks/requestList.mock';
import Store from './mocks/Store';

jest.mock('uuid/v4', () => () => 1);

describe('Role Request List Page', () => {
  afterEach(() => {
    ApiMock.reset();
  });

  let store;

  beforeEach(() => {
    store = Store.create();
  });

  describe('fetchResourceRequestList()', () => {
    it('should fetch list of all role requests', async () => {
      ApiMock.mockReturnValue({
        '/psa/role/list': requestList,
      });

      await store.dispatch(
        actions.fetchResourceRequestList('companyId', 1, '')
      );
      expect(store.getActions()).toMatchSnapshot();
    });

    it('load resource list fail', async () => {
      ApiMock.mockReturnValue({
        '/psa/role/list': new ErrorResponse({
          code: 'FATAL',
          message: 'Server not responded',
        }),
      });

      // @ts-ignore
      await store.dispatch(actions.fetchResourceRequestList(false));
      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
