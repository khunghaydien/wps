import ApiMock from '../../../../__tests__/mocks/ApiMock';
import * as actions from '../ExpenseType';
import expTypes from './mocks/expTypes.mock';
import Store from './mocks/Store';

jest.mock('uuid/v4', () => () => 1);

describe('ExpenseType', () => {
  afterEach(() => {
    ApiMock.reset();
  });

  let store;

  beforeEach(() => {
    store = Store.create();
  });

  describe('getFavoriteExpTypes()', () => {
    it('get favorite exp types success', async () => {
      ApiMock.mockReturnValue({
        '/exp/expense-type/favorite/list': expTypes,
      });

      await store.dispatch(
        actions.getFavoriteExpTypes(
          'a0X2v00000LhreSEAR',
          '2019-11-30',
          'a0N2v00000VuxjtEAB',
          '',
          'a102v00000S2EDHAA3'
        )
      );

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('searchExpTypesByParentRecord()', () => {
    it('get child exp type list success', async () => {
      ApiMock.mockReturnValue({
        '/exp/expense-type/list-child': { childExpTypeList: expTypes.records },
      });

      await store.dispatch(
        actions.searchExpTypesByParentRecord('2020-02-21', 'parentExpTypeId1')
      );

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('getNextExpenseTypeList()', () => {
    it('get next level of exp type list success', async () => {
      ApiMock.mockReturnValue({
        '/exp/expense-type/list': { expenseTypes: expTypes.records },
      });

      await store.dispatch(
        actions.getNextExpenseTypeList({} as any, [], '', '', '')
      );

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('getExpenseTypeById()', () => {
    it('get exp type by id success', async () => {
      ApiMock.mockReturnValue({
        '/exp/expense-type/search': expTypes,
      });

      await store.dispatch(actions.getExpenseTypeById('expId1'));

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('getExpenseTypeSearchResult()', () => {
    it('search exp types by code or name success', async () => {
      ApiMock.mockReturnValue({
        '/exp/expense-type/search': expTypes,
      });

      await store.dispatch(
        actions.getExpenseTypeSearchResult(
          'companyId1',
          'query string',
          '2020-02-21',
          'expReportTypeId',
          '',
          ''
        )
      );

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('getExpenseTypeList()', () => {
    it('get exp type category list success', async () => {
      ApiMock.mockReturnValue({
        '/exp/expense-type/list': { expenseTypes: expTypes.records },
      });

      await store.dispatch(
        actions.getExpenseTypeList('', '2020-02-21', '', 'reportId ')
      );

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('favoriteExpType()', () => {
    it('favorite exp type success', async () => {
      ApiMock.mockReturnValue({
        '/exp/favorite': { isSuccess: true, result: null },
      });

      await store.dispatch(
        actions.favoriteExpType('', expTypes.records[0] as any, '')
      );

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('unfavoriteExpType()', () => {
    it('unfavorite exp type success', async () => {
      ApiMock.mockReturnValue({
        '/exp/unfavorite': { isSuccess: true, result: null },
      });

      await store.dispatch(
        actions.unfavoriteExpType('', expTypes.records[0] as any, '')
      );

      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
