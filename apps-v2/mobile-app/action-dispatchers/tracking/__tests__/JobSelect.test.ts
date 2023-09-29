import { AnyAction } from 'redux';
import configureMockStore from 'redux-mock-store';
import thunk, { ThunkDispatch } from 'redux-thunk';

import TimeTrackJobRepository from '../../../../repositories/time-tracking/TimeTrackJobRepository';

import { Job } from '@apps/domain/models/time-tracking/Job';

import { abort, clear, initialize, resume } from '../JobSelect';

jest.mock('../../../../repositories/time-tracking/TimeTrackJobRepository');

const initialState = {};
const middlewares = [thunk];
const mockStore = configureMockStore<
  any,
  ThunkDispatch<undefined, undefined, AnyAction>
>(middlewares);

beforeEach(() => {
  const mockFetchAll = jest.spyOn(TimeTrackJobRepository, 'fetchAll');
  mockFetchAll.mockClear();
  // @ts-ignore
  mockFetchAll.mockImplementation(function* () {
    yield {
      id: 'xa10101ss',
      code: 'DEV-0001',
      name: 'WSP/Coding',
      hasChildren: false,
    };
  });
});

describe('initialize()', () => {
  it('should fetch jobs via repository', async () => {
    // Arrange
    const store = mockStore(initialState);
    const targetDate = '2020-03-30';
    const jobId = null;
    const empId = null;

    // Act
    await store.dispatch(initialize(targetDate, jobId, empId));

    // Assert
    expect(TimeTrackJobRepository.fetchAll).toHaveBeenCalled();
  });
  it('should dispatch proper actions to initialize', async () => {
    // Arrange
    const store = mockStore(initialState);
    const targetDate = '2020-03-30';
    const jobId = null;
    const empId = null;

    // Act
    await store.dispatch(initialize(targetDate, jobId, empId));

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
  it('should handle thrown error', async () => {
    // Arrange
    const store = mockStore(initialState);
    const targetDate = '2020-03-30';
    const jobId = null;
    const empId = null;
    const mockFetchAll = jest.spyOn(TimeTrackJobRepository, 'fetchAll');
    mockFetchAll.mockImplementation(() => {
      const error = new Error('Unexpected Error');
      error.stack = '';
      throw error;
    });

    // Act
    await store.dispatch(initialize(targetDate, jobId, empId));

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('abort()', () => {
  it('should abort reading data from stream', async () => {
    // Arrange
    const store = mockStore(initialState);
    const parentJobId = 'DEV-A000';

    // Assert
    await store.dispatch(abort(parentJobId));

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('resume()', () => {
  it('should resume reading data from aborted stream', async () => {
    // Arrange
    const store = mockStore(initialState);
    const parentJobId = 'DEV-A000';

    async function* stream() {
      yield [
        { code: 'DEV-004', name: 'WSP/Coding', id: 'xa111010c' },
        { code: 'DEV-005', name: 'WSP/Estimate', id: 'xb111010d' },
        { code: 'DEV-006', name: 'WSP/Testing', id: 'xc121010e' },
      ] as Job[];
      yield [
        { code: 'DEV-007', name: 'WSP/Coding', id: 'xa111010f' },
        { code: 'DEV-008', name: 'WSP/Estimate', id: 'xb111010g' },
        { code: 'DEV-009', name: 'WSP/Testing', id: 'xc121010o' },
      ] as Job[];
      return [
        { code: 'DEV-010', name: 'WSP/Coding', id: 'xa111010x' },
        { code: 'DEV-011', name: 'WSP/Estimate', id: 'xb111010y' },
        { code: 'DEV-012', name: 'WSP/Testing', id: 'xc121010z' },
      ] as Job[];
    }

    // Assert
    await store.dispatch(resume(stream(), parentJobId));

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });

  it('should return true for completed stream', async () => {
    // Arrange
    const store = mockStore(initialState);
    const parentJobId = 'DEV-A000';

    async function* stream() {
      yield undefined;
    }
    const completed = stream();
    completed.return();

    // Assert
    // @ts-ignore
    const done = await store.dispatch(resume(completed, parentJobId));

    // Assert
    expect(done).toBe(true);
  });

  it('should return false for uncompleted stream', async () => {
    // Arrange
    const store = mockStore(initialState);
    const parentJobId = 'DEV-A000';

    async function* stream() {
      yield undefined;
    }
    const completed = stream();

    // Assert
    // @ts-ignore
    const done = await store.dispatch(resume(completed, parentJobId));

    // Assert
    expect(done).toBe(false);
  });
});

describe('clear()', () => {
  it('should clear state', async () => {
    // Arrange
    const store = mockStore(initialState);
    const parentJobId = 'DEV-A000';

    // Assert
    // @ts-ignore
    await store.dispatch(clear(parentJobId));

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});
