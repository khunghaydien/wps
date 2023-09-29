import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import get from 'lodash/get';

import { FunctionTypeList } from '../../constants/functionType';

import { JobType } from '../../models/job-type/JobType';

import * as jobTypeDetailActions from '../../action-dispatchers/job-type/Detail';
import * as jobTypeListActions from '../../action-dispatchers/job-type/List';
import {
  fetchWorkCategoriesByIds,
  updateWorkCategoryList,
} from '../../action-dispatchers/work-category/List';
import { searchJobType } from '../../actions/jobType';
import { searchWorkCategory } from '../../actions/workCategory';

import { State } from '../../reducers';

import { getter as RecordGetter } from '../../utils/RecordUtil';

import Component from '../../presentational-components/JobType/Detail';

const mapStateToProps = (state: State) => ({
  editRecord: state.jobType.entities.baseRecord,
  tmpEditRecord: state.jobType.ui.detail.baseRecord,
  workCategories: state.workCategory.entities.list,
  getOrganizationSetting: state.getOrganizationSetting,
  modeBase: state.base.detailPane.ui.modeBase,
  sfObjFieldValues: state.sfObjFieldValues,
});

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
    (state: State) => state.jobType.ui.searchQuery
  );
  const props = useSelector(mapStateToProps);
  const dispatch = useDispatch();
  const JobTypeListActions = useMemo(
    () => bindActionCreators(jobTypeListActions, dispatch),
    [dispatch]
  );
  const JobTypeDetailActions = useMemo(
    () => bindActionCreators(jobTypeDetailActions, dispatch),
    [dispatch]
  );

  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          searchJobType,
          searchWorkCategory,
          fetchWorkCategoriesByIds,
          updateWorkCategoryList,
        },
        dispatch
      ),
    [dispatch]
  );

  const MAX_NUM = 100;

  useEffect(() => {
    const id = props.tmpEditRecord.id;
    if (id) {
      Actions.searchJobType({
        companyId,
        id,
        includeWorkCategories: true,
      })
        // @ts-ignore
        .then((res) => {
          const workCategoryIdList = get(res, '0.workCategoryIdList');
          Actions.fetchWorkCategoriesByIds(workCategoryIdList);
        });
    }
  }, [props.tmpEditRecord.id, companyId]);

  return (
    <Component
      {...props}
      useFunction={useFunction}
      onClickCreateButton={() => {
        (async () => {
          const baseValueGetter = RecordGetter(props.tmpEditRecord);
          const result = await JobTypeDetailActions.createRecord(
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
          JobTypeListActions.setSelectedRowIndex(-1);
          await JobTypeListActions.refreshSearchResult(
            searchQuery,
            pagingCondition
          );
        })();
      }}
      onClickUpdateBaseButton={() => {
        (async () => {
          const baseValueGetter = RecordGetter(props.tmpEditRecord);
          const result = await JobTypeDetailActions.updateBase(
            companyId,
            props.editRecord,
            props.tmpEditRecord,
            baseValueGetter,
            useFunction
          );
          if (!result) {
            return;
          }
          await JobTypeListActions.refreshSearchResult(
            searchQuery,
            pagingCondition
          );
          JobTypeListActions.setSelectedRowIndex(-1);
        })();
      }}
      onClickDeleteButton={() => {
        (async () => {
          const result = await JobTypeDetailActions.removeBase(
            props.editRecord.id
          );
          if (!result) {
            return;
          }
          JobTypeListActions.setSelectedRowIndex(-1);
          await JobTypeListActions.refreshSearchResult(
            searchQuery,
            pagingCondition
          );
        })();
      }}
      onChangeDetailItem={(
        key: keyof JobType,
        value: JobType[keyof JobType]
      ) => {
        JobTypeDetailActions.changeBaseRecordValue(key, value);
      }}
      onClickCloseButton={() => {
        JobTypeListActions.setSelectedRowIndex(-1);
        JobTypeDetailActions.hideDetail();
      }}
      onClickCancelEditButton={() => {
        JobTypeDetailActions.cancelEditing(props.editRecord);
      }}
      onClickStartEditingBaseButton={() => {
        JobTypeDetailActions.startEditingBase();
      }}
      maxNum={MAX_NUM}
      // @ts-ignore
      onClickSearchWorkCategories={(code, name) => {
        const excludeIds = props.workCategories.map(({ id }) => id);
        return Actions.searchWorkCategory({
          companyId,
          code,
          name,
          limitNumber: MAX_NUM + 1,
          excludeIds,
        });
      }}
      linkWorkCategories={async (list) => {
        const ids = list.map((item) => item.id);
        const result = await JobTypeDetailActions.linkWorkCategories(
          props.tmpEditRecord.id,
          ids
        );
        if (result) {
          const original = props.workCategories;
          const updatedList = list.concat(original);
          Actions.updateWorkCategoryList(updatedList);
        }
      }}
      unlinkWorkCategories={async (ids) => {
        const result = await JobTypeDetailActions.unlinkWorkCategories(
          props.tmpEditRecord.id,
          ids
        );
        if (result) {
          const updatedList = props.workCategories.filter(
            (item) => !ids.includes(item.id)
          );
          Actions.updateWorkCategoryList(updatedList);
        }
      }}
    />
  );
};

export default DetailContainer;
