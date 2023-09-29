import ApiMock from '../../../../__tests__/mocks/ApiMock';
import * as actions from '../ReportType';
import report from './mocks/reportDetail.mock';
import reportTypeRes from './mocks/reportType.mock';
import Store from './mocks/Store';

jest.mock('uuid/v4', () => () => 1);

describe('ReportType', () => {
  afterEach(() => {
    ApiMock.reset();
  });

  let store;

  beforeEach(() => {
    store = Store.create();
  });

  describe('getReportTypeWithLinkedExpType()', () => {
    it('getReportTypeWithLinkedExpType success', async () => {
      ApiMock.mockReturnValue({
        '/exp/report-type/search': reportTypeRes,
      });

      await store.dispatch(
        actions.getReportTypeWithLinkedExpType(report as any, [], '')
      );

      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
