import ApiMock, { ErrorResponse } from '../../../../__tests__/mocks/ApiMock';
import * as actions from '../Resource';
import resourceList from './mocks/resourceList.mock';
import Store from './mocks/Store';

jest.mock('uuid/v4', () => () => 1);

describe('View All Resource Page', () => {
  afterEach(() => {
    ApiMock.reset();
  });

  let store;

  beforeEach(() => {
    store = Store.create();
  });

  describe('fetchViewAllResources()', () => {
    it('should fetch list of all resources', async () => {
      ApiMock.mockReturnValue({
        '/psa/resource/list': resourceList,
      });

      await store.dispatch(
        actions.fetchViewAllResourcesById(['id1', 'id2', 'id3'], 1, 20, 2, 10)
      );
      expect(store.getActions()).toMatchSnapshot();
    });

    it('load resource list fail', async () => {
      ApiMock.mockReturnValue({
        '/psa/resource/list': new ErrorResponse({
          code: 'FATAL',
          message: 'Server not responded',
        }),
      });

      // @ts-ignore
      await store.dispatch(actions.fetchViewAllResourcesById(false));
      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
