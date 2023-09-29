// @ts-nocheck
import ApiMock, { ErrorResponse } from '../../../../__tests__/mocks/ApiMock';
import * as actions from '../Project';
import projectList from './mocks/projectList.mock';
import Store from './mocks/Store';

jest.mock('uuid/v4', () => () => 1);

describe('Project Page', () => {
  afterEach(() => {
    ApiMock.reset();
  });

  let store;

  beforeEach(() => {
    store = Store.create();
  });

  describe('fetchProjectList()', () => {
    it('should fetch list of existing projects', async () => {
      ApiMock.mockReturnValue({
        '/psa/project/list': projectList,
      });

      await store.dispatch(actions.fetchProjectList('a0P6D000001sZhNUAU', 1));
      expect(store.getActions()).toMatchSnapshot();
    });

    it('load project list fail', async () => {
      ApiMock.mockReturnValue({
        '/psa/project/list': new ErrorResponse({
          code: 'FATAL',
          message: 'Server not responded',
        }),
      });

      await store.dispatch(actions.fetchProjectList(false));
      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
