import ApiMock from '../../../../__tests__/mocks/ApiMock';
import WorkCategoryRepository from '../WorkCategoryRepository';

const workCategories = [
  {
    id: '11',
    code: '101',
    name: 'WC1',
  },
  {
    id: '12',
    code: '102',
    name: 'WC2',
  },
  {
    id: '13',
    code: '103',
    name: 'WC3',
  },
];

beforeEach(() => {
  ApiMock.reset();
  ApiMock.invoke.mockClear();
});

describe('fetchList', () => {
  it('should send correct parameters', async () => {
    // Arrange
    const param = {
      targetDate: '2019-12-31',
      jobId: 'JOB',
    };
    ApiMock.invoke.mockResolvedValueOnce({ workCategoryList: workCategories });

    // Act
    const _result = await WorkCategoryRepository.fetchList(param);

    // Assert
    const expected = { param, path: '/time/work-category/get' };
    expect(ApiMock.invoke).toHaveBeenCalledWith(expected);
  });
  it('should return work categories', async () => {
    // Arrange
    const param = {
      targetDate: '2019-12-31',
      jobId: 'JOB',
    };
    ApiMock.invoke.mockResolvedValueOnce({ workCategoryList: workCategories });

    // Act
    const result = await WorkCategoryRepository.fetchList(param);

    // Assert
    expect(result).toEqual(workCategories);
  });
});
