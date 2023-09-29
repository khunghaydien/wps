import './mocks/mockWindowObj';
import ApiMock from '../../../../__tests__/mocks/ApiMock';
import * as dialogActions from '../Dialog';
import approvalHistory from './mocks/approvalHistory.mock';
import costCenterList from './mocks/costCenterList.mock';
import editHistory from './mocks/editHistory.mock';
import eiLookupRecords from './mocks/eiLookup.mock';
import expTypes from './mocks/expTypes.mock';
import { jobRecentList } from './mocks/jobList.mock';
import receiptList, { ocrStatus } from './mocks/receiptList.mock';
import Store from './mocks/Store';
import vendorList from './mocks/vendorList.mock';

jest.mock('uuid/v4', () => () => 1);

describe('Dialog', () => {
  afterEach(() => {
    ApiMock.reset();
  });

  let store;

  beforeEach(() => {
    store = Store.create();
  });

  describe('openCostCenterDialog()', () => {
    it('openCostCenterDialog success', async () => {
      ApiMock.mockReturnValue({
        '/cost-center/recently-used/list': {
          records: costCenterList.costCenterList,
        },
      });

      await store.dispatch(
        dialogActions.openCostCenterDialog('2020-02-20', '', '')
      );

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('openExpenseTypeDialog()', () => {
    it('openExpenseTypeDialog success', async () => {
      ApiMock.mockReturnValue({
        '/exp/expense-type/recently-used/list': expTypes,
      });

      await store.dispatch(
        dialogActions.openExpenseTypeDialog('', '', '2020-02-20', '', '', false)
      );

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('openJobDialog()', () => {
    it('open job dialog success', async () => {
      ApiMock.mockReturnValue({
        '/job/recently-used/list': jobRecentList,
      });

      await store.dispatch(dialogActions.openJobDialog('2020-02-21', '', ''));

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('openOCRReceiptLibraryDialog()', () => {
    it('open OCRReceiptLibrary Dialog success', async () => {
      ApiMock.mockReturnValue({
        '/exp/receipt/list': receiptList,
        '/exp/receipt/ocr/get-status': ocrStatus,
      });

      await store.dispatch(dialogActions.openOCRReceiptLibraryDialog());

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('openReceiptLibraryDialog()', () => {
    it('openReceiptLibraryDialog success', async () => {
      ApiMock.mockReturnValue({
        '/exp/receipt/list': receiptList,
      });

      await store.dispatch(dialogActions.openReceiptLibraryDialog(true, 1));

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('openEILookupDialog()', () => {
    it('open EI lookup dialog success', async () => {
      ApiMock.mockReturnValue({
        '/extended-item-custom-option/recently-used/list': {
          isSuccess: true,
          result: eiLookupRecords,
        },
      });

      await store.dispatch(dialogActions.openEILookupDialog({} as any, '', ''));

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('openIcTransactionDialog()', () => {
    it('openIcTransactionDialog success', async () => {
      await store.dispatch(dialogActions.openIcTransactionDialog());
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('openTransactionSelectionDialog()', () => {
    it('openTransactionSelectionDialog success', async () => {
      await store.dispatch(dialogActions.openTransactionSelectionDialog());
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('openApprovalHistoryDialog()', () => {
    it('openApprovalHistoryDialog success', async () => {
      ApiMock.mockReturnValue({
        '/exp/request/history/get': approvalHistory,
      });

      await store.dispatch(dialogActions.openApprovalHistoryDialog(''));

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('openEditHistoryDialog()', () => {
    it('openEditHistoryDialog success', async () => {
      ApiMock.mockReturnValue({
        '/exp/finance-approval/report/history/get': editHistory,
      });

      await store.dispatch(dialogActions.openEditHistoryDialog(''));

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('openSwitchEmployeeDialog()', () => {
    it('Should succesfully open switch employee dialog', async () => {
      await store.dispatch(dialogActions.openSwitchEmployeeDialog());

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('openCustomRequestDialog()', () => {
    it('Should succesfully open custom request dialog', async () => {
      await store.dispatch(dialogActions.openCustomRequestDialog());

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('openVendorLookupDialog()', () => {
    it('Should succesfully open vendor dialog', async () => {
      ApiMock.mockReturnValue({
        '/exp/vendor/recently-used/list': vendorList,
      });
      await store.dispatch(dialogActions.openVendorLookupDialog('', '', []));

      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
