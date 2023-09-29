import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { actions } from '@apps/mobile-app/modules/attendance/attendanceRequest/warning';

import { AppDispatch } from '../../../AppThunk';
import askAttendanceRequestIgnoreWarning from '../askAttendanceRequestIgnoreWarning';

jest.mock('uuid/v4', () => ({
  __esModule: true,
  default: (): string => 'TEST UUID V4',
}));
jest.mock('@mobile/modules/attendance/attendanceRequest/warning', () => {
  const { actions } = jest.requireActual(
    '@mobile/modules/attendance/attendanceRequest/warning'
  );
  return {
    __esModule: true,
    actions: {
      ...actions,
      setMessages: jest.fn(),
    },
  };
});

const mockStore = configureMockStore([thunk]);

describe('default()', () => {
  it('should return yes.', async () => {
    // Arrange
    const store = mockStore({});
    const dispatch = store.dispatch as AppDispatch;
    (actions.setMessages as jest.Mock).mockImplementation((_, callback) => {
      callback(true);
    });

    // Act
    const answer = await dispatch(
      askAttendanceRequestIgnoreWarning(['message1', 'message2', 'message3'])
    );

    // Assert
    expect(store.getActions()).toMatchSnapshot();
    expect(answer).toBe(true);
  });

  it('should return no.', async () => {
    // Arrange
    const store = mockStore({});
    const dispatch = store.dispatch as AppDispatch;
    (actions.setMessages as jest.Mock).mockImplementation((_, callback) => {
      callback(false);
    });

    // Act
    const answer = await dispatch(
      askAttendanceRequestIgnoreWarning(['message1', 'message2', 'message3'])
    );

    // Assert
    expect(store.getActions()).toMatchSnapshot();
    expect(answer).toBe(false);
  });
});
