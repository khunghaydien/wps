import React, { useCallback, useEffect, useMemo, useState } from 'react';

import styled, { createGlobalStyle } from 'styled-components';

import { Dropdown, Option as DropdownOption } from '@apps/core';

import { DeviationReason as DailyDeviationReason } from '@attendance/domain/models/DailyObjectivelyEventLogDeviationReason';

import { DeviationReason } from '@attendance/timesheet-pc/viewModels/EditingDailyAttendanceTimeViewModel';

const ROOT =
  'timesheet-pc-dialogs-daily-attentions-dialog-content-fields-daily-deviated-reason';

const Style = createGlobalStyle<{ length: number }>`
  .${ROOT}__list-box {
    ${({ length }) => {
      const l = length <= 0 ? 1 : length > 7 ? 7 : length;
      // 1行高さ=30px, マージン上下合計=18px
      return ` height: ${l * 30 + 18}px;`;
    }}
  }
`;

const DailyDeviatedReasonCell = styled.div`
  width: 250px;
  margin-right: 15px;
  margin-bottom: 15px;
`;

const Option = styled.div`
  word-break: break-word;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 196px;
`;

const DailyDeviatedReason: React.FC<{
  type: 'entering' | 'leaving';
  id: string;
  value: DeviationReason | null;
  deviatedReasons: Map<DailyDeviationReason['value'], DailyDeviationReason>;
  disabled: boolean;
  lockedSummary: boolean;
  onUpdateDeviationReasonId: (value: string) => void;
  onUpdateDeviationReason: (
    name: 'entering' | 'leaving',
    key: keyof DeviationReason,
    value: string
  ) => void;
}> = ({
  id,
  type,
  value,
  deviatedReasons,
  disabled,
  lockedSummary,
  onUpdateDeviationReason,
  onUpdateDeviationReasonId,
}) => {
  const [initialValue] = useState(value);
  const [enteringPullDownReason, setEnteringPullDownReason] = useState(false);
  const [LeavingPullDownReason, setLeavingPullDownReason] = useState(false);

  const records = React.useMemo(
    () => (deviatedReasons ? [...deviatedReasons.values()] : []),
    [deviatedReasons]
  );
  const deviatedReasonsOptions = useMemo(() => {
    const options: DropdownOption[] = [];
    options.push({
      value: '',
      label: '',
    });

    if (initialValue && lockedSummary) {
      options.push({
        value: initialValue.value,
        label: <Option title={initialValue.label}>{initialValue.label}</Option>,
      });
    }

    options.push(
      ...records.map((item) => ({
        id,
        value: item.value,
        label: <Option title={item.label}>{item.label}</Option>,
      }))
    );
    return options;
  }, [records, initialValue, deviatedReasons, id]);

  const onEnteringReasonChange = useCallback(
    (value: string) => {
      const reason = deviatedReasons?.get(value);
      if (!value) {
        setEnteringPullDownReason(true);
        onUpdateDeviationReason('entering', 'value', '');
        onUpdateDeviationReason('entering', 'label', '');
      } else {
        setEnteringPullDownReason(false);
        onUpdateDeviationReason('entering', 'value', value);
        onUpdateDeviationReason('entering', 'label', reason?.label);
      }
    },
    [deviatedReasons, onUpdateDeviationReason, initialValue]
  );

  const onLeavingReasonChange = useCallback(
    (value: string) => {
      const reason = deviatedReasons?.get(value);
      if (!value) {
        setLeavingPullDownReason(true);
        onUpdateDeviationReason('leaving', 'value', '');
        onUpdateDeviationReason('leaving', 'label', '');
      } else {
        setLeavingPullDownReason(false);
        onUpdateDeviationReason('leaving', 'value', value);
        onUpdateDeviationReason('leaving', 'label', reason?.label);
      }
    },
    [deviatedReasons, onUpdateDeviationReason, initialValue]
  );

  useEffect(() => {
    if (disabled) {
      return;
    }
    if (
      value &&
      value.value &&
      deviatedReasons &&
      !deviatedReasons.get(value.value)
    ) {
      if (type === 'entering') {
        setEnteringPullDownReason(true);
      } else if (type === 'leaving') {
        setLeavingPullDownReason(true);
      }
    }
    if (enteringPullDownReason) {
      onUpdateDeviationReason('entering', 'value', '');
      onUpdateDeviationReason('entering', 'label', '');
    }
    if (LeavingPullDownReason) {
      onUpdateDeviationReason('leaving', 'value', '');
      onUpdateDeviationReason('leaving', 'label', '');
    }
    if (enteringPullDownReason && LeavingPullDownReason) {
      onUpdateDeviationReasonId('');
    } else {
      onUpdateDeviationReasonId(id);
    }
  }, [
    deviatedReasons,
    enteringPullDownReason,
    LeavingPullDownReason,
    value?.value,
  ]);

  switch (type) {
    case 'entering':
      return (
        <DailyDeviatedReasonCell>
          <Style length={deviatedReasonsOptions?.length || 0} />
          <Dropdown
            options={deviatedReasonsOptions}
            value={value?.value || ''}
            listBoxClassName={`${ROOT}__list-box`}
            onSelect={(option) => onEnteringReasonChange(option.value)}
            readOnly={disabled}
          />
        </DailyDeviatedReasonCell>
      );
    case 'leaving':
      return (
        <DailyDeviatedReasonCell>
          <Style length={deviatedReasonsOptions?.length || 0} />
          <Dropdown
            options={deviatedReasonsOptions}
            value={value?.value || ''}
            listBoxClassName={`${ROOT}__list-box`}
            onSelect={(option) => onLeavingReasonChange(option.value)}
            readOnly={disabled}
          />
        </DailyDeviatedReasonCell>
      );
    default:
      return null;
  }
};

export default DailyDeviatedReason;
