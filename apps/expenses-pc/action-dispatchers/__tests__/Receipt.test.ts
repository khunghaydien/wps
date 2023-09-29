import './mocks/mockWindowObj';
import ApiMock from '../../../../__tests__/mocks/ApiMock';
import * as receiptActions from '../Receipt';
import { ocrStatus } from './mocks/receiptList.mock';
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

      await store.dispatch(receiptActions.deleteReceipt('receiptId'));

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('executeOcr()', () => {
    it('executeOcr success', async () => {
      ApiMock.mockReturnValue({
        '/exp/receipt/ocr/execute': {
          isSuccess: true,
          result: null,
        },
      });

      await store.dispatch(receiptActions.executeOcr(''));

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('keepGettingStatus()', () => {
    it('get status completed success', async () => {
      ApiMock.mockReturnValue({
        '/exp/receipt/ocr/get-status': ocrStatus,
      });

      await store.dispatch(receiptActions.keepGettingStatus('', ''));

      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
