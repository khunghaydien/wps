import ApiMock from '../../../../__tests__/mocks/ApiMock';
import * as jobActions from '../Job';
import jobList, { jobSearchResult } from './mocks/jobList.mock';
import Store from './mocks/Store';

jest.mock('uuid/v4', () => () => 1);

describe('Job', () => {
  afterEach(() => {
    ApiMock.reset();
  });

  let store;

  beforeEach(() => {
    store = Store.create();
  });

  describe('getJobSearchResult()', () => {
    it('search job success', async () => {
      ApiMock.mockReturnValue({
        '/job/search': jobSearchResult,
      });

      await store.dispatch(
        jobActions.getJobSearchResult('query string', '2020-02-21', '')
      );

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('getJobList()', () => {
    it('get next level of job list success', async () => {
      ApiMock.mockReturnValue({
        '/exp/job/get': jobList,
      });

      await store.dispatch(
        jobActions.getJobList('parentId1', '2020-02-21', '')
      );

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('getNextJobList()', () => {
    it('get next level of job list success', async () => {
      ApiMock.mockReturnValue({
        '/exp/job/get': jobList,
      });

      await store.dispatch(jobActions.getNextJobList(null, [], '', '', ''));

      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
