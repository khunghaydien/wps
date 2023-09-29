import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import AutoHoursAllocateDictRepository from '@apps/repositories/time-tracking/AutoHoursAllocateDictRepository';
import AutoHoursAllocateRepository from '@apps/repositories/time-tracking/AutoHoursAllocateRepository';
import JobPickListRepository from '@apps/repositories/time-tracking/JobPickListRepository';

import {
  AutoHoursAllocationResult,
  MATCHING_TYPE,
} from '@apps/domain/models/time-tracking/AutoHoursAllocationResult';

import * as helper from '../../__tests__/helper';
import AllocateResult from '../AllocateResult';

jest.mock('@apps/repositories/time-tracking/AutoHoursAllocateDictRepository');
jest.mock('@apps/repositories/time-tracking/AutoHoursAllocateRepository');
jest.mock('@apps/repositories/time-tracking/JobPickListRepository');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

beforeEach(() => {
  jest.clearAllMocks();
  helper.uniq.reset();
});

describe('fetch()', () => {
  it('should load AllocateResult and JobPickList', async () => {
    // Arrange
    const store = mockStore();
    const allocateResult = AllocateResult(store.dispatch);
    (AutoHoursAllocateRepository.fetchAll as jest.Mock).mockImplementation(
      () => {
        store.dispatch({ type: 'MOCK/AutoHoursAllocateRepository.fetchAll' });
        return Promise.resolve([
          [
            helper.autoHoursAllocationResult(),
            helper.autoHoursAllocationResult(),
          ],
          null,
        ]);
      }
    );
    (JobPickListRepository.getJobPickList as jest.Mock).mockImplementation(
      () => {
        store.dispatch({ type: 'MOCK/JobPickListRepository.getJobPickList' });
        return Promise.resolve([
          helper.jobPickListItem(),
          helper.jobPickListItem(),
          helper.jobPickListItem(),
        ]);
      }
    );

    // Act
    await allocateResult.fetch(undefined, '2022-02-02');

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });

  it('should load only AllocateResult, if empId was passed', async () => {
    // Arrange
    const store = mockStore();
    const allocateResult = AllocateResult(store.dispatch);
    (AutoHoursAllocateRepository.fetchAll as jest.Mock).mockImplementation(
      () => {
        store.dispatch({ type: 'MOCK/AutoHoursAllocateRepository.fetchAll' });
        return Promise.resolve([
          [
            helper.autoHoursAllocationResult(),
            helper.autoHoursAllocationResult(),
          ],
          null,
        ]);
      }
    );
    (JobPickListRepository.getJobPickList as jest.Mock).mockImplementation(
      () => {
        store.dispatch({ type: 'MOCK/JobPickListRepository.getJobPickList' });
        return Promise.resolve([
          helper.jobPickListItem(),
          helper.jobPickListItem(),
          helper.jobPickListItem(),
        ]);
      }
    );

    // Act
    await allocateResult.fetch('anyEmployeeId', '2022-02-02');

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
  it("should load AllocateResult and JobPickList, AllocateResult's alerts is not null", async () => {
    // Arrange
    const store = mockStore();
    const allocateResult = AllocateResult(store.dispatch);
    (AutoHoursAllocateRepository.fetchAll as jest.Mock).mockImplementation(
      () => {
        store.dispatch({ type: 'MOCK/AutoHoursAllocateRepository.fetchAll' });
        return Promise.resolve([
          [
            helper.autoHoursAllocationResult(),
            helper.autoHoursAllocationResult(),
          ],
          [
            {
              level: 'Warn',
              code: 'TIME_WARN_INVALID_JOB',
              params: { code: 'JOB-CODE-A', name: 'ジョブA' },
            },
          ],
        ]);
      }
    );
    (JobPickListRepository.getJobPickList as jest.Mock).mockImplementation(
      () => {
        store.dispatch({ type: 'MOCK/JobPickListRepository.getJobPickList' });
        return Promise.resolve([
          helper.jobPickListItem(),
          helper.jobPickListItem(),
          helper.jobPickListItem(),
        ]);
      }
    );

    // Act
    await allocateResult.fetch(undefined, '2022-02-02');

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});

const resultTmpl: AutoHoursAllocationResult = {
  eventId: 'eventId',
  import: true,
  allocateResult: MATCHING_TYPE.MATCHED,
  eventTitle: 'eventTitle',
  startTime: '09:00',
  endTime: '10:00',
  job: { id: 'id', code: 'code', name: 'name', hasJobType: true },
  workCategory: { id: 'id', code: 'code', name: 'name' },
  taskTime: 60,
  dictItemId: 'dictItemId',
  isModified: true,
  differFromDictionary: true,
};

describe('apply()', () => {
  it('should call onApply with filtered resultList (and call onClose)', async () => {
    // Arrange
    const store = mockStore();
    const allocateResult = AllocateResult(store.dispatch);
    const onApply = jest.fn();
    const onClose = jest.fn();
    const results: AutoHoursAllocationResult[] = [
      { ...resultTmpl, eventId: '001' },
      { ...resultTmpl, eventId: '002', import: false },
      { ...resultTmpl, eventId: '003' },
    ];
    (
      AutoHoursAllocateDictRepository.fetchSurplusTime as jest.Mock
    ).mockImplementation(() => {
      store.dispatch({
        type: 'MOCK/AutoHoursAllocateDictRepository.fetchSurplusTime',
      });
      return Promise.resolve({ jobId: 'dummyId' });
    });

    // Act
    await allocateResult.apply({
      empId: '',
      targetDate: '2022-3-15',
      results,
      onApply,
      onClose,
    });

    // Assert
    expect(onApply.mock.calls.length).toBe(1);
    expect(onApply.mock.calls[0][0].map((result) => result.eventId)).toEqual([
      '001',
      // '002', <- 除外
      '003',
    ]);
    expect(onClose.mock.calls.length).toBe(1);
  });

  describe('should not call onApply when resultList has invalid item', () => {
    test('{ import true, job: undefined }', async () => {
      // Arrange
      const store = mockStore();
      const allocateResult = AllocateResult(store.dispatch);
      const onApply = jest.fn();
      const onClose = jest.fn();
      const results: AutoHoursAllocationResult[] = [
        { ...resultTmpl, eventId: '001' },
        {
          ...resultTmpl,
          eventId: '002',
          import: true,
          job: undefined,
        },
        { ...resultTmpl, eventId: '003' },
      ];

      // Act
      await allocateResult.apply({
        empId: '',
        targetDate: '2022-3-15',
        results,
        onApply,
        onClose,
      });

      // Assert
      expect(store.getActions()).toMatchSnapshot();
      expect(onApply.mock.calls.length).toBe(0);
      expect(onClose.mock.calls.length).toBe(0);
    });

    test('No Data and No SurplusTimeSetting', async () => {
      // Arrange
      const store = mockStore();
      const allocateResult = AllocateResult(store.dispatch);
      const onApply = jest.fn();
      const onClose = jest.fn();
      const results: AutoHoursAllocationResult[] = [];
      (
        AutoHoursAllocateDictRepository.fetchSurplusTime as jest.Mock
      ).mockImplementation(() => {
        store.dispatch({
          type: 'MOCK/AutoHoursAllocateDictRepository.fetchSurplusTime',
        });
        return Promise.resolve({ jobId: null });
      });

      // Act
      await allocateResult.apply({
        empId: '',
        targetDate: '2022-3-15',
        results,
        onApply,
        onClose,
      });

      // Assert
      expect(store.getActions()).toMatchSnapshot();
      expect(onApply.mock.calls.length).toBe(0);
      expect(onClose.mock.calls.length).toBe(0);
    });
  });
});
