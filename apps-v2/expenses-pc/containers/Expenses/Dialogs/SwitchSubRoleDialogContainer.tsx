import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { get, isEmpty } from 'lodash';

import SubRoleDialog from '../../../../commons/components/exp/SubRole/SubRoleDialog/SubRoleDialog';
import DateUtil from '@apps/commons/utils/DateUtil';
import { confirm } from '@commons/actions/app';
import subRoleOptionHelper, {
  SubRoleOption,
} from '@commons/components/exp/SubRole/subRoleOptionCreator';
import msg from '@commons/languages';
import { actions as ccActions } from '@commons/modules/costCenterDialog/ui/list';

import { Report } from '@apps/domain/models/exp/Report';

import {
  actions as modeActions,
  modes,
} from '../../../modules/ui/expenses/mode';
import { clearDefaultCostCenter } from '@apps/domain/modules/exp/cost-center/defaultCostCenter';
import { actions as reportActions } from '@apps/domain/modules/exp/expense-report-type/list';
import { State } from '@apps/expenses-pc/modules/index';
import { actions as accountingPeriodActions } from '@apps/expenses-pc/modules/ui/expenses/recordListPane/accountingPeriod';

import {
  createNewExpReport,
  getUserSettings,
  setSelectedSubRole,
} from '@apps/expenses-pc/action-dispatchers/Expenses';

type Props = {
  expReport: Report;
  onClickHideDialogButton: () => void;
};

const SwitchSubRoleDialogContainer = (props: Props): React.ReactElement => {
  const dispatch = useDispatch();

  const reportMode = useSelector((state: any) => state.ui.expenses.mode);
  const companies = useSelector(
    (state: any) => state.common.exp.entities.companyDetails
  );
  const selectedRole = useSelector(
    (state: any) => state.ui.expenses.subrole.selectedRole
  );
  const employeeDetails = useSelector(
    (state: any) => state.common.exp.entities.employeeDetails
  );
  const companyId = useSelector((state: any) => state.userSetting.companyId);
  const selectedExpReport = useSelector(
    (state: State) => state.ui.expenses.selectedExpReport
  );
  const currRecordDate = props.expReport.accountingDate;
  const isExistingReport = !isEmpty(get(selectedExpReport, 'reportId'));

  const [list, setList] = useState<Array<SubRoleOption> | undefined>();
  const [selectedRoleId] = useState(selectedRole);
  const [selectedRoleInfo, setSelectedRoleInfo] = useState<
    | {
        company: any;
        department;
        label: string;
        position: any;
        primary: boolean;
        value: string;
      }
    | undefined
  >();
  // const [selectedDate, setSelectedDate] = useState(DateUtil.getToday());

  const SubRoleActions = useMemo(
    () => bindActionCreators({ setSelectedSubRole }, dispatch),
    [dispatch]
  );
  const ReportActions = useMemo(
    () =>
      bindActionCreators(
        {
          clearList: reportActions.clearList,
          createNewExpReport,
          getAccoutingPeriod: accountingPeriodActions.search,
          clearDefaultCostCenter,
          clearCCList: ccActions.clear,
        },
        dispatch
      ),
    [dispatch]
  );
  const UIActions = useMemo(
    () =>
      bindActionCreators(
        { confirm, reportEdit: modeActions.reportEdit },
        dispatch
      ),
    [dispatch]
  );
  const UserActions = useMemo(
    () => bindActionCreators({ getUserSettings }, dispatch),
    [dispatch]
  );

  useEffect(() => {
    if (
      !isEmpty(employeeDetails) &&
      !isEmpty(employeeDetails.details) &&
      !isEmpty(companies) &&
      isEmpty(list)
    ) {
      const allSubroles = subRoleOptionHelper.getSubRoleOptionsList(
        employeeDetails.details,
        companies
      );
      const subRoles = subRoleOptionHelper.getSubRoleOptionsList(
        employeeDetails.details,
        companies,
        currRecordDate || DateUtil.getToday()
      );
      if (isExistingReport)
        subRoles.forEach((role) => {
          if (role.company.id !== companyId) role.disabled = true;
        });
      const option = allSubroles.find((r) => r.value === selectedRoleId);
      setSelectedRoleInfo(option);
      setList(subRoles);
    }
  }, [employeeDetails, companies]);

  const onChangeRole = async (
    isNewCompany: boolean,
    roleId?: string,
    newCompanyId?: string
  ) => {
    const _ = undefined;
    props.onClickHideDialogButton();
    if (isNewCompany) {
      ReportActions.getAccoutingPeriod(newCompanyId);
      ReportActions.createNewExpReport();
    }
    await SubRoleActions.setSelectedSubRole(roleId);
    await ReportActions.clearDefaultCostCenter();
    await ReportActions.clearCCList();
    await ReportActions.clearList();
    await UserActions.getUserSettings(roleId);
    if (reportMode === modes.REPORT_EDIT || isExistingReport) {
      UIActions.reportEdit();
    }
  };

  const onSelectRole = (roleId: string, option: any) => {
    let confirmMsg = msg().Exp_Lbl_ConfirmRoleChange;
    const newCompanyId = get(option, 'company.id');
    const oldCompanyId = get(selectedRoleInfo, 'company.id');
    const isNewCompany = newCompanyId !== oldCompanyId;
    if (isNewCompany) confirmMsg = msg().Exp_Lbl_ConfirmCompanyRoleChange;
    // When report is in edit mode or if it's an existing report, need to confirm to change
    if (reportMode === modes.REPORT_EDIT || isExistingReport) {
      UIActions.confirm(confirmMsg, async (yes) => {
        if (yes) onChangeRole(isNewCompany, roleId, newCompanyId);
      });
    } else onChangeRole(isNewCompany, roleId, newCompanyId);
  };

  // const onChangeDate = (date: string) => {
  //   setSelectedDate(date);
  // };

  return (
    <SubRoleDialog
      {...props}
      rows={list}
      selectedRoleId={selectedRoleId}
      onSelectRole={onSelectRole}
      onClickHideDialogButton={props.onClickHideDialogButton}
      // selectedDate={selectedDate}
      // onChangeDate={onChangeDate}
    />
  );
};

export default SwitchSubRoleDialogContainer;
