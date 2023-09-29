import ApiMock from '../../../../__tests__/mocks/ApiMock';
import * as actions from '../CostCenter';
import costCenterListRes from './mocks/costCenterListRes.mock';
import Store from './mocks/Store';

jest.mock('uuid/v4', () => () => 1);

describe('CostCenter', () => {
  afterEach(() => {
    ApiMock.reset();
  });

  let store;

  beforeEach(() => {
    store = Store.create();
  });

  describe('getCostCenterList()', () => {
    it('getCostCenterList success', async () => {
      ApiMock.mockReturnValue({
        '/exp/cost-center/get': costCenterListRes,
      });

      await store.dispatch(
        actions.getCostCenterList('parentId1', '2020-02-20')
      );

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('getCostCenterSearchResult()', () => {
    it('getCostCenterSearchResult success', async () => {
      ApiMock.mockReturnValue({
        '/cost-center/search': { records: costCenterListRes.costCenterList },
      });

      await store.dispatch(
        actions.getCostCenterSearchResult('', 'query string', '2020-02-20')
      );

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('getNextCostCenterList()', () => {
    it('get next level of cost center list success', async () => {
      ApiMock.mockReturnValue({
        '/exp/cost-center/get': costCenterListRes,
      });

      await store.dispatch(actions.getNextCostCenterList(null, [], '', ''));

      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
