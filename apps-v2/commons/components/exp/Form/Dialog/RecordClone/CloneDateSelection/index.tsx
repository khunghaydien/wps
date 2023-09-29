import React, { useEffect, useState } from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';

import isEmpty from 'lodash/isEmpty';

import DateUtil from '../../../../../../utils/DateUtil';

import IconArrowLeft from '../../../../../../images/arrowLeft.svg';
import IconArrowRight from '../../../../../../images/arrowRight.svg';
import msg from '../../../../../../languages';
import Button from '../../../../../buttons/Button';
import DialogFrame from '../../../../../dialogs/DialogFrame';

import 'react-day-picker/lib/style.css';
import './index.scss';

const ROOT = 'ts-expenses-modal-record-clone-date-selection';
const MAX_CLONE_NUMBER = 20;

export type RecordClone = {
  dates: Date[];
  defaultDate: string;
  records: string[];
};

export type Props = {
  language: string;
  recordClone: RecordClone;
  onClickCalendarRecordClone: () => void;
  onClickChangeDate: (arg0: Date[]) => void;
  onClickHideDialogButton: () => void;
};

const getRangeDays = (from: Date, to: Date): Date[] => {
  let dateRange = [];
  if (from && to) {
    dateRange = [from];
    const daysDiff = DateUtil.dayDiff(from, to);
    for (let i = 1; i <= daysDiff; i++) {
      dateRange.push(DateUtil.addInDate(from, i, 'd'));
    }
  }
  return dateRange;
};

const RecordCloneDateDialog = (props: Props) => {
  const {
    onClickHideDialogButton,
    onClickCalendarRecordClone,
    onClickChangeDate,
    recordClone,
    language,
  } = props;
  const { dates, records, defaultDate } = recordClone;
  const [defaultDateYear, defaultDateMonth] = DateUtil.format(
    defaultDate,
    'YYYY-MM-DD'
  ).split('-');
  const modifiers = {
    defaultDay: new Date(
      Number(defaultDateYear),
      new Date().getMonth(),
      new Date().getDate()
    ),
  };

  const initialRangeStart = { startDate: undefined, isSelected: false };
  const [startMonth, setStartMonth] = useState(Number(defaultDateMonth) - 1);
  const [rangeStart, setRangeStart] = useState(initialRangeStart);
  const [jaMonthLabel, setJaMonthLabel] = useState({
    month: Number(defaultDateMonth),
    year: Number(defaultDateYear),
  });

  const onClickChangeMonth = (dir: number) => {
    setStartMonth(startMonth + dir);
    let { month, year } = jaMonthLabel;
    if (month === 12 && dir === 1) {
      month = 1;
      year += 1;
    } else if (month === 1 && dir === -1) {
      month = 12;
      year -= 1;
    } else {
      month += dir;
    }
    setJaMonthLabel({ month, year });
  };

  const handleRangeSelect = (day) => {
    let res = [...dates];
    const { startDate, isSelected } = rangeStart;
    if (!startDate) {
      const startDateIdx = dates.findIndex((date) =>
        DateUtils.isSameDay(date, day)
      );
      const isFromSelected = startDateIdx !== -1;
      if (isFromSelected) {
        res.splice(startDateIdx, 1);
      } else {
        res.push(day);
      }
      setRangeStart({ startDate: day, isSelected: isFromSelected });
    } else {
      const isBeforeFrom = DateUtil.isBefore(day, startDate);
      const selectedRangeDays = isBeforeFrom
        ? getRangeDays(day, startDate)
        : getRangeDays(startDate, day);

      // if range start date is selected, clear range selected dates
      // else override range selected dates
      if (isSelected) {
        selectedRangeDays.forEach((date) => {
          const tempDates = res.filter(
            (selectedDay) => !DateUtils.isSameDay(selectedDay, date)
          );
          res = [...tempDates];
        });
      } else {
        selectedRangeDays.forEach((date) => {
          const tempDates = res.findIndex((selectedDay) =>
            DateUtils.isSameDay(selectedDay, date)
          );
          if (tempDates === -1) {
            res.push(date);
          }
        });
      }
      setRangeStart(initialRangeStart);
    }
    return res;
  };

  const handleDaySelect = (day, selected) => {
    let res = [...dates];
    if (selected) {
      const temp = res.filter(
        (selectedDay) => !DateUtils.isSameDay(selectedDay, day)
      );
      res = [...temp];
    } else {
      res.push(day);
    }
    return res;
  };

  const handleDayClick = (day, { selected }, e) => {
    let selectedDays = [];
    if (e.shiftKey) {
      selectedDays = handleRangeSelect(day);
    } else {
      setRangeStart(initialRangeStart);
      selectedDays = handleDaySelect(day, selected);
    }
    onClickChangeDate(selectedDays);
  };

  const isError = records.length * dates.length > MAX_CLONE_NUMBER;

  useEffect(() => {
    const monthsLabel = document.querySelectorAll('.DayPicker-Caption div');
    if (monthsLabel && language === 'ja') {
      monthsLabel.forEach((obj, idx) => {
        if (idx === 1) {
          let { month, year } = jaMonthLabel;
          if (month === 12) {
            year += 1;
            month = 1;
          } else {
            month += 1;
          }
          obj.textContent = `${year}年${month}月`;
        } else {
          obj.textContent = `${jaMonthLabel.year}年${jaMonthLabel.month}月`;
        }
      });
    }
  });

  return (
    <DialogFrame
      title={msg().Exp_Lbl_CloneSpecifiedDate}
      hide={onClickHideDialogButton}
      className={`${ROOT}__dialog-frame`}
      footer={
        <DialogFrame.Footer>
          <Button type="default" onClick={onClickHideDialogButton}>
            {msg().Com_Btn_Cancel}
          </Button>
          <Button
            type="primary"
            disabled={isEmpty(dates) || isError}
            onClick={onClickCalendarRecordClone}
          >
            {msg().Exp_Lbl_Clone}
          </Button>
        </DialogFrame.Footer>
      }
    >
      <div className={`${ROOT}__inner`}>
        <div className={`${ROOT}-date-select`}>
          <p>{msg().Exp_Lbl_RecordCloneDateSelect}</p>
        </div>
        <div className={`${ROOT}__calender-hint`}>
          <span>{msg().Exp_Lbl_RecordCloneSelectRange}</span>
          <span className={`${ROOT}__calender-hint-day`}>{`${dates.length} ${
            msg().Exp_Lbl_RecordCloneDay
          }`}</span>
        </div>
        <div className={`${ROOT}__error`}>
          {isError && msg().Exp_Msg_CloneRecordsCalendarError}&nbsp;
        </div>
        <div className={`${ROOT}__body`}>
          <Button
            className={`${ROOT}__icon-btn`}
            onClick={() => onClickChangeMonth(-1)}
          >
            <IconArrowLeft
              aria-hidden="true"
              className="slds-button__icon slds-button__icon--small"
            />
          </Button>
          <div className={`${ROOT}__calender`}>
            <DayPicker
              className={`${ROOT}__calender-daypicker`}
              month={new Date(Number(defaultDateYear), startMonth)}
              numberOfMonths={2}
              selectedDays={recordClone.dates}
              onDayClick={handleDayClick as any}
              canChangeMonth={false}
              modifiers={modifiers}
              localeUtils={MomentLocaleUtils}
              locale={language}
            />
          </div>
          <Button
            className={`${ROOT}__icon-btn`}
            onClick={() => onClickChangeMonth(1)}
          >
            <IconArrowRight
              aria-hidden="true"
              className="slds-button__icon slds-button__icon--small"
            />
          </Button>
        </div>
      </div>
    </DialogFrame>
  );
};

export default RecordCloneDateDialog;
