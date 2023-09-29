import ApiMock, { ErrorResponse } from '../../../../__tests__/mocks/ApiMock';
import WorkCategoryList from '../WorkCategoryList';
import Store from './mocks/Store';
import { workCategories } from './mocks/workCategories.mock';

afterEach(() => {
  ApiMock.reset();
});

describe('load()', () => {
  it('should load work categories over network', async () => {
    // Arrange
    ApiMock.mockReturnValue({
      '/time/work-category/get': workCategories,
    });

    const store = Store.create();
    const workCategoryList = WorkCategoryList(store.dispatch);

    // Act
    await workCategoryList.load('2019-10-10', 'abc');

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
  it('should handle errors', async () => {
    // Arrange
    const error = {
      code: 'FATAL',
      message: 'Server not responded',
      stackTrace: 'stack trace',
    };
    ApiMock.mockReturnValue({
      '/time/work-category/get': new ErrorResponse(error),
    });

    const store = Store.create();
    const workCategoryList = WorkCategoryList(store.dispatch);

    // Act
    // Assert
    await expect(workCategoryList.load('2019-10-10', 'abc')).rejects.toEqual(
      error
    );
  });
});

describe('clear()', () => {
  it('should clear state', () => {
    // Arrange
    const store = Store.create();
    const workCategoryList = WorkCategoryList(store.dispatch);

    // Act
    workCategoryList.clear();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});
