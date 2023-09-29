import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import AutoHoursAllocateDictRepository from '@apps/repositories/time-tracking/AutoHoursAllocateDictRepository';
import JobPickListRepository from '@apps/repositories/time-tracking/JobPickListRepository';

import * as helper from '../../__tests__/helper';
import AutoHoursAllocateDict from '../AutoHoursAllocateDict';

jest.mock('nanoid', () => {
  let i = 0;
  return jest
    .fn()
    .mockImplementation(() => `nanoid#${(++i).toString().padStart(3, '0')}`);
});

jest.mock('@apps/repositories/time-tracking/JobPickListRepository');
jest.mock('@apps/repositories/time-tracking/AutoHoursAllocateDictRepository');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

beforeEach(() => {
  jest.clearAllMocks();
  helper.uniq.reset();
  helper.priority.reset();
});

describe('fetch()', () => {
  const mockDictFetchResult = {
    basicSetting: helper.basicSetting(),
    dictList: [
      helper.autoHoursAllocationDictItem(),
      helper.autoHoursAllocationDictItem(),
      { ...helper.autoHoursAllocationDictItem(), job: null },
    ],
  };
  const mockGetJobPickListResult = [
    helper.jobPickListItem(),
    helper.jobPickListItem(),
    helper.jobPickListItem(),
  ];
  const mockResultItem = helper.autoHoursAllocationResult();

  test('with resultItem', async () => {
    // Arrange
    const store = mockStore();
    const autoHoursAllocateDict = AutoHoursAllocateDict(store.dispatch);

    (AutoHoursAllocateDictRepository.fetchAll as jest.Mock).mockImplementation(
      () => {
        store.dispatch({
          type: 'MOCK/AutoHoursAllocateDictRepository.fetchAll',
        });
        return Promise.resolve(mockDictFetchResult);
      }
    );
    (JobPickListRepository.getJobPickList as jest.Mock).mockImplementation(
      () => {
        store.dispatch({
          type: 'MOCK/JobPickListRepository.getJobPickList',
        });
        return Promise.resolve(mockGetJobPickListResult);
      }
    );

    // Act
    await autoHoursAllocateDict.fetch(undefined, '2022-02-02', mockResultItem);

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });

  test('with resultItem / with empId', async () => {
    // Arrange
    const store = mockStore();
    const autoHoursAllocateDict = AutoHoursAllocateDict(store.dispatch);

    (AutoHoursAllocateDictRepository.fetchAll as jest.Mock).mockImplementation(
      () => {
        store.dispatch({
          type: 'MOCK/AutoHoursAllocateDictRepository.fetchAll',
        });
        return Promise.resolve(mockDictFetchResult);
      }
    );
    (JobPickListRepository.getJobPickList as jest.Mock).mockImplementation(
      () => {
        store.dispatch({
          type: 'MOCK/JobPickListRepository.getJobPickList',
        });
        return Promise.resolve(mockGetJobPickListResult);
      }
    );

    // Act
    await autoHoursAllocateDict.fetch(
      'anyEmployeeId',
      '2022-02-02',
      mockResultItem
    );

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });

  test('without resultItem', async () => {
    // Arrange
    const store = mockStore();
    const autoHoursAllocateDict = AutoHoursAllocateDict(store.dispatch);

    (AutoHoursAllocateDictRepository.fetchAll as jest.Mock).mockImplementation(
      () => {
        store.dispatch({
          type: 'MOCK/AutoHoursAllocateDictRepository.fetchAll',
        });
        return Promise.resolve(mockDictFetchResult);
      }
    );
    (JobPickListRepository.getJobPickList as jest.Mock).mockImplementation(
      () => {
        store.dispatch({
          type: 'MOCK/JobPickListRepository.getJobPickList',
        });
        return Promise.resolve(mockGetJobPickListResult);
      }
    );

    // Act
    await autoHoursAllocateDict.fetch(undefined, '2022-02-02', undefined);

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('saveDict()', () => {
  test('success', async () => {
    // Arrange
    const store = mockStore();
    const autoHoursAllocateDict = AutoHoursAllocateDict(store.dispatch);
    const dictList = [
      helper.autoHoursAllocationDictItem(),
      helper.autoHoursAllocationDictItem(),
    ];
    const basicSetting = helper.basicSetting();

    (AutoHoursAllocateDictRepository.save as jest.Mock).mockImplementation(
      () => {
        store.dispatch({
          type: 'MOCK/AutoHoursAllocateDictRepository.save',
        });
        return Promise.resolve(true);
      }
    );

    // Act
    await autoHoursAllocateDict.saveDict(undefined, dictList, basicSetting);

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });

  test('error', async () => {
    // Arrange
    const store = mockStore();
    const autoHoursAllocateDict = AutoHoursAllocateDict(store.dispatch);
    const dictList = [
      { ...helper.autoHoursAllocationDictItem(), job: null },
      helper.autoHoursAllocationDictItem(),
    ];
    const basicSetting = helper.basicSetting();

    (AutoHoursAllocateDictRepository.save as jest.Mock).mockImplementation(
      () => {
        store.dispatch({
          type: 'MOCK/AutoHoursAllocateDictRepository.save',
        });
        return Promise.resolve(true);
      }
    );

    // Act
    await autoHoursAllocateDict.saveDict(undefined, dictList, basicSetting);

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});
