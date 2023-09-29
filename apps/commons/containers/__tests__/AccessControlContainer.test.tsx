import * as React from 'react';
import { Provider } from 'react-redux';
import { cleanup, render } from 'react-testing-library';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { Permission } from '../../../domain/models/access-control/Permission';

import AccessControl from '../AccessControlContainer';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

class Stub extends React.Component<Record<string, unknown>> {
  render() {
    return <div data-testid="stub" />;
  }
}

describe('AccessControlContainer', () => {
  describe('権限 を持っている場合', () => {
    let store;
    beforeEach(() => {
      const userPermission: Permission = {
        approveAttDailyRequestByDelegate: false,
        approveAttRequestByDelegate: false,
        approveSelfAttDailyRequestByEmployee: false,
        approveSelfAttRequestByEmployee: false,
        canBulkApproveAttDailyRequest: false,
        canBulkApproveAttRequest: false,
        cancelAttApprovalByDelegate: false,
        cancelAttApprovalByEmployee: false,
        cancelTimeApprovalByDelegate: false,
        cancelTimeApprovalByEmployee: false,
        cancelTimeRequestByDelegate: false,
        editTimeTrackByDelegate: false,
        manageAccountingPeriod: false,
        manageAttPattern: false,
        manageAttPatternApply: false,
        manageAttShortTimeWorkSettingApply: false,
        manageCostCenter: false,
        manageEmployeeGroup: false,
        manageExchangeRate: false,
        manageExpCreditCard: false,
        manageExpCustomHint: false,
        manageExpSetting: false,
        manageExpTypeGroup: false,
        manageExpenseType: false,
        manageExtendedItem: false,
        manageMobileSetting: false,
        managePlannerSetting: false,
        managePsaExtendedItem: false,
        managePsaGroup: false,
        managePsaJobGrade: false,
        managePsaSetting: false,
        managePsaSkillset: false,
        manageReportType: false,
        manageTaxType: false,
        manageVendor: false,
        submitTimeRequestByDelegate: false,
        viewTimeTrackByDelegate: false,
        viewAttTimeSheetByDelegate: false,
        editAttTimeSheetByDelegate: false,
        submitAttDailyRequestByDelegate: false,
        cancelAttDailyRequestByDelegate: false,
        cancelAttDailyApprovalByEmployee: false,
        cancelAttDailyApprovalByDelegate: false,
        submitAttRequestByDelegate: false,
        cancelAttRequestByDelegate: false,
        manageOverallSetting: true,
        switchCompany: false,
        manageDepartment: false,
        manageEmployee: false,
        manageCalendar: true,
        manageJobType: false,
        manageJob: false,
        managePermission: false,
        manageAttLeave: false,
        manageAttShortTimeWorkSetting: false,
        manageAttLeaveOfAbsence: false,
        manageAttWorkingType: false,
        manageAttAgreementAlertSetting: false,
        manageAttLeaveGrant: true,
        manageAttShortTimeSettingApply: false,
        manageAttLeaveOfAbsenceApply: false,
        manageTimeSetting: false,
        manageTimeWorkCategory: false,
        manageTimeRecordItemImport: false,
        managePosition: false,
        manageOrgHPattern: false,
      };
      window.empInfo = { permission: userPermission } as EmpInfo;
      store = mockStore({
        common: {
          proxyEmployeeInfo: { isProxyMode: true },
          accessControl: { permission: { ...userPermission } },
        },
      });
    });

    afterEach(cleanup);

    test('`children` がレンダリングされる', () => {
      const { getByTestId } = render(
        <Provider store={store}>
          <AccessControl
            requireIfByDelegate={[
              'manageOverallSetting',
              'manageCalendar',
              'manageAttLeaveGrant',
            ]}
          >
            <Stub />
          </AccessControl>
        </Provider>
      );

      expect(getByTestId('stub')).not.toBeUndefined();
      expect(getByTestId('stub')).not.toBeNull();
    });
  });

  describe('権限 を持ってない場合', () => {
    let store;
    beforeEach(() => {
      const userPermission: Permission = {
        approveAttDailyRequestByDelegate: false,
        approveAttRequestByDelegate: false,
        approveSelfAttDailyRequestByEmployee: false,
        approveSelfAttRequestByEmployee: false,
        canBulkApproveAttDailyRequest: false,
        canBulkApproveAttRequest: false,
        cancelAttApprovalByDelegate: false,
        cancelAttApprovalByEmployee: false,
        cancelTimeApprovalByDelegate: false,
        cancelTimeApprovalByEmployee: false,
        cancelTimeRequestByDelegate: false,
        editTimeTrackByDelegate: false,
        manageAccountingPeriod: false,
        manageAttPattern: false,
        manageAttPatternApply: false,
        manageAttShortTimeWorkSettingApply: false,
        manageCostCenter: false,
        manageEmployeeGroup: false,
        manageExchangeRate: false,
        manageExpCreditCard: false,
        manageExpCustomHint: false,
        manageExpSetting: false,
        manageExpTypeGroup: false,
        manageExpenseType: false,
        manageExtendedItem: false,
        manageMobileSetting: false,
        managePlannerSetting: false,
        managePsaExtendedItem: false,
        managePsaGroup: false,
        managePsaJobGrade: false,
        managePsaSetting: false,
        managePsaSkillset: false,
        manageReportType: false,
        manageTaxType: false,
        manageVendor: false,
        submitTimeRequestByDelegate: false,
        viewTimeTrackByDelegate: false,
        viewAttTimeSheetByDelegate: false,
        editAttTimeSheetByDelegate: false,
        submitAttDailyRequestByDelegate: false,
        cancelAttDailyRequestByDelegate: false,
        cancelAttDailyApprovalByEmployee: false,
        cancelAttDailyApprovalByDelegate: false,
        submitAttRequestByDelegate: false,
        cancelAttRequestByDelegate: false,
        manageOverallSetting: false,
        switchCompany: false,
        manageDepartment: false,
        manageEmployee: false,
        manageCalendar: false,
        manageJobType: false,
        manageJob: false,
        managePermission: false,
        manageAttLeave: false,
        manageAttShortTimeWorkSetting: false,
        manageAttLeaveOfAbsence: false,
        manageAttWorkingType: false,
        manageAttAgreementAlertSetting: false,
        manageAttLeaveGrant: false,
        manageAttShortTimeSettingApply: false,
        manageAttLeaveOfAbsenceApply: false,
        manageTimeSetting: false,
        manageTimeWorkCategory: false,
        manageTimeRecordItemImport: false,
        managePosition: false,
        manageOrgHPattern: false,
      };
      window.empInfo = { permission: userPermission } as EmpInfo;
      store = mockStore({
        common: {
          proxyEmployeeInfo: { isProxyMode: true },
          accessControl: { permission: { ...userPermission } },
        },
      });
    });

    afterEach(cleanup);

    test('`children` がレンダリングされ無い', () => {
      const { queryByTestId } = render(
        <Provider store={store}>
          <AccessControl
            requireIfByDelegate={[
              'manageOverallSetting',
              'manageCalendar',
              'manageAttLeaveGrant',
            ]}
          >
            <Stub />
          </AccessControl>
        </Provider>
      );

      expect(queryByTestId('stub')).toBeNull();
    });
  });
});
