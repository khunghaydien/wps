import React, { useCallback, useMemo } from 'react';

import { isValid, parse } from 'date-fns';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import { DatePicker } from '@apps/core';

import { useDate } from '../../hooks/useDate';
import { useDestinationTask } from '../../hooks/useDestinationTask';
import { useFormattedDate } from '../../hooks/useFormattedDate';
import { useSummary } from '../../hooks/useSummary';
import { useToast } from '../../hooks/useToast';

const defaultDurationTime = 4000;

const S = {
  DatePickerWrapper: styled.div`
    width: 160px;
  `,
  Spacer: styled.div`
    width: 76px;
  `,
};

const Period: React.FC = () => {
  const [startDate, endDate, selectStartDate, selectEndDate] = useDate();
  const formattedStartDate = useFormattedDate(startDate);
  const formattedEndDate = useFormattedDate(endDate);
  const [{ validFrom, validTo }] = useDestinationTask();
  const [{ summaryPeriod }] = useSummary();
  const [showError] = useToast('warning', defaultDurationTime);

  const minDate = useMemo(() => {
    const validFromDate = parse(validFrom);
    if (isValid(validFromDate) && validFromDate > summaryPeriod.startDate) {
      return validFromDate;
    }
    return summaryPeriod.startDate;
  }, [validFrom, summaryPeriod.startDate]);

  const maxDate = useMemo(() => {
    const validToDate = parse(validTo);
    if (isValid(validToDate) && validToDate < summaryPeriod.endDate) {
      return validToDate;
    }
    return summaryPeriod.endDate;
  }, [validTo, summaryPeriod.endDate]);

  /**
   * 手入力（onChange）された日付が期間外の場合、エラーを表示して値を有効な日付に戻す
   */
  const correctChangedDate = useCallback(
    (changedDate: Date, validDate: Date, handler: (Date) => void) => {
      // NOTE:
      // 入力値が有効期間内であれば、onSelectで値が反映済みなので、ここでは取り扱わない
      // ※state更新をdispatchするとonSelectで不正な値の更新が発生してしまう
      if (changedDate >= minDate && changedDate <= maxDate) {
        return;
      }

      // NOTE: 空欄にした場合に入力欄に1970/01/01（new Date(null)）が適用されてしまう挙動の回避
      if (changedDate.getTime() === 0) {
        return;
      }

      // NOTE:
      // そのまま元の値をdispatchしてもstateが変更されず表示に不正な値が残る場合があるので、
      // まず入力値を反映してから、戻したい値をdispatchする
      handler(changedDate);
      setTimeout(() => {
        showError(msg().Time_Err_CannotSpecifyADateOutsideTheRange);
        handler(validDate);
      }, 0);
    },
    [minDate, maxDate, showError]
  );

  const onChangeStartDate = useCallback(
    (changedDate: Date) =>
      correctChangedDate(changedDate, minDate, selectStartDate),
    [minDate, correctChangedDate, selectStartDate]
  );

  const onChangeEndDate = useCallback(
    (changedDate: Date) =>
      correctChangedDate(changedDate, maxDate, selectEndDate),
    [maxDate, correctChangedDate, selectEndDate]
  );

  return (
    <>
      <S.DatePickerWrapper>
        <DatePicker
          selected={startDate}
          value={formattedStartDate}
          onSelect={selectStartDate}
          onChange={onChangeStartDate}
          minDate={minDate}
          maxDate={maxDate}
        />
      </S.DatePickerWrapper>
      <S.Spacer />
      <S.DatePickerWrapper>
        <DatePicker
          selected={endDate}
          value={formattedEndDate}
          onSelect={selectEndDate}
          onChange={onChangeEndDate}
          minDate={minDate}
          maxDate={maxDate}
        />
      </S.DatePickerWrapper>
    </>
  );
};

export default Period;
