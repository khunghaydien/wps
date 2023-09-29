import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import isNil from 'lodash/isNil';

import { catchApiError } from '../../commons/actions/app';
import msg from '../../commons/languages';

import JobRepository from '../../repositories/JobRepository';

import { Job as JobMaster } from '../../domain/models/organization/Job';

import { MODE } from '../modules/base/detail-pane/ui';
import { actions as jobUIDetailActions } from '../modules/job/ui/detail';

import { State } from '../reducers';

import ClearableField from '../components/Common/ClearableField';

import { useJobSelectDialog } from '../../time-tracking/JobSelectDialog';

const JobParentContainer = () => {
  const mode = useSelector((state: State) => state.base.detailPane.ui.modeBase);
  const companyId = useSelector(
    (state: State) => state.base.menuPane.ui.targetCompanyId
  );
  const searchCompany = useSelector((state: State) => state.searchCompany);
  const targetDate = useSelector(
    (state: State) => state.job.ui.detail.baseRecord.validDateTo
  );
  const parentJob = useSelector(
    (state: State) => state.job.ui.detail.baseRecord.parent
  );
  const originalValidDateFrom = useSelector(
    (state: State) => state.job.ui.detail.baseRecord.validDateFrom
  );
  const originalValidDateTo = useSelector(
    (state: State) => state.job.ui.detail.baseRecord.validDateTo
  );

  const useJobSearchAndSelect =
    searchCompany.find((record) => record.id === companyId)
      ?.useJobSearchAndSelect || false;

  const parentJobName = parentJob ? parentJob.name : '';
  const parentJobCode = parentJob ? parentJob.code : '';
  const selectedParentJobLabel = useMemo(() => {
    return parentJob && parentJob.code && parentJob.name
      ? `${parentJob.code} - ${parentJob.name}`
      : '';
  }, [parentJob, parentJobName, parentJobCode]);

  const dispatch = useDispatch();
  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          catchApiError,
          changeBaseRecordValue: jobUIDetailActions.setBaseRecordByKeyValue,
        },
        dispatch
      ),
    [dispatch]
  );

  const [onClickShowDialog] = useJobSelectDialog({
    targetDate,
    onOk: ({ id, code, name, validDateFrom, validDateThrough }: JobMaster) => {
      Actions.changeBaseRecordValue('parent', { code, name });
      Actions.changeBaseRecordValue('parentId', id);
      if (
        (isNil(originalValidDateFrom) || originalValidDateFrom === '') &&
        (isNil(originalValidDateTo) || originalValidDateTo === '')
      ) {
        Actions.changeBaseRecordValue('validDateFrom', validDateFrom);
        Actions.changeBaseRecordValue('validDateTo', validDateThrough);
      }
    },
    onError: (e) => Actions.catchApiError(e),
    repository: JobRepository,
    companyId,
    useConditionalSearch: useJobSearchAndSelect,
  });
  return (
    <ClearableField
      onClickClearBtn={() => {
        Actions.changeBaseRecordValue('parent', { code: '', name: '' });
        Actions.changeBaseRecordValue('parentId', '');
      }}
      openDialog={onClickShowDialog}
      dialogProps={{
        singleSelection: true,
      }}
      labelSelectBtn={msg().Admin_Lbl_SelectParentJob}
      label={selectedParentJobLabel}
      disabled={mode !== MODE.EDIT && mode !== MODE.NEW}
      dialog={null}
      isDialogOpen={false}
    />
  );
};

export default JobParentContainer;
