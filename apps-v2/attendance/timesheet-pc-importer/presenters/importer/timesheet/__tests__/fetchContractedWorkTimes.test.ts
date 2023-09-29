import configureMockStore from 'redux-mock-store';

import { catchBusinessError } from '@commons/actions/app';

import presenter from '../fetchContractedWorkTimes';
import { IOutputData } from '@attendance/domain/useCases/importer/timesheet/IFetchContractedWorkTimesUseCase';
import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';

const mockStore = configureMockStore([]);

jest.mock('@commons/actions/app', () => {
  const original = jest.requireActual('@commons/actions/app');
  return {
    ...original,
    __esModules: true,
    catchBusinessError: jest.fn(original.catchBusinessError),
    confirm: jest.fn(),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('complete()', () => {
  it('should success.', () => {
    // Arrange
    const store = mockStore({});

    // Act
    presenter(store as AppStore)({
      employeeId: 'employeeId',
      startDate: '1',
      endDate: '2',
    }).complete([
      {
        records: new Map([
          ['1', { recordDate: '1' }],
          ['2', { recordDate: '2' }],
        ]),
      },
    ] as unknown as IOutputData);

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });

  it('should show error.', () => {
    // Arrange
    const store = mockStore({});

    // Act
    presenter(store as AppStore)({
      employeeId: 'employeeId',
      startDate: '1',
      endDate: '2',
    }).complete([
      {
        records: new Map([
          ['1', { recordDate: '1' }],
          ['2', { recordDate: '1' }],
        ]),
      },
    ] as unknown as IOutputData);

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });

  it('should show error if result is null.', () => {
    // Arrange
    const store = mockStore({});

    // Act
    presenter(store as AppStore)({
      employeeId: 'employeeId',
      startDate: '1',
      endDate: '2',
    }).complete(null as unknown as IOutputData);

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });

  it.each`
    inputStartDate | inputEndDate | resultStartDate | resultEndDate | times
    ${'1'}         | ${'1'}       | ${null}         | ${null}       | ${1}
    ${'1'}         | ${'1'}       | ${'1'}          | ${null}       | ${1}
    ${'1'}         | ${'1'}       | ${null}         | ${'1'}        | ${1}
    ${'1'}         | ${'1'}       | ${'1'}          | ${'1'}        | ${0}
    ${'1'}         | ${'1'}       | ${'1'}          | ${'3'}        | ${0}
    ${'1'}         | ${'1'}       | ${'3'}          | ${'1'}        | ${1}
    ${'1'}         | ${'1'}       | ${'3'}          | ${'3'}        | ${1}
    ${'1'}         | ${'3'}       | ${'1'}          | ${'1'}        | ${1}
    ${'1'}         | ${'3'}       | ${'1'}          | ${'3'}        | ${0}
    ${'1'}         | ${'3'}       | ${'3'}          | ${'1'}        | ${1}
    ${'1'}         | ${'3'}       | ${'3'}          | ${'3'}        | ${1}
  `(
    'should be $times called alert.',
    ({
      inputStartDate,
      inputEndDate,
      resultStartDate,
      resultEndDate,
      times,
    }) => {
      // Arrange
      const store = mockStore({});

      // Act
      presenter(store as AppStore)({
        employeeId: 'employeeId',
        startDate: inputStartDate,
        endDate: inputEndDate,
      }).complete([
        {
          records: new Map([
            ['1', { recordDate: resultStartDate }],
            ['2', { recordDate: resultEndDate }],
          ]),
        },
      ] as unknown as IOutputData);

      // Assert
      expect(catchBusinessError).toBeCalledTimes(times);
    }
  );
});

describe('error()', () => {
  it('should do.', () => {
    // Arrange
    const store = mockStore({});

    // Act
    presenter(store as AppStore)({
      employeeId: 'employeeId',
      startDate: '1',
      endDate: '1',
    }).error({
      message: 'Error Test',
    });

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('start()', () => {
  it('should do.', () => {
    // Arrange
    const store = mockStore({});

    // Act
    presenter(store as AppStore)({
      employeeId: 'employeeId',
      startDate: '1',
      endDate: '1',
    }).start();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('finally()', () => {
  it('should do.', () => {
    // Arrange
    const store = mockStore({});

    // Act
    presenter(store as AppStore)({
      employeeId: 'employeeId',
      startDate: '1',
      endDate: '1',
    }).finally();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});
