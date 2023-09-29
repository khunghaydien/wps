import Api from '../../../../__tests__/mocks/ApiMock';
import DispatcherMock from '../../../../__tests__/mocks/DispatcherMock';
import * as actions from '../AttDailyInsufficientRestTime';

describe('confirmToComplementInsufficientingRestTime()', () => {
  Api.setDummyResponse(
    '/att/daily-rest-time/fill',
    {
      targetDate: null,
      employeeId: null,
    },
    {}
  );

  test('should be nothing to do if insufficientRestTime is 0.', async () => {
    const mockDispatcher = new DispatcherMock();
    mockDispatcher.dispatch(
      actions.confirmToComplementInsufficientingRestTime({
        insufficientRestTime: 0,
      })
    );
    expect(mockDispatcher.logged).toHaveLength(1);
  });

  test('should be called API to update rest time on daily record if you click [OK] button.', async () => {
    expect.assertions(5);
    const mockDispatcher = new DispatcherMock();
    const promise = mockDispatcher.dispatch(
      actions.confirmToComplementInsufficientingRestTime({
        employeeId: null,
        targetDate: null,
        insufficientRestTime: 15,
      })
    );
    expect(typeof mockDispatcher.logged[0]).toBe('function');
    expect(typeof mockDispatcher.logged[1]).toBe('function');
    expect(mockDispatcher.logged[2].type).toBe('CONFIRM_DIALOG_OPEN');
    mockDispatcher.logged[2].payload.callback(true);
    expect(mockDispatcher.logged[3].type).toBe('CONFIRM_DIALOG_CLOSE');
    await promise.then((result) => {
      expect(result).toBe(true);
    });
  });

  test('should be nothing to do on daily record if you click [Cancel] button.', async () => {
    expect.assertions(5);
    const mockDispatcher = new DispatcherMock();
    const promise = mockDispatcher.dispatch(
      actions.confirmToComplementInsufficientingRestTime({
        employeeId: null,
        targetDate: null,
        insufficientRestTime: 15,
      })
    );
    expect(typeof mockDispatcher.logged[0]).toBe('function');
    expect(typeof mockDispatcher.logged[1]).toBe('function');
    expect(mockDispatcher.logged[2].type).toBe('CONFIRM_DIALOG_OPEN');
    mockDispatcher.logged[2].payload.callback(false);
    expect(mockDispatcher.logged[3].type).toBe('CONFIRM_DIALOG_CLOSE');
    await promise.then((result) => {
      expect(result).toBe(false);
    });
  });
});
