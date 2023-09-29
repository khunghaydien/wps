import ApiMock from '../../../../__tests__/mocks/ApiMock';
import * as actions from '../Suggest';
import Store from './mocks/Store';
import suggestList from './mocks/suggestList.mock';

jest.mock('uuid/v4', () => () => 1);

describe('Suggest', () => {
  afterEach(() => {
    ApiMock.reset();
  });

  let store;

  beforeEach(() => {
    store = Store.create();
  });

  describe('getStation()', () => {
    it('get suggestion success', async () => {
      ApiMock.mockReturnValue({
        '/exp/jorudan/station/search': suggestList,
      });

      await store.dispatch(actions.getStation('ginza', '2019-10-21', null));

      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
