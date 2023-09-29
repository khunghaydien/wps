import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { parse } from 'date-fns';

import { CATCH_API_ERROR } from '../../../commons/actions/app';

import ApiMock from '../../../../__tests__/mocks/ApiMock';
import Calendar from '../Calendar';
import { alerts, errorResponse, plannerEventGet } from './mocks/Responses';

const initialState = {
  common: {
    empInfo: {
      startDayOfTheWeek: 0,
    },
  },
};

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

afterEach(() => {
  ApiMock.reset();
});

describe('openEventList()', () => {
  it('should dispatch actions to open event list', () => {
    // Arrange
    const targetDate = parse('2019-10-12');
    const store = mockStore(initialState);
    // @ts-ignore
    const calendar = Calendar({ useWorkTime: true }, store.dispatch);

    // Act
    calendar.openEventList(targetDate, 100, 50);

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('closeEventList()', () => {
  it('should dispatch actions to close event list', () => {
    // Arrange
    const store = mockStore(initialState);
    // @ts-ignore
    const calendar = Calendar({ useWorkTime: true }, store.dispatch);

    // Act
    calendar.closeEventList();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('openEvent()', () => {
  it.skip('should dispatch actions to open event edit popup', () => {
    // @NOTE
    // Not implemented yet

    // Arrange
    const store = mockStore(initialState);
    // @ts-ignore
    const calendar = Calendar({ useWorkTime: true }, store.dispatch);

    // Act
    calendar.openEvent();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('closeEvent()', () => {
  it.skip('should dispatch actions to close event edit popup', () => {
    // @NOTE
    // Not implemented yet

    // Arrange
    const store = mockStore(initialState);
    // @ts-ignore
    const calendar = Calendar({ useWorkTime: true }, store.dispatch);

    // Act
    calendar.closeEvent();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('goNextMonth()', () => {
  it('should dispatch actions to go next month calendar', async () => {
    // Arrange
    ApiMock.mockReturnValue({
      '/planner/event/get': plannerEventGet,
      '/time-track/alert/list': alerts,
    });

    const current = parse('2019-12-12');
    const store = mockStore(initialState);
    // @ts-ignore
    const calendar = Calendar({ useWorkTime: true }, store.dispatch);

    // Act
    await calendar.goNextMonth(current);

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
  it('throws API error, then it should catch error', async () => {
    // Arrange
    ApiMock.mockReturnValue({ '/planner/event/get': errorResponse });

    const current = parse('2020-03-10');
    const store = mockStore(initialState);
    // @ts-ignore
    const calendar = Calendar({ useWorkTime: true }, store.dispatch);

    // Act
    await calendar.goNextMonth(current);

    // Assert
    const error = store
      .getActions()
      .find((action) => action.type === CATCH_API_ERROR);
    expect(error).toStrictEqual({
      type: CATCH_API_ERROR,
      payload: {
        errorCode: undefined,
        isContinuable: false,
        isFunctionCantUseError: false,
        message: 'APIエラー - Server not responded',
        problem: 'Server not responded',
        stackTrace: 'aaaa',
        type: 'APIエラー',
      },
    });
  });
});

describe('goPrevMonth()', () => {
  it('should dispatch actions to go prev month calendar', async () => {
    // Arrange
    ApiMock.mockReturnValue({
      '/planner/event/get': plannerEventGet,
      '/time-track/alert/list': alerts,
    });

    const current = parse('2020-02-12');
    const store = mockStore(initialState);
    // @ts-ignore
    const calendar = Calendar({ useWorkTime: true }, store.dispatch);

    // Act
    await calendar.goPrevMonth(current);

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
  it('throws API error, then it should catch error', async () => {
    // Arrange
    ApiMock.mockReturnValue({ '/planner/event/get': errorResponse });

    const current = parse('2020-05-10');
    const store = mockStore(initialState);
    // @ts-ignore
    const calendar = Calendar({ useWorkTime: true }, store.dispatch);

    // Act
    await calendar.goPrevMonth(current);

    // Assert
    const error = store
      .getActions()
      .find((action) => action.type === CATCH_API_ERROR);
    expect(error).toStrictEqual({
      type: CATCH_API_ERROR,
      payload: {
        errorCode: undefined,
        isContinuable: false,
        isFunctionCantUseError: false,
        message: 'APIエラー - Server not responded',
        problem: 'Server not responded',
        stackTrace: 'aaaa',
        type: 'APIエラー',
      },
    });
  });
});

describe('goNextWeek()', () => {
  it('should dispatch actions to go next week calendar', async () => {
    // Arrange
    ApiMock.mockReturnValue({
      '/planner/event/get': plannerEventGet,
      '/time-track/alert/list': alerts,
    });

    const current = parse('2019-12-31');
    const store = mockStore(initialState);
    // @ts-ignore
    const calendar = Calendar({ useWorkTime: true }, store.dispatch);

    // Act
    await calendar.goNextWeek(current);

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
  it('should fetch events of next month only if next week is in next month', async () => {
    // Arrange
    ApiMock.mockReturnValue({ '/planner/event/get': errorResponse });

    const current = parse('2019-12-31');
    const store = mockStore(initialState);
    // @ts-ignore
    const calendar = Calendar({ useWorkTime: true }, store.dispatch);

    // Act
    await calendar.goNextWeek(current);

    // Assert
    expect(ApiMock.invoke).toHaveBeenCalledWith({
      param: {
        empId: undefined,
        endDate: '2020-02-01T15:00:00.000Z',
        startDate: '2019-12-28T15:00:00.000Z',
      },
      path: '/planner/event/get',
    });
  });
  it('should not fetch events of next month if next week is in current month ', async () => {
    // Arrange
    ApiMock.mockReturnValue({
      '/planner/event/get': plannerEventGet,
      '/time-track/alert/list': alerts,
    });

    const current = parse('2019-12-20');
    const store = mockStore(initialState);
    // @ts-ignore
    const calendar = Calendar({ useWorkTime: true }, store.dispatch);

    // Act
    await calendar.goNextWeek(current);

    // Assert
    expect(ApiMock.invoke).not.toHaveBeenCalled();
  });
  it('throws API error, then it should catch error', async () => {
    // Arrange
    ApiMock.mockReturnValue({ '/planner/event/get': errorResponse });

    const current = parse('2020-04-31');
    const store = mockStore(initialState);
    // @ts-ignore
    const calendar = Calendar({ useWorkTime: true }, store.dispatch);

    // Act
    await calendar.goPrevMonth(current);

    // Assert
    const error = store
      .getActions()
      .find((action) => action.type === CATCH_API_ERROR);
    expect(error).toStrictEqual({
      type: CATCH_API_ERROR,
      payload: {
        errorCode: undefined,
        isContinuable: false,
        isFunctionCantUseError: false,
        message: 'APIエラー - Server not responded',
        problem: 'Server not responded',
        stackTrace: 'aaaa',
        type: 'APIエラー',
      },
    });
  });
});

describe('goPrevWeek()', () => {
  // @ts-ignore
  it('should dispatch actions to go prev week calendar', async () => {
    // Arrange
    ApiMock.mockReturnValue({
      '/planner/event/get': plannerEventGet,
      '/time-track/alert/list': alerts,
    });

    const current = parse('2020-01-02');
    const store = mockStore(initialState);
    // @ts-ignore
    const calendar = Calendar({ useWorkTime: true }, store.dispatch);

    // Act
    await calendar.goPrevWeek(current);

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
  it('should fetch events of prev month only if prev week is in prev month', async () => {
    // Arrange
    ApiMock.mockReturnValue('/planner/event/get', errorResponse);

    const current = parse('2020-01-02');
    const store = mockStore(initialState);
    // @ts-ignore
    const calendar = Calendar({ useWorkTime: true }, store.dispatch);

    // Act
    await calendar.goPrevWeek(current);

    // Assert
    expect(ApiMock.invoke).toHaveBeenCalledWith({
      param: {
        empId: undefined,
        endDate: '2020-01-04T15:00:00.000Z',
        startDate: '2019-11-30T15:00:00.000Z',
      },
      path: '/planner/event/get',
    });
  });
  it('should not fetch events of prev month if prev week is in current month ', async () => {
    // Arrange
    ApiMock.mockReturnValue({
      '/planner/event/get': plannerEventGet,
      '/time-track/alert/list': alerts,
    });

    const current = parse('2020-01-07');
    const store = mockStore(initialState);
    // @ts-ignore
    const calendar = Calendar({ useWorkTime: true }, store.dispatch);

    // Act
    await calendar.goNextWeek(current);

    // Assert
    expect(ApiMock.invoke).not.toHaveBeenCalled();
  });
  it('throws API error, then it should catch error', async () => {
    // Arrange
    ApiMock.mockReturnValue({ '/planner/event/get': errorResponse });

    const current = parse('2020-05-01');
    const store = mockStore(initialState);
    // @ts-ignore
    const calendar = Calendar({ useWorkTime: true }, store.dispatch);

    // Act
    await calendar.goPrevMonth(current);

    // Assert
    const error = store
      .getActions()
      .find((action) => action.type === CATCH_API_ERROR);
    expect(error).toStrictEqual({
      type: CATCH_API_ERROR,
      payload: {
        errorCode: undefined,
        isContinuable: false,
        isFunctionCantUseError: false,
        message: 'APIエラー - Server not responded',
        problem: 'Server not responded',
        stackTrace: 'aaaa',
        type: 'APIエラー',
      },
    });
  });
});

describe.skip('goToday()', () => {
  // @TODO
  // Write tests by removing dependency to Date

  it.skip("should dispatch actions to today's calendar", async () => {});
  it.skip('throws API error, then it should catch error', async () => {});
});

describe('goTargetDate', () => {
  it("should dispatch actions to go target data's calendar", async () => {
    // Arrange
    ApiMock.mockReturnValue({
      '/planner/event/get': plannerEventGet,
      '/time-track/alert/list': alerts,
    });

    const current = '2019-12-12';
    const store = mockStore(initialState);
    // @ts-ignore
    const calendar = Calendar({ useWorkTime: true }, store.dispatch);

    // Act
    await calendar.goTargetDate(current, 10);

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
  it('throws API error, then it should catch error', async () => {
    // Arrange
    ApiMock.mockReturnValue({ '/planner/event/get': errorResponse });

    const current = '2020-04-12';
    const store = mockStore(initialState);
    // @ts-ignore
    const calendar = Calendar({ useWorkTime: true }, store.dispatch);

    // Act
    await calendar.goTargetDate(current, 1);

    // Assert
    const error = store
      .getActions()
      .find((action) => action.type === CATCH_API_ERROR);
    expect(error).toStrictEqual({
      type: CATCH_API_ERROR,
      payload: {
        errorCode: undefined,
        isContinuable: false,
        isFunctionCantUseError: false,
        message: 'APIエラー - Server not responded',
        problem: 'Server not responded',
        stackTrace: 'aaaa',
        type: 'APIエラー',
      },
    });
  });
});
