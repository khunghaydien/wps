import * as costCenterActions from '../../../commons/action-dispatchers/CostCenter';

import ApiMock from '../../../../__tests__/mocks/ApiMock';
import costCenterList from './mocks/costCenterList.mock';
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

  describe('getCostCenterSearchResult()', () => {
    it('getCostCenterSearchResult success', async () => {
      ApiMock.mockReturnValue({
        '/cost-center/search': { records: costCenterList.costCenterList },
      });

      await store.dispatch(
        costCenterActions.getCostCenterSearchResult(
          '',
          'query string',
          '2020-02-20'
        )
      );

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('getCostCenterList()', () => {
    it('getCostCenterList success', async () => {
      ApiMock.mockReturnValue({
        '/exp/cost-center/get': costCenterList,
      });

      await store.dispatch(
        costCenterActions.getCostCenterList('parentId1', '2020-02-20')
      );

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('getNextCostCenterList()', () => {
    it('get next level of cost center list success', async () => {
      ApiMock.mockReturnValue({
        '/exp/cost-center/get': costCenterList,
      });

      await store.dispatch(
        costCenterActions.getNextCostCenterList(null, [], '', '', '')
      );

      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
