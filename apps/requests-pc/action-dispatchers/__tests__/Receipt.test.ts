import './mocks/mockWindowObj';
import ApiMock from '../../../../__tests__/mocks/ApiMock';
import * as actions from '../Receipt';
import Store from './mocks/Store';

jest.mock('uuid/v4', () => () => 1);

describe('Receipt', () => {
  afterEach(() => {
    ApiMock.reset();
  });

  let store;

  beforeEach(() => {
    store = Store.create();
  });

  describe('deleteReceipt()', () => {
    it('delete receipt success', async () => {
      ApiMock.mockReturnValue({
        '/exp/receipt/delete': { isSuccess: true, result: null },
      });

      await store.dispatch(actions.deleteReceipt('receiptId'));

      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
