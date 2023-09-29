import moment from 'moment';

import eventTemplate from '../../constants/eventTemplate';

import defaultPermission from '../../../domain/models/access-control/Permission';

import ApiMock from '../../../../__tests__/mocks/ApiMock';
import App from '../App';
import {
  alerts,
  errorResponse,
  jobPickListGet,
  plannerEventGet,
  plannerEventGetNonNominal,
  requestAlert,
  userSettingGet,
  workCategoryGet,
} from './mocks/Responses';
import Store from './mocks/Store';

describe('App', () => {
  // Arrange
  afterEach(() => {
    ApiMock.reset();
  });

  describe('initialize()', () => {
    it('should dispatch actions to initialize state while blocking user interaction', async () => {
      // Arrange
      ApiMock.mockReturnValue({
        '/time-track/alert/list': alerts,
        '/user-setting/get': userSettingGet,
        '/planner/event/get': plannerEventGet,
        '/personal-setting/get': {
          searchConditionList: [],
          plannerDefaultView: 'Weekly',
        },
        '/time-track/request-alert/get': requestAlert,
      });

      const store = Store.create();
      const app = App(store.dispatch);

      // Act
      await app.initialize({
        userPermission: defaultPermission,
        targetDate: '2020-01-15',
      });

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    });
    it('throws API errors, then it should catch API errors', async () => {
      // Arrange
      ApiMock.mockReturnValue({
        '/time-track/alert/list': alerts,
        '/user-setting/get': userSettingGet,
        '/planner/event/get': errorResponse,
        '/personal-setting/get': {
          searchConditionList: [],
          plannerDefaultView: 'Weekly',
        },
        '/time-track/request-alert/get': requestAlert,
      });

      const store = Store.create();
      const app = App(store.dispatch);

      // Act
      await app.initialize({
        userPermission: defaultPermission,
        targetDate: '2019-09-16',
      });

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    });
    it('throws business errors, then it should catch business errors', async () => {
      // Arrange
      ApiMock.mockReturnValue({
        '/time-track/alert/list': alerts,
        '/user-setting/get': userSettingGet,
        '/planner/event/get': plannerEventGetNonNominal,
        '/personal-setting/get': {
          searchConditionList: [],
          plannerDefaultView: 'Weekly',
        },
        '/time-track/request-alert/get': requestAlert,
      });

      const store = Store.create();
      const app = App(store.dispatch);

      // Act
      await app.initialize({
        userPermission: defaultPermission,
        targetDate: '2019-11-10',
      });

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    });
    it('failed to fetch user-setting, then it should continue the following process', async () => {
      // Arrange
      ApiMock.mockReturnValue({
        '/time-track/alert/list': alerts,
        '/user-setting/get': errorResponse,
        '/planner/event/get': plannerEventGet,
        '/personal-setting/get': {
          searchConditionList: [],
          plannerDefaultView: 'Weekly',
        },
        '/time-track/request-alert/get': requestAlert,
      });

      const store = Store.create();
      const app = App(store.dispatch);

      // Act
      await app.initialize({
        userPermission: defaultPermission,
        targetDate: '2020-01-03',
      });

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('closeEventEditPopup()', () => {
    it('should dispatch action to close EventEditPopup', () => {
      const store = Store.create();
      const app = App(store.dispatch);

      app.closeEventEditPopup('id12345');
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('openEventEditPopup()', () => {
    it('should dispatch action to open EventEditPopup for creating new event', async () => {
      ApiMock.mockReturnValue({
        '/planner/job-picklist/get': jobPickListGet,
      });

      const store = Store.create();
      const app = App(store.dispatch);

      const newEvent = {
        ...eventTemplate,
        start: moment('2019-10-6 20:00', ['YYYY-MM-D hh:mm']),
        end: moment('2019-10-6 24:00', ['YYYY-MM-D hh:mm']),
      };
      await app.openEventEditPopup(newEvent, { top: 20, left: 100 });

      expect(store.getActions()).toMatchSnapshot();
    });

    it('should dispatch action to open EventEditPopup for existed event', async () => {
      ApiMock.mockReturnValue({
        '/planner/job-picklist/get': jobPickListGet,
        '/time/work-category/get': workCategoryGet,
      });

      const store = Store.create();
      const app = App(store.dispatch);

      const newEvent = {
        ...eventTemplate,
        start: moment('2019-10-6 20:00', ['YYYY-MM-D hh:mm']),
        end: moment('2019-10-6 24:00', ['YYYY-MM-D hh:mm']),
        id: '1',
        job: {
          id: '2',
        },
      };
      // @ts-ignore
      await app.openEventEditPopup(newEvent, { top: 20, left: 100 });

      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
