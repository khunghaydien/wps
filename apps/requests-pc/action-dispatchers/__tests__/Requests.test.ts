import ApiMock, { ErrorResponse } from '../../../../__tests__/mocks/ApiMock';
import * as actions from '../Requests';
import requestDetail from './mocks/requestDetail.mock';
import requestIdListRes from './mocks/requestIdList.mock';
import requestListRes from './mocks/requestList.mock';
import Store from './mocks/Store';

jest.mock('uuid/v4', () => () => 1);

describe('Requests', () => {
  afterEach(() => {
    ApiMock.reset();
  });

  let store;

  beforeEach(() => {
    store = Store.create();
  });

  describe('createNewExpReport()', () => {
    it('create new request', async () => {
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
    it('load request id list success', async () => {
      ApiMock.mockReturnValue({
        '/exp/pre-request/id-list': requestIdListRes,
        '/exp/pre-request/list': requestListRes,
      });

      await store.dispatch(actions.fetchExpReportIdList(false, null));
      expect(store.getActions()).toMatchSnapshot();
    });

    it('load report id list fail', async () => {
      ApiMock.mockReturnValue({
        '/exp/pre-request/id-list': new ErrorResponse({
          code: 'FATAL',
          message: 'Server not responded',
        }),
        '/exp/pre-request/list': requestListRes,
      });

      await store.dispatch(actions.fetchExpReportIdList(false, null));
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('fetchExpReportList()', () => {
    it('load request list success', async () => {
      ApiMock.mockReturnValue({
        '/exp/pre-request/list': requestListRes,
      });

      await store.dispatch(
        actions.fetchExpReportList(requestIdListRes.reportIdList, 1, 'empId')
      );
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('cloneReport()', () => {
    it('clone request success', async () => {
      ApiMock.mockReturnValue({
        '/exp/pre-request/clone': requestListRes,
        '/exp/pre-request/id-list': requestIdListRes,
        '/exp/pre-request/list': requestListRes,
        '/exp/pre-request/get': requestDetail,
      });

      await store.dispatch(actions.cloneReport('reportId1', [], 'empId'));
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('saveExpReport()', () => {
    it('save request success', async () => {
      ApiMock.mockReturnValue({
        '/exp/pre-request/save': {
          reportId: 'a112v000009tNyyAAE',
        },
      });

      await store.dispatch(
        actions.saveExpReport(
          requestDetail as any,
          [],
          requestListRes.reports as any,
          requestIdListRes.reportIdList,
          'empId'
        )
      );
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('deleteExpReport()', () => {
    it('delete request success', async () => {
      ApiMock.mockReturnValue({
        '/exp/pre-request/delete': { isSuccess: true, result: null },
        '/exp/pre-request/id-list': requestIdListRes,
        '/exp/pre-request/list': requestListRes,
      });

      await store.dispatch(actions.deleteExpReport('reportId1', 'empId'));

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('submitExpReport()', () => {
    it('submit request success', async () => {
      ApiMock.mockReturnValue({
        '/exp/request/pre-request/submit': { isSuccess: true, result: {} },
        '/exp/pre-request/id-list': requestIdListRes,
        '/exp/pre-request/list': requestListRes,
        '/exp/pre-request/get': requestDetail,
      });

      await store.dispatch(actions.submitExpReport('', '', 'empId', false));

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('cancelExpRequestApproval()', () => {
    it('cancelExpRequestApproval success', async () => {
      ApiMock.mockReturnValue({
        '/exp/request/pre-request/cancel-request': {
          isSuccess: true,
          result: {},
        },
        '/exp/pre-request/id-list': requestIdListRes,
        '/exp/pre-request/list': requestListRes,
        '/exp/pre-request/get': requestDetail,
      });

      await store.dispatch(
        actions.cancelExpRequestApproval('', '', 'empId', 'repordId', [], false)
      );

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('saveExpRecord()', () => {
    it('save record success', async () => {
      ApiMock.mockReturnValue({
        '/exp/pre-request/record/save': {
          updatedReportAmount: 1019.0,
          recordId: 'a142v000005xfJKAAY',
        },
      });

      await store.dispatch(
        actions.saveExpRecord(
          requestDetail.records[0] as any,
          [],
          requestDetail as any,
          'empId'
        )
      );

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('deleteExpRecord()', () => {
    it('delete record success', async () => {
      ApiMock.mockReturnValue({
        '/exp/pre-request/record/delete': { isSuccess: true, result: null },
        '/exp/pre-request/id-list': requestIdListRes,
        '/exp/pre-request/list': requestListRes,
      });

      await store.dispatch(actions.deleteExpRecord(['recordId1'], 'empId'));

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('cloneRecords()', () => {
    it('clone records success', async () => {
      ApiMock.mockReturnValue({
        '/exp/pre-request/record/clone': {
          updatedRecords: [],
          recordIds: ['a0x2v00000iB6MpAAK', 'a0x2v00000iB6MqAAK'],
        },
        '/exp/pre-request/get': requestDetail,
      });

      await store.dispatch(
        actions.cloneRecords(
          ['a0x2v00000iB6MpAAK', 'a0x2v00000iB6MqAAK'],
          ['recordId'],
          'reportId',
          [],
          1,
          'empId',
          false
        )
      );

      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
