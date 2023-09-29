import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';

import { FunctionTypeList } from '../../constants/functionType';

import { searchAgreementAlertSetting } from '../../modules/agreement-alert-setting/entities';
import { actions as delegateApplicantActions } from '../../modules/delegateApplicant/entities/assignment';
import { actions as delegateApproverActions } from '../../modules/delegateApprover/entities/assignment';

import { searchCalendar } from '../../actions/calendar';
import { searchCostCenter } from '../../actions/costCenter';
import { searchDepartment } from '../../actions/department';
import { searchEmployeeGroup } from '../../actions/employeeGroup';
import { searchJobGrade } from '../../actions/jobGrade';
import { searchPermission } from '../../actions/permission';
import { searchTimeSetting } from '../../actions/timeSetting';
import { searchWorkingType } from '../../actions/workingType';

import { State } from '../../reducers';

import Employee from '../../presentational-components/Employee';

const { useMemo, useEffect } = React;

const mapStateToProps = (state: State) => {
  return {
    isShowDetail: state.base.detailPane.ui.isShowDetail,
    isNewApproverAssignment:
      state.delegateApprover.ui.assignment.isNewAssignment,
    isNewApplicantAssignment:
      state.delegateApplicant.ui.assignment.isNewAssignment,
  };
};

const EmployeeContainer = (ownProps: {
  title: string;
  useFunction: FunctionTypeList;
}) => {
  const companyId = useSelector(
    (state: State) => state.base.menuPane.ui.targetCompanyId
  );
  const baseRecord = useSelector(
    (state: State) => state.employee.ui.detail.baseRecord
  );
  const historyRecord = useSelector(
    (state: State) => state.employee.ui.detail.historyRecord
  );
  const isShowDetail = useSelector(
    (state: State) => state.base.detailPane.ui.isShowDetail
  );
  const useExpense = ownProps.useFunction.useExpense;
  const usePsa = useSelector((state: State) => state.common.userSetting.usePsa);
  const props = useSelector(mapStateToProps);
  const dispatch = useDispatch();

  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          searchCalendar,
          searchPermission,
          searchEmployeeGroup,
          searchDepartment,
          searchCostCenter,
          searchWorkingType,
          searchAgreementAlertSetting,
          searchTimeSetting,
          searchJobGrade,
          listDelegatedApprovers: delegateApproverActions.list,
          listDelegatedApplicants: delegateApplicantActions.list,
        },
        dispatch
      ),
    [dispatch]
  );

  useEffect(() => {
    const param = { companyId };
    Actions.searchCalendar(param);
    Actions.searchPermission(param);
  }, [companyId]);

  const targetDate = historyRecord.validDateFrom || undefined;
  useEffect(() => {
    if (isShowDetail) {
      const param = { companyId, targetDate };
      Actions.searchDepartment(param);
      Actions.searchWorkingType(param);
      Actions.searchAgreementAlertSetting(param);
      Actions.searchTimeSetting(param);
      if (useExpense) {
        Actions.searchCostCenter(param);
        Actions.searchEmployeeGroup(param);
      }
      if (usePsa === true) {
        Actions.searchJobGrade(param);
      }
    }
  }, [isShowDetail, companyId, targetDate]);

  useEffect(() => {
    if (isShowDetail) {
      if (baseRecord.id) {
        if (useExpense) {
          Actions.listDelegatedApprovers(baseRecord.id);
          Actions.listDelegatedApplicants(baseRecord.id);
        }
      }
    }
  }, [isShowDetail, baseRecord.id]);

  // @ts-ignore
  return <Employee {...ownProps} {...props} companyId={companyId} />;
};

export default EmployeeContainer;
