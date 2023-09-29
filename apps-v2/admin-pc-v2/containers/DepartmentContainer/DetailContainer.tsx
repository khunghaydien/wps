import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { FunctionTypeList } from '@admin-pc/constants/functionType';

import { MasterDepartmentBase } from '@apps/domain/models/organization/MasterDepartmentBase';
import {
  defaultValue as defaultHistoryValue,
  MasterDepartmentHistory,
} from '@apps/domain/models/organization/MasterDepartmentHistory';

import * as departmentDetailActions from '@admin-pc-v2/action-dispatchers/department/Detail';
import * as departmentListActions from '@admin-pc-v2/action-dispatchers/department/List';

import { State } from '@admin-pc-v2/reducers';

import * as RecordUtil from '@admin-pc/utils/RecordUtil';

import Component from '@admin-pc-v2/presentational-components/Department/Detail';

const mapStateToProps = (state: State) => {
  return {
    useExpense: state.common.userSetting.useExpense,
    currentHistoryId: state.department.ui.detail.selectedHistoryId,
    editRecord: state.department.entities.baseRecord,
    editRecordHistory:
      state.department.entities.historyRecordList.find(
        ({ id }) => id === state.department.ui.detail.selectedHistoryId
      ) || defaultHistoryValue,
    tmpEditRecord: state.department.ui.detail.baseRecord,
    tmpEditRecordHistory: state.department.ui.detail.historyRecord,
    getOrganizationSetting: state.getOrganizationSetting,
    modeBase: state.base.detailPane.ui.modeBase,
    modeHistory: state.base.detailPane.ui.modeHistory,
    isShowRevisionDialog: state.base.detailPane.ui.isShowRevisionDialog,
    historyRecordList: state.department.entities.historyRecordList,
    sfObjFieldValues: state.sfObjFieldValues,
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
    (state: State) => state.department.ui.searchQuery
  );
  const props = useSelector(mapStateToProps);
  const dispatch = useDispatch();
  const DepartmentListActions = useMemo(
    () => bindActionCreators(departmentListActions, dispatch),
    [dispatch]
  );
  const DepartmentDetailActions = useMemo(
    () => bindActionCreators(departmentDetailActions, dispatch),
    [dispatch]
  );

  return (
    <Component
      {...props}
      useFunction={useFunction}
      onChangeDetailItem={(key: keyof MasterDepartmentBase, value: any) => {
        DepartmentDetailActions.changeBaseRecordValue(key, value);
      }}
      onChangeDetailItemHistory={(
        key: keyof MasterDepartmentHistory,
        value: any
      ) => {
        DepartmentDetailActions.changeHistoryRecordValue(key, value);
      }}
      onClickCloseButton={() => {
        DepartmentListActions.setSelectedRowIndex(-1);
        DepartmentDetailActions.hideDetail();
      }}
      onClickCancelEditButton={() => {
        DepartmentDetailActions.cancelEditing(props.editRecord, {
          ...props.editRecordHistory,
          hierarchyPatternId: props.tmpEditRecordHistory.hierarchyPatternId,
        });
      }}
      onClickStartEditingBaseButton={() => {
        DepartmentDetailActions.startEditingBase();
      }}
      onClickCreateButton={() => {
        (async () => {
          const baseValueGetter = RecordUtil.getter(props.tmpEditRecord);
          const historyValueGetter = RecordUtil.getter(
            props.tmpEditRecordHistory
          );
          const result = await DepartmentDetailActions.createRecord(
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
          DepartmentListActions.setSelectedRowIndex(-1);
          await DepartmentListActions.refreshSearchResult(
            searchQuery,
            pagingCondition
          );
        })();
      }}
      onClickStartEditingHistoryButton={(params: {
        targetDate: string;
        comment: string;
      }) => {
        DepartmentDetailActions.startEditingHistory(params);
      }}
      startEditingCurrentHistory={() => {
        DepartmentDetailActions.startEditingCurrentHistory();
      }}
      onClickUpdateBaseButton={() => {
        (async () => {
          const baseValueGetter = RecordUtil.getter(props.tmpEditRecord);
          const historyValueGetter = RecordUtil.getter(
            props.tmpEditRecordHistory
          );
          const result = await DepartmentDetailActions.updateBase(
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
          await DepartmentListActions.refreshSearchResult(
            searchQuery,
            pagingCondition
          );
          DepartmentListActions.setSelectedRowIndex(-1);
        })();
      }}
      onClickUpdateHistoryButton={() => {
        const isUpdate = props.modeHistory === 'edit';
        (async () => {
          const baseValueGetter = RecordUtil.getter(props.tmpEditRecord);
          const historyValueGetter = RecordUtil.getter(
            props.tmpEditRecordHistory
          );
          const result = await DepartmentDetailActions.updateHistory(
            props.editRecordHistory,
            props.tmpEditRecordHistory,
            baseValueGetter,
            historyValueGetter,
            useFunction,
            companyId,
            isUpdate
          );
          if (!result) {
            return;
          }
          await DepartmentListActions.refreshSearchResult(
            searchQuery,
            pagingCondition
          );
        })();
      }}
      onClickDeleteButton={() => {
        (async () => {
          const result = await DepartmentDetailActions.removeBase(
            props.editRecord.id
          );
          if (!result) {
            return;
          }
          DepartmentListActions.setSelectedRowIndex(-1);
          await DepartmentListActions.refreshSearchResult(
            searchQuery,
            pagingCondition
          );
        })();
      }}
      onClickDeleteHistoryButton={() => {
        (async () => {
          const result = await DepartmentDetailActions.removeHistory(
            props.currentHistoryId,
            props.editRecord.id,
            searchQuery.targetDate
          );
          if (!result) {
            return;
          }
          await DepartmentListActions.refreshSearchResult(
            searchQuery,
            pagingCondition
          );
        })();
      }}
      onChangeHistory={(value: string) => {
        DepartmentDetailActions.changeHistory(value, props.historyRecordList);
      }}
      onClickShowRevisionDialogButton={() => {
        DepartmentDetailActions.showRevisionDialog();
      }}
    />
  );
};

export default DetailContainer;
