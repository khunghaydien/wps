import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actions as jobTypeListActions } from '../../modules/job/entities/jobTypeList';
import { actions as jobUIDetailActions } from '../../modules/job/ui/detail';
import { actions as jobTypeDialogActions } from '../../modules/job/ui/jobTypeDialog';

import { searchJobTypes } from '../../action-dispatchers/job-type/List';

import { State } from '../../reducers';

import Component from '../../presentational-components/JobType/JobTypeSearchDialog';

const mapStateToProps = (state: State) => ({
  jobTypes: state.job.entities.jobTypeList,
});

const JobTypeSearchDialogContainer = () => {
  const props = useSelector(mapStateToProps);
  const dispatch = useDispatch();

  const companyId = useSelector(
    (state: State) => state.base.menuPane.ui.targetCompanyId
  );

  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          search: searchJobTypes,
          clearDialog: jobTypeListActions.clear,
          hideDialog: jobTypeDialogActions.hide,
          changeHistoryRecordValue:
            jobUIDetailActions.setHistoryRecordByKeyValue,
        },
        dispatch
      ),
    [dispatch]
  );

  const MAX_NUM = 100;

  return (
    <Component
      {...props}
      maxNum={MAX_NUM}
      search={(query: { code: string; name: string }) =>
        Actions.search({ companyId, ...query })
      }
      hideDialog={() => {
        Actions.clearDialog();
        Actions.hideDialog();
      }}
      setJobType={(jobType) => {
        const { code, name, id } = jobType;
        Actions.changeHistoryRecordValue('jobType', { id, code, name });
        Actions.clearDialog();
        Actions.hideDialog();
      }}
    />
  );
};

export default JobTypeSearchDialogContainer;
