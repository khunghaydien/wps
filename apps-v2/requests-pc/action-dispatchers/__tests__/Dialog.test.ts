import './mocks/mockWindowObj';
import ApiMock from '../../../../__tests__/mocks/ApiMock';
import * as dialogActions from '../Dialog';
import approvalHistoryRes from './mocks/approvalHistory.mock';
import costCenterListRes from './mocks/costCenterListRes.mock';
import eiLookupRecords from './mocks/eiLookup.mock';
import expTypesRes from './mocks/expTypesRes.mock';
import { jobRecentList } from './mocks/jobList.mock';
import receiptList from './mocks/receiptList.mock';
import Store from './mocks/Store';
import vendorListRes from './mocks/vendorListRes.mock';

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
          records: costCenterListRes.costCenterList,
        },
      });

      await store.dispatch(
        dialogActions.openCostCenterDialog('2020-02-20', '', '', false)
      );

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('openExpenseTypeDialog()', () => {
    it('openExpenseTypeDialog success', async () => {
      ApiMock.mockReturnValue({
        '/exp/expense-type/recently-used/list': expTypesRes,
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

      await store.dispatch(
        dialogActions.openJobDialog('2020-02-21', '', '', false)
      );

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('openReceiptLibraryDialog()', () => {
    it('openReceiptLibraryDialog success', async () => {
      ApiMock.mockReturnValue({
        '/exp/receipt/list': receiptList,
      });

      await store.dispatch(dialogActions.openReceiptLibraryDialog(1));

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

  describe('openApprovalHistoryDialog()', () => {
    it('openApprovalHistoryDialog success', async () => {
      ApiMock.mockReturnValue({
        '/exp/request/history/get': approvalHistoryRes,
      });

      await store.dispatch(dialogActions.openApprovalHistoryDialog(''));

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('openSwitchEmployeeDialog()', () => {
    it('Should succesfully open switch employee dialog', async () => {
      await store.dispatch(dialogActions.openSwitchEmployeeDialog());

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('openVendorLookupDialog()', () => {
    it('Should succesfully open vendor dialog', async () => {
      ApiMock.mockReturnValue({
        '/exp/vendor/recently-used/list': vendorListRes,
      });
      await store.dispatch(dialogActions.openVendorLookupDialog('', '', []));

      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
