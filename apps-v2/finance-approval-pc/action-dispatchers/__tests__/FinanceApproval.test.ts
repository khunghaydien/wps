import ApiMock, { ErrorResponse } from '../../../../__tests__/mocks/ApiMock';
import * as actions from '../FinanceApproval';
import reportDetail from './mocks/reportDetail.mock';
import reportListRes from './mocks/reportList.mock';
import requestDetail from './mocks/requestDetail.mock';
import requestIdListRes from './mocks/requestIdList.mock';
import searchConditionRes from './mocks/searchCondition.mock';
import Store from './mocks/Store';

jest.mock('uuid/v4', () => () => 1);

describe('FinanceApproval', () => {
  const RealDate = Date;
  let store;

  beforeEach(() => {
    store = Store.create();
    // @ts-ignore for Test
    global.Date.now = jest.fn(() => new Date('2020-04-20'));
  });

  afterEach(() => {
    ApiMock.reset();
    global.Date = RealDate;
  });

  describe('fetchFinanceApprovalIdList()', () => {
    it('load report id list success', async () => {
      ApiMock.mockReturnValue({
        '/exp/finance-approval/request-id/list': requestIdListRes,
        '/exp/finance-approval/report/list': reportListRes,
      });
      await store.dispatch(actions.fetchFinanceApprovalIdList('companyId'));
      expect(store.getActions()).toMatchSnapshot();
    });

    it('load report id list fail', async () => {
      ApiMock.mockReturnValue({
        '/exp/finance-approval/request-id/list': new ErrorResponse({
          code: 'FATAL',
          message: 'Server not responded',
        }),
        '/exp/finance-approval/report/list': reportListRes,
      });
      await store.dispatch(actions.fetchFinanceApprovalIdList('companyId'));
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('fetchFinanceApprovalList()', () => {
    it('load report list success', async () => {
      ApiMock.mockReturnValue({
        '/exp/finance-approval/report/list': reportListRes,
      });
      await store.dispatch(
        actions.fetchFinanceApprovalList(requestIdListRes.requestIdList, 1)
      );
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('fetchExpRequest()', () => {
    it('load report success', async () => {
      ApiMock.mockReturnValue({
        '/exp/finance-approval/report/get': reportDetail,
        '/exp/pre-request/get': requestDetail,
      });
      await store.dispatch(actions.fetchExpRequest('', []));
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('saveSearchCondition()', () => {
    it('saveSearchCondition success', async () => {
      ApiMock.mockReturnValue({
        '/personal-setting/get': searchConditionRes,
        '/personal-setting/update': { isSuccess: true, result: {} },
      });
      await store.dispatch(
        actions.saveSearchCondition({
          expReportSearchConditionList:
            searchConditionRes.expReportSearchConditionList,
        } as any)
      );
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('deteleAdvSearchCondition()', () => {
    it('deteleAdvSearchCondition success', async () => {
      ApiMock.mockReturnValue({
        '/personal-setting/update': { isSuccess: true, result: {} },
        '/personal-setting/get': searchConditionRes,
      });
      await store.dispatch(
        actions.deteleAdvSearchCondition({
          expReportSearchConditionList:
            searchConditionRes.expReportSearchConditionList,
        } as any)
      );
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('reject()', () => {
    it('reject success', async () => {
      ApiMock.mockReturnValue({
        '/exp/finance-approval/report/reject': {
          isSuccess: true,
          result: null,
        },
        '/exp/finance-approval/report/get': reportDetail,
      });
      await store.dispatch(actions.reject([''], '', [], '', []));
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('approve()', () => {
    it('approve success', async () => {
      ApiMock.mockReturnValue({
        '/exp/finance-approval/report/approve': {
          isSuccess: true,
          result: null,
        },
        '/exp/finance-approval/report/get': reportDetail,
      });
      await store.dispatch(actions.approve([''], '', [], '', []));
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('saveExpReport()', () => {
    it('saveExpReport success', async () => {
      ApiMock.mockReturnValue({
        '/exp/finance-approval/report/save': {
          isSuccess: true,
          result: { reportId: '' },
        },
        '/exp/finance-approval/report/get': reportDetail,
        '/exp/finance-approval/request-id/list': requestIdListRes,
        '/exp/finance-approval/report/list': reportListRes,
      });
      await store.dispatch(
        actions.saveExpReport(reportDetail, '', 'Asc', '', [])
      );
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('saveExpRecord()', () => {
    it('saveExpRecord success', async () => {
      ApiMock.mockReturnValue({
        '/exp/finance-approval/record/save': {
          isSuccess: true,
          result: { updatedReportAmount: null, recordId: 'a0x2v00000iBBauAAG' },
        },
        '/exp/finance-approval/report/get': reportDetail,
        '/exp/finance-approval/request-id/list': requestIdListRes,
        '/exp/finance-approval/report/list': reportListRes,
      });
      await store.dispatch(
        actions.saveExpRecord(
          reportDetail.records[0] as any,
          '',
          'Asc',
          '',
          '',
          '',
          '',
          null,
          []
        )
      );
      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
