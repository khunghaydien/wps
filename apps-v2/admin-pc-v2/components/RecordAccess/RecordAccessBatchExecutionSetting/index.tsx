import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';

import get from 'lodash/get';

import Button from '@apps/commons/components/buttons/Button';
import Tooltip from '@commons/components/Tooltip';
import msg from '@commons/languages';

import { MODE } from '@apps/admin-pc/modules/base/detail-pane/ui';

import * as recordAccess from '@admin-pc-v2/actions/recordAccess';

import './RecordAccessBatchExecutionSetting.scss';

const ROOT = 'record-access-batch-execution-setting';

type Props = {
  mode: string;
};
const RecordAccessBatchExecutionSetting = (props: Props) => {
  const { mode } = props;
  const dispatch = useDispatch();

  const [timeExecuted, setTimeExecuted] = useState<{
    lastExecutedStartTime?: string;
    lastExecutedEndTime?: string;
  }>({ lastExecutedEndTime: '-', lastExecutedStartTime: '-' });

  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          runBatch: recordAccess.runBatch,
          getBatchExecutedTimes: recordAccess.getBatchExecutedTimes,
        },
        dispatch
      ),
    [dispatch]
  );

  useEffect(() => {
    // @ts-ignore
    Actions.getBatchExecutedTimes().then((response) => {
      setTimeExecuted(response);
    });
  }, []);

  const onClickUpdate = () => {
    // @ts-ignore
    Actions.runBatch().then((response) => {
      if (response && response.lastExecutedStartTime) setTimeExecuted(response);
    });
  };

  let disabled = false;
  if (mode === MODE.NEW || mode === MODE.EDIT) disabled = true;
  return (
    <div className={ROOT}>
      <div className={`${ROOT}__button-container`}>
        <Button
          className={`${ROOT}__new-button`}
          type="secondary"
          disabled={disabled}
          onClick={onClickUpdate}
        >
          {msg().Com_Btn_Execute}
        </Button>
        <Tooltip
          align="top left"
          content={msg().Admin_Lbl_BasicRecordUpdateHint}
          className={`${ROOT}__icon-help`}
        >
          <div aria-label={msg().Admin_Lbl_BasicRecordUpdateHint}>&nbsp;</div>
        </Tooltip>
      </div>
      <div className={`${ROOT}__time-container`}>
        <p>
          {msg().Admin_Lbl_LastExecutedStartTime}:{' '}
          {get(timeExecuted, 'lastExecutedStartTime', '-')}
        </p>
        <p>
          {msg().Admin_Lbl_LastExecutedEndTime}:{' '}
          {get(timeExecuted, 'lastExecutedEndTime', '-')}
        </p>
      </div>
    </div>
  );
};

export default RecordAccessBatchExecutionSetting;
