import { parse } from 'date-fns';

import ApiMock from '../../../../__tests__/mocks/ApiMock';
import Events from '../Events';
import { plannerEventGet } from './mocks/Responses';
import Store from './mocks/Store';

describe('Events', () => {
  // Arrange
  afterEach(() => {
    ApiMock.reset();
  });

  describe('loadEvents()', () => {
    it('should dispatch actions to initialize events', async () => {
      // Arrange
      ApiMock.setDummyResponse(
        '/planner/event/get',
        {
          startDate: '2019-12-28T15:00:00.000Z',
          endDate: '2020-02-01T15:00:00.000Z',
          empId: undefined,
        },
        plannerEventGet
      );

      const store = Store.create();
      const events = Events(store.dispatch);

      // Act
      await events.loadEvents(parse('2020-01-30'));

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('loadEventsBetween()', () => {
    it('should dispatch actions to initialize events of a given period', async () => {
      // Arrange
      const startDate = parse('2019-12-28T15:00:00.000Z');
      const endDate = parse('2020-02-01T15:00:00.000Z');

      ApiMock.setDummyResponse(
        '/planner/event/get',
        {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          empId: undefined,
        },
        plannerEventGet
      );

      const store = Store.create();
      const events = Events(store.dispatch);

      // Act
      await events.loadEventsBetween({ startDate, endDate });

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
