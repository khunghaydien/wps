import React from 'react';

import { FunctionTypeList } from '../../constants/functionType';

import { Action, Record } from '../../utils/RecordUtil';

import AccountingPeriodContainer from '../../containers/AccountingPeriodContainer';
import AgreementAlertSettingContainer from '../../containers/AgreementAlertSettingContainer';
import AnnualPaidLeaveManagementContainer from '../../containers/AnnualPaidLeaveManagementContainer';
import AttPatternContainer from '../../containers/AttPatternContainer';
import AttPatternEmployeeBatchContainer from '../../containers/AttPatternEmployeeBatchContainer';
import CalendarContainer from '../../containers/CalendarContainer';
import CategoryContainer from '../../containers/CategoryContainer';
import CompanyContainer from '../../containers/CompanyContainer';
import CostCenterContainer from '../../containers/CostCenterContainer';
import CountryContainer from '../../containers/CountryContainer';
import CountryDefaultTaxTypeContainer from '../../containers/CountryDefaultTaxTypeContainer';
import CreditCardContainer from '../../containers/CreditCardContainer';
import CurrencyContainer from '../../containers/CurrencyContainer';
import CustomHintContainer from '../../containers/CustomHintContainer';
import DepartmentContainer from '../../containers/DepartmentContainer';
import EmployeeContainer from '../../containers/EmployeeContainer';
import ExchangeRateContainer from '../../containers/ExchangeRateContainer';
import ExpenseTypeContainer from '../../containers/ExpenseTypeContainer';
import ExpSettingContainer from '../../containers/ExpSettingContainer';
import ExpTypeGroupContainer from '../../containers/ExpTypeGroupContainer';
import ExtendedItemContainer from '../../containers/ExtendedItemContainer';
import ExtendedItemContainerPSA from '../../containers/ExtendedItemContainerPSA';
import GroupContainer from '../../containers/GroupContainer';
import JobContainer from '../../containers/JobContainer';
import JobGradeContainer from '../../containers/JobGradeContainer';
import JobTypeContainer from '../../containers/JobTypeContainer';
import LeaveContainer from '../../containers/LeaveContainer';
import LeaveOfAbsenceContainer from '../../containers/LeaveOfAbsenceContainer';
import LeaveOfAbsencePeriodStatusContainer from '../../containers/LeaveOfAbsencePeriodStatusContainer';
import ManagedLeaveManagementContainer from '../../containers/ManagedLeaveManagementContainer';
import ManagerListContainer from '../../containers/ManagerListContainer';
import MobileSettingContainer from '../../containers/MobileSettingContainer';
import OrganizationContainer from '../../containers/OrganizationContainer';
import PermissionContainer from '../../containers/PermissionContainer';
import PlannerSettingContainer from '../../containers/PlannerSettingContainer';
import ProjectManagerGroupContainer from '../../containers/ProjectManagerGroupContainer';
import PSAGroupContainer from '../../containers/PSAGroupContainer';
import PsaSettingContainer from '../../containers/PsaSettingContainer';
import ReportTypeContainer from '../../containers/ReportTypeContainer';
import ResourceGroupContainer from '../../containers/ResourceGroupContainer';
import ShortTimeWorkPeriodStatusContainer from '../../containers/ShortTimeWorkPeriodStatusContainer';
import ShortTimeWorkReasonContainer from '../../containers/ShortTimeWorkReasonContainer';
import ShortTimeWorkSettingContainer from '../../containers/ShortTimeWorkSettingContainer';
import Skillset from '../../containers/SkillsetContainer';
import TalentProfileContainer from '../../containers/TalentProfileContainer';
import TaxTypeContainer from '../../containers/TaxTypeContainer';
import TimeRecordItemImportContainer from '../../containers/TimeRecordItemImportContainer';
import TimeSettingContainer from '../../containers/TimeSettingContainer';
import UseFunctionContainer from '../../containers/UseFunctionContainer';
import VendorContainer from '../../containers/VendorContainer';
import WorkCategoryContainer from '../../containers/WorkCategoryContainer';
import WorkingTypeContainer from '../../containers/WorkingTypeContainer';

/**
 * メニューで選択された管理項目のコンテナーを返す
 * */
export type Props = {
  title: string;
  useFunction: FunctionTypeList;
  selectedKey: string;
  companyId: string;
  getOrganizationSetting: {
    [key: string]: string | null | undefined;
  };
  commonActions: Action;
  tmpEditRecord: Record;
  sfObjFieldValues: any;
};

export const getContentsContainer = (props: Props) => {
  switch (props.selectedKey) {
    // 組織設定
    case 'Organization':
      return <OrganizationContainer {...props} />;
    case 'Country':
      return <CountryContainer {...props} />;
    case 'Company':
      return <CompanyContainer {...props} />;
    case 'CountryDefaultTaxType':
      return <CountryDefaultTaxTypeContainer {...props} />;

    // 会社別設定
    case 'Use':
      return <UseFunctionContainer {...props} />;
    case 'CostCenter':
      return <CostCenterContainer {...props} />;
    case 'Department':
      return <DepartmentContainer {...props} />;
    case 'Emp':
      return <EmployeeContainer {...props} />;
    case 'ExpTypeGroup':
      return <ExpTypeGroupContainer {...props} />;
    case 'Calendar':
      return <CalendarContainer {...props} />;
    case 'JobType':
      return <JobTypeContainer {...props} />;
    case 'Job':
      return <JobContainer {...props} />;
    case 'Permission':
      return <PermissionContainer {...props} />;
    case 'MobileSetting':
      return <MobileSettingContainer {...props} />;
    case 'PlannerSetting':
      return <PlannerSettingContainer {...props} />;
    case 'Leave':
      return <LeaveContainer {...props} />;
    case 'LeaveOfAbsence':
      return <LeaveOfAbsenceContainer {...props} />;
    case 'ShortTimeWorkSetting':
      return <ShortTimeWorkSettingContainer {...props} />;
    case 'ShortTimeWorkReason':
      return <ShortTimeWorkReasonContainer {...props} />;
    case 'WorkScheme':
      return <WorkingTypeContainer {...props} />;
    // Master > Agreement Alert Setting (マスタ > 残業警告設定)
    case 'AttPattern':
      return <AttPatternContainer {...props} />;
    case 'ExtendedItem':
      return <ExtendedItemContainer {...props} />;
    // key is needed so because we are reusing the ExtendedItemContainer
    case 'ExtendedItemProject':
      return (
        <ExtendedItemContainerPSA
          key="Project"
          objectType="Project"
          {...props}
        />
      );
    case 'ExtendedItemRole':
      return (
        <ExtendedItemContainerPSA key="Role" objectType="Role" {...props} />
      );
    case 'AgreementAlertSetting':
      return <AgreementAlertSettingContainer {...props} />;
    // Leave Management > Annual Paid Leave (休暇管理 > 年次有給休暇)
    case 'AnnualPaidLeaveManagement':
      return <AnnualPaidLeaveManagementContainer {...props} />;
    // Leave Management > Managed Leave (休暇管理 > 日数管理休暇)
    case 'ManagedLeaveManagement':
      return <ManagedLeaveManagementContainer {...props} />;
    case 'ShortTimeWorkPeriodStatus':
      return <ShortTimeWorkPeriodStatusContainer {...props} />;
    case 'LeaveOfAbsencePeriodStatus':
      return <LeaveOfAbsencePeriodStatusContainer {...props} />;
    case 'AttPatternEmployeeBatch':
      return <AttPatternEmployeeBatchContainer {...props} />;
    case 'TimeSetting':
      return <TimeSettingContainer {...props} />;
    case 'WorkCategory':
      return <WorkCategoryContainer {...props} />;
    case 'TimeRecordItemImport':
      return <TimeRecordItemImportContainer {...props} />;
    case 'CustomHint':
      return <CustomHintContainer {...props} />;
    case 'ExpenseType':
      return <ExpenseTypeContainer {...props} />;
    case 'TaxType':
      return <TaxTypeContainer {...props} />;
    case 'Currency':
      return <CurrencyContainer {...props} />;
    case 'ExpSetting':
      return <ExpSettingContainer {...props} />;
    case 'ExchangeRate':
      return <ExchangeRateContainer {...props} />;
    case 'AccountingPeriod':
      return <AccountingPeriodContainer {...props} />;
    case 'ReportType':
      return <ReportTypeContainer {...props} />;
    case 'Vendor':
      return <VendorContainer {...props} />;
    case 'Group':
      return <GroupContainer {...props} />;
    case 'JobGrade':
      return <JobGradeContainer {...props} />;
    case 'PsaSettings':
      return <PsaSettingContainer {...props} />;
    case 'ResourceGroup':
      return <ResourceGroupContainer {...props} />;
    case 'PSAGroup':
      return <PSAGroupContainer {...props} />;
    case 'ProjectManagerGroup':
      return <ProjectManagerGroupContainer {...props} />;
    case 'ManagerList':
      return <ManagerListContainer {...props} />;
    case 'Category':
      return <CategoryContainer {...props} />;
    case 'Skillset':
      return <Skillset {...props} />;
    case 'TalentProfile':
      return <TalentProfileContainer {...props} />;
    case 'CreditCard':
      return <CreditCardContainer {...props} />;
    default:
      return null;
  }
};

export default class ContentsContainer extends React.Component<Props> {
  render() {
    return getContentsContainer(this.props);
  }
}
