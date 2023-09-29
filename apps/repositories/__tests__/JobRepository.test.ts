import ApiMock from '../../../__tests__/mocks/ApiMock';
import JobRepository from '../JobRepository';

type JobFromRemote = {
  id: string;
  code: string;
  name: string;
  parentId: string | null;
  isEditLockedOfTimeTracking: boolean;
};

const childJobs: JobFromRemote[] = [
  {
    id: '11',
    code: '101',
    name: 'JOB1',
    parentId: '1',
    isEditLockedOfTimeTracking: true,
  },
  {
    id: '12',
    code: '102',
    name: 'JOB2',
    parentId: '1',
    isEditLockedOfTimeTracking: false,
  },
  {
    id: '13',
    code: '103',
    name: 'JOB3',
    parentId: '1',
    isEditLockedOfTimeTracking: false,
  },
];

const parentJob: JobFromRemote = {
  id: '1',
  code: '001',
  name: 'JOB',
  parentId: null,
  isEditLockedOfTimeTracking: false,
};

const convertFromRemote = (jobFromRemote: JobFromRemote) => ({
  ...jobFromRemote,
  isEditLocked: jobFromRemote.isEditLockedOfTimeTracking,
});

beforeEach(() => {
  ApiMock.reset();
  ApiMock.invoke.mockReset();
});

describe('fetchAll()', () => {
  it('should not fetch child jobs before evaluation over network', async () => {
    // Arrange
    ApiMock.invoke
      .mockResolvedValueOnce({ records: childJobs })
      .mockResolvedValueOnce({ records: [] });

    // Act
    const _result = await JobRepository.fetchAll({
      companyId: 'abc0000fxxx',
      targetDate: '2019-12-31',
      parentId: parentJob.id,
    });

    // Assert
    expect(ApiMock.invoke).not.toHaveBeenCalled();
  });

  it('should fetch all child jobs over network', async () => {
    // Arrange
    ApiMock.invoke
      .mockResolvedValueOnce({ records: childJobs, tailCode: '1' })
      .mockResolvedValueOnce({ records: childJobs, tailCode: '2' })
      .mockResolvedValueOnce({ records: childJobs, tailCode: '3' })
      .mockResolvedValueOnce({ records: [], tailCode: null });

    // Act
    const result = await JobRepository.fetchAll({
      companyId: 'abc0000fxxx',
      targetDate: '2019-12-31',
      parentId: parentJob.id,
    });

    // eval generator
    const _actual = [];
    for await (const _ of result) {
      _actual.push(_);
    }

    // Assert
    const expected = [
      [
        {
          param: {
            companyId: 'abc0000fxxx',
            empId: undefined,
            onlyHighestLevel: false,
            parentId: '1',
            query: '',
            tailCode: undefined,
            recordCount: 30,
            targetDate: '2019-12-31',
          },
          path: '/job/search',
        },
      ],
      [
        {
          param: {
            companyId: 'abc0000fxxx',
            empId: undefined,
            onlyHighestLevel: false,
            parentId: '1',
            query: '',
            tailCode: '1',
            recordCount: 3000,
            targetDate: '2019-12-31',
          },
          path: '/job/search',
        },
      ],
      [
        {
          param: {
            companyId: 'abc0000fxxx',
            empId: undefined,
            onlyHighestLevel: false,
            parentId: '1',
            query: '',
            tailCode: '2',
            recordCount: 3000,
            targetDate: '2019-12-31',
          },
          path: '/job/search',
        },
      ],
      [
        {
          param: {
            companyId: 'abc0000fxxx',
            empId: undefined,
            onlyHighestLevel: false,
            parentId: '1',
            query: '',
            tailCode: '3',
            recordCount: 3000,
            targetDate: '2019-12-31',
          },
          path: '/job/search',
        },
      ],
    ];
    expect(ApiMock.invoke.mock.calls).toEqual(expected);
  });

  it('should fetch only needed child jobs over network', async () => {
    // Arrange
    ApiMock.invoke
      .mockResolvedValueOnce({ records: childJobs, tailCode: '1' })
      .mockResolvedValueOnce({ records: childJobs, tailCode: '2' })
      .mockResolvedValueOnce({ records: childJobs, tailCode: '3' })
      .mockResolvedValueOnce({ records: [], tailCode: null });

    // Act
    const result = await JobRepository.fetchAll({
      companyId: 'abc0000fxxx',
      targetDate: '2019-12-31',
      parentId: parentJob.id,
    });

    // eval generator
    const _actual = [];
    for await (const _ of result) {
      _actual.push(_);
      if (_actual.length > 5) {
        break;
        // Third API call should not be invoked because elements after 6th are not evaluated
      }
    }

    // Assert
    const expected = [
      [
        {
          param: {
            companyId: 'abc0000fxxx',
            empId: undefined,
            onlyHighestLevel: false,
            parentId: '1',
            query: '',
            tailCode: undefined,
            recordCount: 30,
            targetDate: '2019-12-31',
          },
          path: '/job/search',
        },
      ],
      [
        {
          param: {
            companyId: 'abc0000fxxx',
            empId: undefined,
            onlyHighestLevel: false,
            parentId: '1',
            query: '',
            tailCode: '1',
            recordCount: 3000,
            targetDate: '2019-12-31',
          },
          path: '/job/search',
        },
      ],
    ];
    expect(ApiMock.invoke.mock.calls).toEqual(expected);
  });

  it('should fetch only highest level jobs over network', async () => {
    // Arrange
    ApiMock.invoke.mockResolvedValueOnce({ records: [], tailCode: null });

    // Act
    // @ts-ignore
    const result = await JobRepository.fetchAll({
      companyId: 'abc0000fxxx',
      targetDate: '2019-12-31',
    });

    // eval generator
    const _actual = [];
    for await (const _ of result) {
      _actual.push(_);
    }

    // Assert
    const expected = [
      [
        {
          param: {
            companyId: 'abc0000fxxx',
            empId: undefined,
            onlyHighestLevel: true,
            parentId: undefined,
            query: '',
            tailCode: undefined,
            recordCount: 30,
            targetDate: '2019-12-31',
          },
          path: '/job/search',
        },
      ],
    ];
    expect(ApiMock.invoke.mock.calls).toEqual(expected);
  });

  it('should return all child jobs which has a given parent', async () => {
    // Arrange
    ApiMock.invoke
      .mockResolvedValueOnce({ records: childJobs })
      .mockResolvedValueOnce({ records: [] });

    // Act
    const result = await JobRepository.fetchAll({
      companyId: 'abc0000fxxx',
      targetDate: '2019-12-31',
      parentId: parentJob.id,
    });

    // eval generator
    const actual = [];
    for await (const _ of result) {
      actual.push(_);
    }

    // Assert
    expect(actual).toStrictEqual(childJobs.map(convertFromRemote));
  });

  it('should return an only evaluated job', async () => {
    // Arrange
    ApiMock.invoke
      .mockResolvedValueOnce({ records: childJobs })
      .mockResolvedValueOnce({ records: [] });

    // Act
    const result = await JobRepository.fetchAll({
      companyId: 'abc0000fxxx',
      targetDate: '2019-12-31',
      parentId: parentJob.id,
    });

    // eval generator
    const actual = [];
    // eslint-disable-next-line no-unreachable-loop
    for await (const _ of result) {
      actual.push(_);
      break; // evaluated only one
    }

    // Assert
    expect(actual).toStrictEqual([convertFromRemote(childJobs[0])]);
  });
});
