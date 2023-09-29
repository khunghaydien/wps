import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { FunctionTypeList } from '../../constants/functionType';

import { MasterEmployeeBase } from '../../../domain/models/organization/MasterEmployeeBase';
import {
  defaultValue as defaultHistoryValue,
  MasterEmployeeHistory,
} from '../../../domain/models/organization/MasterEmployeeHistory';

import { actions as delegateApplicantActions } from '../../modules/delegateApplicant/ui/assignment';
import { actions as delegateApproverActions } from '../../modules/delegateApprover/ui/assignment';

import * as employeeDetailActions from '../../action-dispatchers/employee/Detail';
import * as employeeListActions from '../../action-dispatchers/employee/List';

import { State } from '../../reducers';

import * as RecordUtil from '../../utils/RecordUtil';

import Component from '../../presentational-components/Employee/Detail';

const { useMemo } = React;

export const mapStateToProps = (state: State) => {
  return {
    useExpense: state.common.userSetting.useExpense,
    currentHistoryId: state.employee.ui.detail.selectedHistoryId,
    editRecord: state.employee.entities.baseRecord,
    editRecordHistory:
      state.employee.entities.historyRecordList.find(
        ({ id }) => id === state.employee.ui.detail.selectedHistoryId
      ) || defaultHistoryValue,
    tmpEditRecord: state.employee.ui.detail.baseRecord,
    tmpEditRecordHistory: state.employee.ui.detail.historyRecord,
    getOrganizationSetting: state.getOrganizationSetting,
    modeBase: state.base.detailPane.ui.modeBase,
    modeHistory: state.base.detailPane.ui.modeHistory,
    isShowRevisionDialog: state.base.detailPane.ui.isShowRevisionDialog,
    historyRecordList: state.employee.entities.historyRecordList,
    sfObjFieldValues: state.sfObjFieldValues,
    delegateApproverSettings: state.delegateApprover.entities.assignment,
    delegateApplicantSettings: state.delegateApplicant.entities.assignment,
  };
};

const DetailContainer = ({
  useFunction,
}: {
  useFunction: FunctionTypeList;
}) => {
  const companyId = useSelector(
    (state: State) => state.base.menuPane.ui.targetCompanyId
  );
  const pagingCondition = useSelector(
    (state: State) => state.base.listPane.ui.paging
  );
  const searchQuery = useSelector(
    (state: State) => state.employee.ui.searchQuery
  );
  const props = useSelector(mapStateToProps);
  const dispatch = useDispatch();
  const EmployeeListActions = useMemo(
    () => bindActionCreators(employeeListActions, dispatch),
    [dispatch]
  );
  const EmployeeDetailActions = useMemo(
    () => bindActionCreators(employeeDetailActions, dispatch),
    [dispatch]
  );
  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          openNewApproverAssignment: delegateApproverActions.openNewAssignment,
          openNewApplicantAssignment:
            delegateApplicantActions.openNewAssignment,
        },
        dispatch
      ),
    [dispatch]
  );

  return (
    <Component
      {...props}
      useFunction={useFunction}
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
            companyId,
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
            useFunction
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
      onClickUpdateBaseButton={() => {
        (async () => {
          const baseValueGetter = RecordUtil.getter(props.tmpEditRecord);
          const historyValueGetter = RecordUtil.getter(
            props.tmpEditRecordHistory
          );
          const result = await EmployeeDetailActions.updateBase(
            companyId,
            props.editRecord,
            props.tmpEditRecord,
            baseValueGetter,
            historyValueGetter,
            useFunction
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
          const result = await EmployeeDetailActions.updateHistory(
            props.editRecordHistory,
            props.tmpEditRecordHistory,
            baseValueGetter,
            historyValueGetter,
            useFunction,
            companyId
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
            searchQuery.targetDate
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
        EmployeeDetailActions.changeHistory(value, props.historyRecordList);
      }}
      onClickShowRevisionDialogButton={() => {
        EmployeeDetailActions.showRevisionDialog();
      }}
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
