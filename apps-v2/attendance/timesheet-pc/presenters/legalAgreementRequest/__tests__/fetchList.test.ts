import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import cloneDeep from 'lodash/cloneDeep';

import presenter from '../fetchList';
import { IOutputData } from '@attendance/domain/useCases/legalAgreementRequest/IFetchListUseCase';

const mockStore = configureMockStore([thunk]);

beforeEach(() => {
  jest.clearAllMocks();
});

const dummyState = {
  ui: {
    legalAgreementRequest: {
      page: {
        opened: false,
      },
    },
  },
};

describe('complete()', () => {
  it('should do.', () => {
    // Arrange
    const store = mockStore(dummyState);

    // Act
    presenter(store)().complete({
      targetDate: '2022-02-22',
      requestList: 'requestList',
    } as unknown as IOutputData);

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('error()', () => {
  it('should do.', () => {
    // Arrange
    const store = mockStore(dummyState);

    // Act
    presenter(store)().error({
      message: 'Error Test',
    });

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('start()', () => {
  it('should do.', () => {
    // Arrange
    const store = mockStore(dummyState);

    // Act
    presenter(store)().start();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('finally()', () => {
  it('should do.', () => {
    // Arrange
    const store = mockStore(dummyState);

    // Act
    presenter(store)().finally();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('loading', () => {
  it('should use globalLoading', () => {
    // Arrange
    const state = cloneDeep(dummyState);
    state.ui.legalAgreementRequest.page.opened = true;
    const store = mockStore(state);
    const $presenter = presenter(store)();

    // Act
    $presenter.start();
    $presenter.finally();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
  it('should use only pageLoading', () => {
    // Arrange
    const state = cloneDeep(dummyState);
    state.ui.legalAgreementRequest.page.opened = false;
    const store = mockStore(state);
    const $presenter = presenter(store)();

    // Act
    $presenter.start();
    $presenter.finally();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});
