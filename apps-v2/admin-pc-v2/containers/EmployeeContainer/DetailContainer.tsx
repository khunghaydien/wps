import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { find } from 'lodash';

import { FunctionTypeList } from '@admin-pc/constants/functionType';
import tabType from '@apps/commons/constants/tabType';

import usePrevious from '@apps/commons/hooks/usePrevious';

import { MasterEmployeeBase } from '@apps/domain/models/organization/MasterEmployeeBase';
import { MasterEmployeeHistory } from '@apps/domain/models/organization/MasterEmployeeHistory';

import { actions as delegateApplicantActions } from '../../../admin-pc/modules/delegateApplicant/ui/assignment';
import { actions as delegateApproverActions } from '../../../admin-pc/modules/delegateApprover/ui/assignment';
import { searchAgreementAlertSetting } from '@admin-pc/modules/agreement-alert-setting/entities';

import { searchCalendar } from '@admin-pc/actions/calendar';
import { searchCostCenter } from '@admin-pc/actions/costCenter';
import { searchDepartment } from '@admin-pc/actions/department';
import { searchEmployeeGroup } from '@admin-pc/actions/employeeGroup';
import { searchJobGrade } from '@admin-pc/actions/jobGrade';
import { searchLegalAgreement } from '@admin-pc/actions/legalAgreement';
import { searchTimeSetting } from '@admin-pc/actions/timeSetting';
import * as employeeDetailActions from '@admin-pc-v2/action-dispatchers/employee/Detail';
import * as employeeListActions from '@admin-pc-v2/action-dispatchers/employee/List';
import { search as searchFeatureAccess } from '@admin-pc-v2/action-dispatchers/FeatureAccess';

import { State } from '@admin-pc-v2/reducers';

import * as RecordUtil from '@admin-pc/utils/RecordUtil';

import { mapStateToProps as mapStateToPropsV1 } from '@admin-pc/containers/EmployeeContainer/DetailContainer';

import Component from '@admin-pc-v2/presentational-components/Employee/Detail';

const mapStateToProps = (state: State) => {
  // TODO Fix incompatible type
  // The type State is coming from V2 reducer but mapStatToPropsV1 accept only V1 State.
  // @ts-ignore
  const stateToPropsV1 = mapStateToPropsV1(state);
  return {
    ...stateToPropsV1,
    searchCompany: state.searchCompany,
    currentRoleId: state.employee.ui.detail.selectedSubRoleKey,
    isOverallSetting:
      state.common.selectedTab === tabType.ADMIN_ORGANIZATION_REQUEST,
  };
};

const DetailContainer = ({
  useFunction,
}: {
  useFunction: FunctionTypeList;
}) => {
  const dispatch = useDispatch();
  const props = useSelector(mapStateToProps);
  const menuCompanyId = useSelector(
    (state: State) => state.base.menuPane.ui.targetCompanyId
  );

  const historyFilter = (hist) => {
    if (props.isOverallSetting) {
      return true;
    }
    return hist.companyId === menuCompanyId;
  };

  const historyRecordList = useSelector((state: State) =>
    state.employee.entities.historyRecordList
      .filter(historyFilter)
      .map((history) => {
        if (history.primary) {
          history.subRoleKey = 'primary';
        }
        return history;
      })
  );

  const historyCompanyId = props.tmpEditRecordHistory.companyId;
  // useFunction for overal setting is based on selected company in detail panel
  const historyBasedUseFunction =
    props.isOverallSetting && historyCompanyId
      ? find(props.searchCompany, {
          id: historyCompanyId,
        })
      : useFunction;

  const useExpense = useFunction.useExpense;
  const usePsa = historyBasedUseFunction.usePsa;

  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          searchCalendar,
          searchEmployeeGroup,
          searchDepartment,
          searchCostCenter,
          searchLegalAgreement,
          searchAgreementAlertSetting,
          searchTimeSetting,
          searchJobGrade,
          searchFeatureAccess,
          // listDelegatedApprovers: delegateApproverActions.list,
          // listDelegatedApplicants: delegateApplicantActions.list,
          openNewApproverAssignment: delegateApproverActions.openNewAssignment,
          openNewApplicantAssignment:
            delegateApplicantActions.openNewAssignment,
        },
        dispatch
      ),
    [dispatch]
  );

  const isShowDetail = useSelector(
    (state: State) => state.base.detailPane.ui.isShowDetail
  );

  const historyId = props.tmpEditRecordHistory.id;

  const historyDate = props.tmpEditRecordHistory.validDateFrom;

  const pagingCondition = useSelector(
    (state: State) => state.base.listPane.ui.paging
  );
  const searchQuery = useSelector(
    (state: State) => state.employee.ui.searchQuery
  );
  const queryDate = useSelector(
    (state: State) => state.employee.ui.searchQuery.searchCondition.targetDate
  );

  const EmployeeListActions = useMemo(
    () => bindActionCreators(employeeListActions, dispatch),
    [dispatch]
  );
  const EmployeeDetailActions = useMemo(
    () => bindActionCreators(employeeDetailActions, dispatch),
    [dispatch]
  );
  const sfObjFieldValues = useSelector(
    (state: State) => state.sfObjFieldValues
  );
  const historyListUnderRole = historyRecordList.filter(
    ({ subRoleKey }) => subRoleKey === props.currentRoleId
  );

  useEffect(() => {
    if (historyCompanyId) {
      const param = { companyId: historyCompanyId };
      Actions.searchCalendar(param);
      Actions.searchFeatureAccess(param);
    }
  }, [historyCompanyId]);

  useEffect(() => {
    if (isShowDetail && historyCompanyId && historyDate) {
      const param = { companyId: historyCompanyId, targetDate: historyDate };
      Actions.searchLegalAgreement(param);
      Actions.searchAgreementAlertSetting(param);
      Actions.searchTimeSetting(param);
      if (useExpense) {
        Actions.searchCostCenter(param);
        Actions.searchEmployeeGroup(param);
      }
      if (usePsa) {
        Actions.searchJobGrade(param);
      }
    }
  }, [isShowDetail, historyCompanyId, historyDate]);

  const prevHistoryId = usePrevious(historyId);
  useEffect(() => {
    if (prevHistoryId === historyId) {
      // clear department & position & emp fields
      const updatedInfo = { name: '', code: '' };

      const approvers = {};

      const noOfApprover = 10;
      for (let i = 1; i <= noOfApprover; i++) {
        const num = `0${i}`.slice(-2);
        approvers[`approver${num}Id`] = null;
        approvers[`approver${num}`] = updatedInfo;
      }
      const updatedHistoryRecord = {
        ...props.tmpEditRecordHistory,
        departmentId: null,
        department: updatedInfo,
        positionId: null,
        position: updatedInfo,
        managerId: null,
        manager: updatedInfo,
        workingTypeId: null,
        workingType: updatedInfo,
        ...approvers,
      };

      EmployeeDetailActions.setHistoryRecord(updatedHistoryRecord);
    }
  }, [historyCompanyId]);

  return (
    <Component
      {...props}
      useFunction={historyBasedUseFunction}
      onChangeDetailItem={(key: keyof MasterEmployeeBase, value: any) => {
        EmployeeDetailActions.changeBaseRecordValue(key, value);
      }}
      onChangeDetailItemHistory={(
        key: keyof MasterEmployeeHistory,
        value: any
      ) => {
        EmployeeDetailActions.changeHistoryRecordValue(key, value);
      }}
      onClickCloseButton={() => {
        EmployeeListActions.setSelectedRowIndex(-1);
        EmployeeDetailActions.hideDetail();
      }}
      onClickCancelEditButton={() => {
        EmployeeDetailActions.cancelEditing(
          props.editRecord,
          props.editRecordHistory
        );
      }}
      onClickStartEditingBaseButton={() => {
        EmployeeDetailActions.startEditingBase();
      }}
      onClickCreateButton={() => {
        (async () => {
          const baseValueGetter = RecordUtil.getter(props.tmpEditRecord);
          const historyValueGetter = RecordUtil.getter(
            props.tmpEditRecordHistory
          );
          const result = await EmployeeDetailActions.createRecord(
            {
              ...props.editRecord,
              ...props.editRecordHistory,
            },
            {
              ...props.tmpEditRecord,
              ...props.tmpEditRecordHistory,
            },
            baseValueGetter,
            historyValueGetter,
            historyBasedUseFunction
          );
          if (!result) {
            return;
          }
          EmployeeListActions.setSelectedRowIndex(-1);
          await EmployeeListActions.refreshSearchResult(
            searchQuery,
            pagingCondition
          );
        })();
      }}
      onClickStartEditingHistoryButton={(params: {
        targetDate: string;
        comment: string;
      }) => {
        EmployeeDetailActions.startEditingHistory(params);
      }}
      startAddNewSubRole={() => {
        EmployeeDetailActions.startAddNewSubRole(
          props.tmpEditRecordHistory,
          sfObjFieldValues,
          queryDate
        );
      }}
      onClickSaveNewSubRole={() => {
        (async () => {
          const baseValueGetter = RecordUtil.getter(props.tmpEditRecord);
          const historyValueGetter = RecordUtil.getter(
            props.tmpEditRecordHistory
          );
          await EmployeeDetailActions.updateHistory(
            props.editRecordHistory,
            props.tmpEditRecordHistory,
            baseValueGetter,
            historyValueGetter,
            historyBasedUseFunction,
            props.modeHistory
          );
        })();
      }}
      startEditingCurrentHistory={() => {
        EmployeeDetailActions.startEditingCurrentHistory();
      }}
      onClickUpdateBaseButton={() => {
        (async () => {
          const baseValueGetter = RecordUtil.getter(props.tmpEditRecord);
          const historyValueGetter = RecordUtil.getter(
            props.tmpEditRecordHistory
          );
          const result = await EmployeeDetailActions.updateBase(
            props.editRecord,
            props.tmpEditRecord,
            baseValueGetter,
            historyValueGetter,
            historyBasedUseFunction
          );
          if (!result) {
            return;
          }
          await EmployeeListActions.refreshSearchResult(
            searchQuery,
            pagingCondition
          );
          EmployeeListActions.setSelectedRowIndex(-1);
        })();
      }}
      onClickUpdateHistoryButton={() => {
        (async () => {
          const baseValueGetter = RecordUtil.getter(props.tmpEditRecord);
          const historyValueGetter = RecordUtil.getter(
            props.tmpEditRecordHistory
          );
          await EmployeeDetailActions.updateHistory(
            props.editRecordHistory,
            props.tmpEditRecordHistory,
            baseValueGetter,
            historyValueGetter,
            historyBasedUseFunction,
            props.modeHistory
          );
        })();
      }}
      onClickDeleteButton={() => {
        (async () => {
          const result = await EmployeeDetailActions.removeBase(
            props.editRecord.id
          );
          if (!result) {
            return;
          }
          EmployeeListActions.setSelectedRowIndex(-1);
          await EmployeeListActions.refreshSearchResult(
            searchQuery,
            pagingCondition
          );
        })();
      }}
      onClickDeleteHistoryButton={() => {
        (async () => {
          const result = await EmployeeDetailActions.removeHistory(
            props.currentHistoryId,
            props.editRecord.id,
            searchQuery.searchCondition.targetDate,
            props.currentRoleId
          );
          if (!result) {
            return;
          }
          await EmployeeListActions.refreshSearchResult(
            searchQuery,
            pagingCondition
          );
        })();
      }}
      onChangeHistory={(value: string) => {
        EmployeeDetailActions.changeHistory(value, historyRecordList);
      }}
      onChangeRole={(value: string) => {
        EmployeeDetailActions.changeRole(value, historyRecordList);
      }}
      onClickShowRevisionDialogButton={() => {
        EmployeeDetailActions.showRevisionDialog();
      }}
      historyListUnderRole={historyListUnderRole}
      historyRecordList={historyRecordList}
      onClickNewApproverAssignmentButton={() => {
        Actions.openNewApproverAssignment();
      }}
      onClickNewApplicantAssignmentButton={() => {
        Actions.openNewApplicantAssignment();
      }}
    />
  );
};

export default DetailContainer;
