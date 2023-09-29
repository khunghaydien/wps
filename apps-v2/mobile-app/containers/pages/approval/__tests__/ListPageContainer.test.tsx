import * as React from 'react';
import { Provider } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { cloneDeep } from 'lodash';

import { act, render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { showAlert } from '@mobile/modules/commons/alert';
import { showConfirm } from '@mobile/modules/commons/confirm';

import RequestListRepository from '@apps/repositories/approval/RequestListRepository';
import RequestRepository from '@apps/repositories/approval/RequestRepository';

import { REQUEST_TYPE } from '@apps/domain/models/approval/request/Request';

import Component from '@mobile/components/pages/approval/ListPage';

import Container, {
  // @ts-ignore
  __get__,
  // @ts-ignore
  __set__,
  CHECKED_MAX,
} from '../ListPageContainer';

jest.mock('uuid/v4', () => () => 'uuid/v4/mock');
jest.mock('../../../../components/pages/approval/ListPage', () =>
  jest.fn(() => <div></div>)
);
jest.mock('../../../../modules/commons/confirm', () => ({
  __esModule: true,
  showConfirm: jest.fn(),
}));
jest.mock('../../../../modules/commons/alert', () => ({
  __esModule: true,
  showAlert: jest.fn(),
}));
jest.mock('../../../../../repositories/approval/RequestListRepository');
jest.mock('../../../../../repositories/approval/RequestRepository');

const router = {
  history: {
    push: jest.fn(),
  },
} as unknown as RouteComponentProps;

const MockComponent = Component as unknown as jest.Mock;

const dummyState = {
  approval: {
    entities: {
      list: {
        filterType: REQUEST_TYPE.ATTENDANCE_FIX,
        filteredList: [],
        targetList: [],
        checked: [],
      },
    },
    ui: {
      list: {
        comment: 'comment',
      },
    },
  },
  common: {
    accessControl: {
      permission: {
        canBulkApproveAttDailyRequest: true,
        canBulkApproveAttRequest: true,
      },
    },
  },
};

const mockStore = configureMockStore([thunk]);

const renderComponent = ({ back }: { back: boolean }, store) => {
  return render(
    <Provider store={store}>
      <Container {...router} back={back} />
    </Provider>
  );
};

beforeEach(() => {
  jest.clearAllMocks();
});
describe('props', () => {
  const mockUseCases = {
    load: jest.fn(),
    reload: jest.fn(),
    approve: jest.fn(),
  };

  const reverts = [];
  beforeAll(() => {
    reverts.push(__set__('useUseCases', () => mockUseCases));
    reverts.push(__set__('useFilterTypeOptions', () => []));
  });
  afterAll(() => {
    reverts.forEach((revert) => {
      revert();
    });
  });
  test('onClickRefresh.', () => {
    // Arrange
    const store = mockStore(dummyState);
    const _ = renderComponent({ back: false }, store);
    const props = MockComponent.mock.calls[0][0];
    store.clearActions();

    // Act
    props.onClickRefresh();

    // Assert
    expect(router.history.push).toBeCalledWith('/approval/list');
  });
  test('onChangeFilter.', () => {
    // Arrange
    const store = mockStore(dummyState);
    const _ = renderComponent({ back: false }, store);
    const props = MockComponent.mock.calls[0][0];
    store.clearActions();

    // Act
    props.onChangeFilter(REQUEST_TYPE.ATTENDANCE_FIX);

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
  test('onCheckAll.', () => {
    // Arrange
    const store = mockStore(dummyState);
    const _ = renderComponent({ back: false }, store);
    const props = MockComponent.mock.calls[0][0];
    store.clearActions();

    // Act
    props.onCheckAll();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
  describe('onCheck', () => {
    test('when has record.', () => {
      // Arrange
      const state = cloneDeep(dummyState);
      state.approval.entities.list.targetList = [
        {
          recordId: 'xxxx',
          requestType: REQUEST_TYPE.ATTENDANCE_DAILY,
        },
      ];
      const store = mockStore(state);
      const _ = renderComponent({ back: false }, store);
      const props = MockComponent.mock.calls[0][0];
      store.clearActions();

      // Act
      props.onCheck({
        id: 'xxxx',
        requestType: REQUEST_TYPE.ATTENDANCE_DAILY,
      });

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    });
    test("when hasn't record.", () => {
      // Arrange
      const state = cloneDeep(dummyState);
      state.approval.entities.list.targetList = [];
      const store = mockStore(state);
      const _ = renderComponent({ back: false }, store);
      const props = MockComponent.mock.calls[0][0];
      store.clearActions();

      // Act
      props.onCheck({
        requestId: 'xxxx',
        requestType: REQUEST_TYPE.ATTENDANCE_DAILY,
      });

      // Assert
      expect(store.getActions()).toMatchSnapshot();
      expect(router.history.push).toBeCalledWith(
        `/approval/list/select/${REQUEST_TYPE.ATTENDANCE_DAILY}/xxxx`
      );
    });
    test('when over max.', () => {
      // Arrange
      (showAlert as unknown as jest.Mock).mockReturnValueOnce({
        type: 'showAlert',
      });
      const state = cloneDeep(dummyState);
      state.approval.entities.list.targetList = [
        ...Array(CHECKED_MAX + 10).keys(),
      ].map((idx) => ({
        requestId: `${idx + 1}`,
        requestType: REQUEST_TYPE.ATTENDANCE_DAILY,
      }));
      state.approval.entities.list.checked = [...Array(CHECKED_MAX).keys()].map(
        (idx) => `${idx + 1}`
      );
      const store = mockStore(state);
      const _ = renderComponent({ back: false }, store);
      const props = MockComponent.mock.calls[0][0];
      store.clearActions();

      // Act
      props.onCheck({
        requestId: '101',
        requestType: REQUEST_TYPE.ATTENDANCE_DAILY,
      });

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    });
  });
  test('onChangeComment.', () => {
    // Arrange
    const store = mockStore(dummyState);
    const _ = renderComponent({ back: false }, store);
    const props = MockComponent.mock.calls[0][0];
    store.clearActions();

    // Act
    props.onChangeComment('new comment');

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
  describe('onClickApproveButton', () => {
    test('answer is true.', async () => {
      // Arrange
      const state = cloneDeep(dummyState);
      state.approval.entities.list.checked = ['1', '2', '3'];
      const store = mockStore(state);
      await act(async () => {
        renderComponent({ back: false }, store);
      });
      const props = MockComponent.mock.calls[0][0];
      mockUseCases.approve.mockResolvedValueOnce(true);
      store.clearActions();
      mockUseCases.load.mockClear();

      // Act
      await props.onClickApproveButton();

      // Assert
      expect(mockUseCases.approve).toBeCalledWith({
        ids: ['1', '2', '3'],
        comment: dummyState.approval.ui.list.comment,
      });
      expect(mockUseCases.load).toBeCalledTimes(1);
      expect(store.getActions()).toMatchSnapshot();
    });
    test('answer is false.', async () => {
      // Arrange
      const state = cloneDeep(dummyState);
      state.approval.entities.list.checked = ['1', '2', '3'];
      const store = mockStore(state);
      await act(async () => {
        renderComponent({ back: false }, store);
      });
      const props = MockComponent.mock.calls[0][0];
      mockUseCases.approve.mockResolvedValueOnce(false);
      store.clearActions();
      mockUseCases.load.mockClear();

      // Act
      await props.onClickApproveButton();

      // Assert
      expect(mockUseCases.approve).toBeCalledWith({
        ids: ['1', '2', '3'],
        comment: dummyState.approval.ui.list.comment,
      });
      expect(mockUseCases.load).toBeCalledTimes(0);
      expect(store.getActions()).toMatchSnapshot();
    });
  });
});

describe('useUseCases', () => {
  const store = mockStore(dummyState);
  const { result } = renderHook(() => __get__('useUseCases')(), {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });
  const useCases = result.current;
  beforeEach(() => {
    store.clearActions();
  });
  test('load', async () => {
    // Arrange
    (RequestListRepository.fetch as unknown as jest.Mock).mockResolvedValueOnce(
      'approval list'
    );

    // Act
    await useCases.load();

    // Arrange
    expect(store.getActions()).toMatchSnapshot();
  });
  describe('approve', () => {
    test('answer is yes', async () => {
      // Arrange
      (RequestRepository.approve as unknown as jest.Mock).mockResolvedValueOnce(
        'approval list'
      );
      (showConfirm as unknown as jest.Mock).mockReturnValue(async () => true);

      // Act
      const result = await useCases.approve({
        ids: ['1', '2', '3'],
        comment: 'comment',
      });

      // Arrange
      expect(result).toBe(true);
      expect(RequestRepository.approve).toBeCalledTimes(1);
      expect(RequestRepository.approve).toBeCalledWith({
        ids: ['1', '2', '3'],
        comment: 'comment',
      });
      expect(store.getActions()).toMatchSnapshot();
    });
    test('answer is no', async () => {
      // Arrange
      (RequestRepository.approve as unknown as jest.Mock).mockResolvedValueOnce(
        'approval list'
      );
      (showConfirm as unknown as jest.Mock).mockReturnValue(async () => false);

      // Act
      const result = await useCases.approve({
        ids: ['1', '2', '3'],
        comment: 'comment',
      });

      // Arrange
      expect(result).toBe(false);
      expect(RequestRepository.approve).toBeCalledTimes(0);
      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
