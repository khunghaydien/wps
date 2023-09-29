import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { FunctionTypeList } from '../../constants/functionType';

import { WorkCategory } from '../../../domain/models/time-tracking/WorkCategory';

import * as workCategoryDetailActions from '../../action-dispatchers/work-category/Detail';
import * as workCategoryListActions from '../../action-dispatchers/work-category/List';

import { State } from '../../reducers';

import { getter as RecordGetter } from '../../utils/RecordUtil';

import Component from '../../presentational-components/WorkCategory/Detail';

const mapStateToProps = (state: State) => {
  return {
    editRecord: state.workCategory.entities.baseRecord,
    tmpEditRecord: state.workCategory.ui.detail.baseRecord,
    getOrganizationSetting: state.getOrganizationSetting,
    modeBase: state.base.detailPane.ui.modeBase,
    sfObjFieldValues: state.sfObjFieldValues,
  };
};

const DetailContainer = ({
  useFunction,
}: {
  useFunction: FunctionTypeList;
}) => {
  const pagingCondition = useSelector(
    (state: State) => state.base.listPane.ui.paging
  );
  const companyId = useSelector(
    (state: State) => state.base.menuPane.ui.targetCompanyId
  );
  const searchQuery = useSelector(
    (state: State) => state.workCategory.ui.searchQuery
  );
  const props = useSelector(mapStateToProps);
  const dispatch = useDispatch();
  const WorkCategoryListActions = useMemo(
    () => bindActionCreators(workCategoryListActions, dispatch),
    [dispatch]
  );
  const WorkCategoryDetailActions = useMemo(
    () => bindActionCreators(workCategoryDetailActions, dispatch),
    [dispatch]
  );

  return (
    <Component
      {...props}
      useFunction={useFunction}
      onClickCreateButton={() => {
        (async () => {
          const baseValueGetter = RecordGetter(props.tmpEditRecord);
          const result = await WorkCategoryDetailActions.createRecord(
            companyId,
            {
              ...props.editRecord,
            },
            {
              ...props.tmpEditRecord,
            },
            baseValueGetter,
            useFunction
          );
          if (!result) {
            return;
          }
          WorkCategoryListActions.setSelectedRowIndex(-1);
          await WorkCategoryListActions.refreshSearchResult(
            searchQuery,
            pagingCondition
          );
        })();
      }}
      onClickUpdateBaseButton={() => {
        (async () => {
          const baseValueGetter = RecordGetter(props.tmpEditRecord);
          const result = await WorkCategoryDetailActions.updateBase(
            companyId,
            props.editRecord,
            props.tmpEditRecord,
            baseValueGetter,
            useFunction
          );
          if (!result) {
            return;
          }
          await WorkCategoryListActions.refreshSearchResult(
            searchQuery,
            pagingCondition
          );
          WorkCategoryListActions.setSelectedRowIndex(-1);
        })();
      }}
      onClickDeleteButton={() => {
        (async () => {
          const result = await WorkCategoryDetailActions.removeBase(
            props.editRecord.id
          );
          if (!result) {
            return;
          }
          WorkCategoryListActions.setSelectedRowIndex(-1);
          await WorkCategoryListActions.refreshSearchResult(
            searchQuery,
            pagingCondition
          );
        })();
      }}
      onChangeDetailItem={(
        key: keyof WorkCategory,
        value: WorkCategory[keyof WorkCategory]
      ) => {
        WorkCategoryDetailActions.changeBaseRecordValue(key, value);
      }}
      onClickCloseButton={() => {
        WorkCategoryListActions.setSelectedRowIndex(-1);
        WorkCategoryDetailActions.hideDetail();
      }}
      onClickCancelEditButton={() => {
        WorkCategoryDetailActions.cancelEditing(props.editRecord);
      }}
      onClickStartEditingBaseButton={() => {
        WorkCategoryDetailActions.startEditingBase();
      }}
    />
  );
};

export default DetailContainer;
