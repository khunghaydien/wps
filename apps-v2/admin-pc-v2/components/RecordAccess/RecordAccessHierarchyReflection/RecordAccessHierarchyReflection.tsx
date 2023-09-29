import React, { useEffect, useState, useMemo } from 'react';

import get from 'lodash/get';
import msg from '@commons/languages';

import Button from '@apps/commons/components/buttons/Button';
import Tooltip from '@commons/components/Tooltip';

import * as recordAccess from '@admin-pc-v2/actions/recordAccess';

import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MODE } from '@apps/admin-pc/modules/base/detail-pane/ui';
import { Record } from '@apps/domain/models/exp/Record';

const ROOT = 'record-access-hierarchy-refr';
type Props = {
  mode: string;
  tmpEditRecord: Record;
};
const RecordAccessHierarchyReflection = (props: Props) => {
  const { mode } = props;
  const [lastTimeExecuted, setLastTimeExecuted] = useState(
    get(props.tmpEditRecord, 'lastExecutedDatetime', '-')
  );

  const recordAccessPtnId = get(props.tmpEditRecord, 'id');
  let disabled = false;
  if (mode === MODE.NEW || mode === MODE.EDIT) disabled = true;

  const dispatch = useDispatch();

  useEffect(() => {
    setLastTimeExecuted(get(props.tmpEditRecord, 'lastExecutedDatetime', '-'));
  }, [props.tmpEditRecord]);

  const RecordAccessHierachyActions = useMemo(
    () =>
      bindActionCreators(
        {
          createRecordAccessHierarchy: recordAccess.createRecordAccessHierarchy,
        },
        dispatch
      ),
    [dispatch]
  );

  const onClickUpdate = () => {
    RecordAccessHierachyActions.createRecordAccessHierarchy(
      recordAccessPtnId
      // @ts-ignore
    ).then((res) => {
      const { lastExecutedDatetime } = res;
      setLastTimeExecuted(lastExecutedDatetime || '-');
    });
  };

  const lastTimeExecutedLabel = `${
    msg().Admin_Lbl_LastTimeExected
  }: ${lastTimeExecuted}`;
  return (
    <div className={`${ROOT}`}>
      <Button
        className={`${ROOT}__new-button`}
        type="secondary"
        disabled={disabled}
        onClick={onClickUpdate}
      >
        {msg().Com_Btn_Execute}
      </Button>
      <Tooltip
        align="top right"
        content={msg().Admin_Lbl_RecordAccessHierarchyRefractionExecute}
        className={`${ROOT}__icon-help`}
      >
        <div
          aria-label={msg().Admin_Lbl_RecordAccessHierarchyRefractionExecute}
        >
          &nbsp;
        </div>
      </Tooltip>
      <div className={`${ROOT}__last-executed-time`}>
        {lastTimeExecutedLabel}
      </div>
    </div>
  );
};

export default RecordAccessHierarchyReflection;
