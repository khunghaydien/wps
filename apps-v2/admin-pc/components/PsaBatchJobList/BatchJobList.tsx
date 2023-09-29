import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  BatchJob,
  PsaBatchJobCategory,
} from '../../models/psaBatchJob/PsaBatchJob';

import * as psaBatchJob from '@apps/admin-pc/actions/psaBatchJob';

import { State } from '@apps/admin-pc/reducers';

import BatchJobItem from './BatchJobItem';

import './BatchJobList.scss';

type Props = {
  config: any;
};

const BatchJobList = (props: Props) => {
  const key: PsaBatchJobCategory = props.config.key;

  const getPsaBatchJob = useSelector((state: State) => state.getPsaBatchJob);
  const companyId = useSelector(
    (state: State) => state.base.menuPane.ui.targetCompanyId
  );

  const dispatch = useDispatch();
  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          getPsaBatchJob: psaBatchJob.getPsaBatchJob,
          runPsaBatchJob: psaBatchJob.runPsaBatchJob,
        },
        dispatch
      ),
    [dispatch]
  );

  return (
    <div>
      {Array.isArray(getPsaBatchJob) &&
        getPsaBatchJob.map((item: BatchJob, idx) =>
          item.category === key ? (
            <BatchJobItem
              companyId={companyId}
              item={item}
              key={idx}
              actions={Actions}
            ></BatchJobItem>
          ) : null
        )}
    </div>
  );
};

export default BatchJobList;
