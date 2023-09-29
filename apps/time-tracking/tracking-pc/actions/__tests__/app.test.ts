import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { CATCH_UNEXPECTED_ERROR } from '../../../../commons/actions/app';

import { AppDispatch } from '../../modules/AppThunk';

import ApiMock, { ErrorResponse } from '../../../../../__tests__/mocks/ApiMock';
import { init } from '../app';

const initialState = {
  common: {
    empInfo: {
      startDayOfTheWeek: 0,
    },
  },
};
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
afterEach(() => {
  ApiMock.reset();
});
describe('init()', () => {
  it('should block the entire page on catch unexpected error', async () => {
    // Arrange
    ApiMock.mockReturnValue({
      '/time-track/monthly/get': new ErrorResponse(
        new Error('該当の社員は有効期間外です。')
      ),
      '/user-setting/get': {
        useWorkTime: null,
        userName: '***',
        useReceiptScan: null,
        usePsa: null,
        usePlanner: null,
        useMasterCardImport: null,
        useExpenseRequest: null,
        useExpense: null,
        useAttendance: null,
        requireLocationAtMobileStamp: null,
        photoUrl: '****',
        name: '** **',
        managerName: null,
        language: 'ja',
        id: '0052v00000WEgZvAAL',
        expRoundingSetting: null,
        expAttendanceValidation: null,
        employeeName: null,
        employeeId: null,
        employeeCode: null,
        departmentName: null,
        departmentId: null,
        departmentCode: null,
        currencySymbol: null,
        currencyName: null,
        currencyId: null,
        currencyDecimalPlaces: null,
        currencyCode: null,
        costCenterName: null,
        costCenterHistoryId: null,
        costCenterCode: null,
        companyName: null,
        companyId: null,
        approver01Name: null,
        allowToChangeApproverSelf: null,
        allowTaxAmountChange: null,
      },
    });
    const store = mockStore(initialState);
    // Act
    await (store.dispatch as AppDispatch)(init());
    // Assert
    const {
      type,
      payload: { errorCode, message, name },
    } = store.getActions()[2];
    const unexpectedErrorAction = {
      type,
      payload: {
        errorCode,
        message,
        name,
      },
    };
    expect(unexpectedErrorAction).toEqual({
      type: CATCH_UNEXPECTED_ERROR,
      payload: {
        errorCode: undefined,
        message: '該当の社員は有効期間外です。',
        name: 'Error',
      },
    });
  });
});
