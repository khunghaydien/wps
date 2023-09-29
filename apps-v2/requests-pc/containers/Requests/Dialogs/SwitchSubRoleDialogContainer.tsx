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
import { State } from '@apps/requests-pc/modules/index';

import {
  createNewExpReport,
  getUserSettings,
  setSelectedSubRole,
} from '@apps/requests-pc/action-dispatchers/Requests';

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
  const isExistingReport = !isEmpty(get(selectedExpReport, 'reportId'));
  const currScheduledDate = props.expReport.scheduledDate;
  const [list, setList] = useState<Array<SubRoleOption> | undefined>();
  const [selectedRoleId] = useState(selectedRole);
  const [selectedRoleInfo, setSelectedRoleInfo] = useState<
    SubRoleOption | undefined
  >();

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
        currScheduledDate || DateUtil.getToday()
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
    newCompanyId: string,
    roleId?: string,
    isNewCompany?: boolean
  ) => {
    const _ = undefined;
    if (isNewCompany) ReportActions.createNewExpReport();
    props.onClickHideDialogButton();
    await SubRoleActions.setSelectedSubRole(roleId);
    await ReportActions.clearDefaultCostCenter();
    await ReportActions.clearCCList();
    await ReportActions.clearList();
    await UserActions.getUserSettings(roleId);
    if (reportMode === modes.REPORT_EDIT || isExistingReport) {
      UIActions.reportEdit();
    }
  };

  const onSelectRole = (roleId: string, option: SubRoleOption) => {
    let confirmMsg = msg().Exp_Lbl_ConfirmRoleChange;
    const newCompanyId = get(option, 'company.id');
    const oldCompanyId = get(selectedRoleInfo, 'company.id');
    const isNewCompany = newCompanyId !== oldCompanyId;
    if (isNewCompany) confirmMsg = msg().Exp_Lbl_ConfirmCompanyRoleChange;
    // When report is in edit mode or if it's an existing report, need to confirm to change
    if (reportMode === modes.REPORT_EDIT || isExistingReport) {
      UIActions.confirm(confirmMsg, async (yes) => {
        if (yes) onChangeRole(newCompanyId, roleId, isNewCompany);
      });
    } else onChangeRole(newCompanyId, roleId, isNewCompany);
  };

  return (
    <SubRoleDialog
      {...props}
      rows={list}
      selectedRoleId={selectedRoleId}
      onSelectRole={onSelectRole}
      onClickHideDialogButton={props.onClickHideDialogButton}
    />
  );
};

export default SwitchSubRoleDialogContainer;
