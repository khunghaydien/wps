import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import get from 'lodash/get';

import msg from '../../commons/languages';

import { JobHistory } from '../../domain/models/organization/JobHistory';

import { MODE } from '../modules/base/detail-pane/ui';
import { actions as jobUIDetailActions } from '../modules/job/ui/detail';
import { actions as jobTypeDialogActions } from '../modules/job/ui/jobTypeDialog';

import { State } from '../reducers';

import Component from '../components/Common/ClearableField';

import JobTypeSearchDialog from './JobTypeContainer/JobTypeSearchDialogContainer';

const mapStateToProps = (state: State) => ({
  isDialogOpen: state.job.ui.jobTypeDialog,
});

const getLabel = (historyRecord: JobHistory) => {
  const path = 'jobType';
  const jobType = get(historyRecord, path, { code: '', name: '' });
  const code = jobType.code || '';
  const name = jobType.name || '';
  const divider = code && name ? ' - ' : '';
  const label = code + divider + name;
  return label;
};

const JobTypeSelectionDialogContainer = () => {
  const props = useSelector(mapStateToProps);
  const dispatch = useDispatch();

  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          changeHistoryRecordValue:
            jobUIDetailActions.setHistoryRecordByKeyValue,
          showDialog: jobTypeDialogActions.show,
        },
        dispatch
      ),
    [dispatch]
  );

  const historyRecord = useSelector(
    (state: State) => state.job.ui.detail.historyRecord
  );

  const mode = useSelector(
    (state: State) => state.base.detailPane.ui.modeHistory
  );

  return (
    <Component
      {...props}
      onClickClearBtn={() => {
        const updatedInfo = { id: '', name: '', code: '' };
        const path = 'jobType';
        Actions.changeHistoryRecordValue(path, updatedInfo);
      }}
      dialog={JobTypeSearchDialog}
      openDialog={() => {
        Actions.showDialog();
      }}
      dialogProps={{
        singleSelection: true,
      }}
      labelSelectBtn={msg().Admin_Lbl_SelectJobType}
      label={getLabel(historyRecord)}
      disabled={mode !== MODE.REVISION && mode !== MODE.NEW}
    />
  );
};
export default JobTypeSelectionDialogContainer;
