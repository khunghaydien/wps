import creditCardTransactions from './mocks/creditCardTransactions.mock';

import ApiMock, { ErrorResponse } from '../../../../__tests__/mocks/ApiMock';
import * as actions from '../Expenses';
import cards from './mocks/cards.mock';
import eiLookupRecords from './mocks/eiLookup.mock';
import employees from './mocks/employees.mock';
import icRecordList from './mocks/icRecordList.mock';
import report from './mocks/reportDetail.mock';
import reportIdList from './mocks/reportIdList.mock';
import reportList from './mocks/reportList.mock';
import Store from './mocks/Store';

jest.mock('uuid/v4', () => () => 1);

describe('Expenses', () => {
  afterEach(() => {
    ApiMock.reset();
  });

  let store;

  beforeEach(() => {
    store = Store.create();
  });

  describe('getICCardTransactions()', () => {
    it('get ic transactions success', async () => {
      ApiMock.mockReturnValue({
        '/exp/transit-card/record/list': icRecordList,
      });

      await store.dispatch(actions.getICCardTransactions('', '', '', ''));

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('createNewExpReport()', () => {
    it('create new report', async () => {
      await store.dispatch(
        actions.createNewExpReport([], {
          costCenterCode: null,
          costCenterName: null,
          costCenterHistoryId: null,
        })
      );
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('fetchExpReportIdList()', () => {
    it('load report id list success', async () => {
      ApiMock.mockReturnValue({
        '/exp/report/id-list': reportIdList,
        '/exp/report/list': reportList,
      });

      await store.dispatch(actions.fetchExpReportIdList(false, null));
      expect(store.getActions()).toMatchSnapshot();
    });

    it('load report id list fail', async () => {
      ApiMock.mockReturnValue({
        '/exp/report/id-list': new ErrorResponse({
          code: 'FATAL',
          message: 'Server not responded',
        }),
        '/exp/report/list': reportList,
      });

      await store.dispatch(actions.fetchExpReportIdList(false, null));
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('fetchExpReportList()', () => {
    it('load report list success', async () => {
      ApiMock.mockReturnValue({
        '/exp/report/list': reportList,
      });

      await store.dispatch(
        actions.fetchExpReportList(reportIdList.reportIdList, 1, '')
      );
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('saveExpReport()', () => {
    it('save report success', async () => {
      ApiMock.mockReturnValue({
        '/exp/report/save': {
          reportId: 'a112v000009tNyyAAE',
        },
      });

      await store.dispatch(
        actions.saveExpReport(
          report as any,
          [],
          reportList.reports,
          reportIdList.reportIdList,
          ''
        )
      );

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('cancelExpReportRequest()', () => {
    it('cancelExpReportRequest success', async () => {
      ApiMock.mockReturnValue({
        '/exp/request/report/cancel-request': { isSuccess: true, result: {} },
        '/exp/report/id-list': reportIdList,
        '/exp/report/list': reportList,
        '/exp/report/get': report,
      });

      await store.dispatch(
        actions.cancelExpReportRequest('', '', '', '', [], false)
      );

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('submitExpReport()', () => {
    it('submit report success', async () => {
      ApiMock.mockReturnValue({
        '/exp/request/report/submit': { isSuccess: true, result: {} },
        '/exp/report/id-list': reportIdList,
        '/exp/report/list': reportList,
        '/exp/report/get': report,
      });

      await store.dispatch(actions.submitExpReport('', '', '', false));

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('deleteExpReport()', () => {
    it('delete report success', async () => {
      ApiMock.mockReturnValue({
        '/exp/report/delete': { isSuccess: true, result: null },
        '/exp/report/id-list': reportIdList,
        '/exp/report/list': reportList,
      });

      await store.dispatch(actions.deleteExpReport('reportId1'));

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('createReportFromRequest()', () => {
    it('claim from request success', async () => {
      ApiMock.mockReturnValue({
        '/exp/pre-request/create-report': {
          updatedRecords: [],
          reportId: 'a112v000009u95LAAQ',
        },
        '/exp/report/id-list': reportIdList,
        '/exp/report/list': reportList,
        '/exp/report/get': report,
      });

      await store.dispatch(
        actions.createReportFromRequest(report as any, [], '')
      );

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('cloneRecords()', () => {
    it('clone records success', async () => {
      ApiMock.mockReturnValue({
        '/exp/report/record/clone': {
          updatedRecords: [],
          recordIds: ['a0x2v00000iB6MpAAK', 'a0x2v00000iB6MqAAK'],
        },
        '/exp/report/get': report,
      });

      await store.dispatch(
        actions.cloneRecords(
          ['2020-01-01', '2020-03-01'],
          ['a0x2v00000iB6MpAAK', 'a0x2v00000iB6MqAAK'],
          'reportId',
          null,
          1,
          'empId',
          false
        )
      );

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('deleteExpRecord()', () => {
    it('delete record success', async () => {
      ApiMock.mockReturnValue({
        '/exp/report/record/delete': { isSuccess: true, result: null },
        '/exp/report/id-list': reportIdList,
        '/exp/report/list': reportList,
      });

      await store.dispatch(actions.deleteExpRecord(['recordId1'], 'empId'));

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('saveExpRecord()', () => {
    it('save record success', async () => {
      ApiMock.mockReturnValue({
        '/exp/report/record/save': {
          updatedReportAmount: 1019.0,
          recordId: 'a0x2v00000iB6MpAAK',
        },
      });

      await store.dispatch(
        actions.saveExpRecord(
          report.records[0] as any,
          [],
          report as any,
          'empId'
        )
      );

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('searchEmployees()', () => {
    it('search employees success', async () => {
      ApiMock.mockReturnValue({
        '/employee/search': employees,
      });

      await store.dispatch(actions.searchEmployees('', '', 100, ''));

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('getIcCardList()', () => {
    it('get card list success', async () => {
      ApiMock.mockReturnValue({
        '/exp/transit-card/card/list': cards,
      });

      await store.dispatch(actions.getIcCardList('', '', '', ''));

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('getCreditCardTransactions()', () => {
    it('get transactions success', async () => {
      ApiMock.mockReturnValue({
        '/exp/credit-card-transaction/search': creditCardTransactions,
      });

      await store.dispatch(actions.getCreditCardTransactions('', '', '', ''));

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('searchEILookup()', () => {
    it('search EI lookup success', async () => {
      ApiMock.mockReturnValue({
        '/extended-item-custom-option/search': eiLookupRecords,
      });

      await store.dispatch(actions.searchEILookup('', '', ''));

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('cloneReport()', () => {
    it('search EI lookup success', async () => {
      ApiMock.mockReturnValue({
        '/exp/report/clone': { reportId: '123' },
        '/exp/report/id-list': reportIdList,
        '/exp/report/list': reportList,
        '/exp/report/get': report,
      });

      await store.dispatch(actions.cloneReport('', [], ''));

      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
