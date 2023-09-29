import ApiMock from '../../../../__tests__/mocks/ApiMock';
import TimeTrackJobRepository, {
  FetchAllParam,
} from '../TimeTrackJobRepository';

const childJobs = [
  {
    id: '11',
    code: '101',
    name: 'JOB1',
    parentId: '1',
  },
  {
    id: '12',
    code: '102',
    name: 'JOB2',
    parentId: '1',
  },
  {
    id: '13',
    code: '103',
    name: 'JOB3',
    parentId: '1',
  },
];

const parentJob = {
  id: '1',
  code: '001',
  name: 'JOB',
  parentId: null,
};

beforeEach(() => {
  ApiMock.reset();
  ApiMock.invoke.mockReset();
});

describe.each([
  { targetDate: '2019-12-31', parent: parentJob } as FetchAllParam,
  { targetDate: '2019-12-31', parentJobId: parentJob.id },
])('fetchAll(%s)', (param: FetchAllParam) => {
  it('should not fetch child jobs before evaluation over network', async () => {
    // Arrange
    ApiMock.invoke
      .mockResolvedValueOnce({ jobList: childJobs })
      .mockResolvedValueOnce({ jobList: [] });

    // Act
    const _result = await TimeTrackJobRepository.fetchAll(param);

    // Assert
    expect(ApiMock.invoke).not.toHaveBeenCalled();
  });

  it('should fetch all child jobs over network', async () => {
    // Arrange
    ApiMock.invoke
      .mockResolvedValueOnce({ jobList: childJobs, tailCode: '1' })
      .mockResolvedValueOnce({ jobList: childJobs, tailCode: '2' })
      .mockResolvedValueOnce({ jobList: childJobs, tailCode: null });

    // Act
    const result = await TimeTrackJobRepository.fetchAll(param);

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
            codeOrName: '',
            empId: undefined,
            parentId: '1',
            pageSize: 30,
            tailCode: undefined,
            targetDate: '2019-12-31',
          },
          path: '/time/job/get',
        },
      ],
      [
        {
          param: {
            codeOrName: '',
            empId: undefined,
            parentId: '1',
            pageSize: 3000,
            tailCode: '1',
            targetDate: '2019-12-31',
          },
          path: '/time/job/get',
        },
      ],
      [
        {
          param: {
            codeOrName: '',
            empId: undefined,
            parentId: '1',
            pageSize: 3000,
            tailCode: '2',
            targetDate: '2019-12-31',
          },
          path: '/time/job/get',
        },
      ],
    ];
    expect(ApiMock.invoke.mock.calls).toEqual(expected);
  });

  it('should fetch only needed child jobs over network', async () => {
    // Arrange
    ApiMock.invoke
      .mockResolvedValueOnce({ jobList: childJobs, tailCode: '1' })
      .mockResolvedValueOnce({ jobList: childJobs, tailCode: '2' })
      .mockResolvedValueOnce({ jobList: childJobs, tailCode: '3' })
      .mockResolvedValueOnce({ jobList: childJobs, tailCode: null });

    // Act
    const result = await TimeTrackJobRepository.fetchAll(param);

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
            codeOrName: '',
            empId: undefined,
            parentId: '1',
            pageSize: 30,
            tailCode: undefined,
            targetDate: '2019-12-31',
          },
          path: '/time/job/get',
        },
      ],
      [
        {
          param: {
            codeOrName: '',
            empId: undefined,
            parentId: '1',
            pageSize: 3000,
            tailCode: '1',
            targetDate: '2019-12-31',
          },
          path: '/time/job/get',
        },
      ],
    ];
    expect(ApiMock.invoke.mock.calls).toEqual(expected);
  });

  it('should return all child jobs which has a given parent', async () => {
    // Arrange
    ApiMock.invoke
      .mockResolvedValueOnce({ jobList: childJobs })
      .mockResolvedValueOnce({ jobList: [] });

    // Act
    const result = await TimeTrackJobRepository.fetchAll(param);

    // eval generator
    const actual = [];
    for await (const _ of result) {
      actual.push(_);
    }

    // Assert
    expect(actual).toStrictEqual(childJobs);
  });

  it('should return an only evaluated job', async () => {
    // Arrange
    ApiMock.invoke
      .mockResolvedValueOnce({ jobList: childJobs })
      .mockResolvedValueOnce({ jobList: [] });

    // Act
    const result = await TimeTrackJobRepository.fetchAll(param);

    // eval generator
    const actual = [];
    // eslint-disable-next-line no-unreachable-loop
    for await (const _ of result) {
      actual.push(_);
      break; // evaluated only one
    }

    // Assert
    expect(actual).toStrictEqual([childJobs[0]]);
  });
});
