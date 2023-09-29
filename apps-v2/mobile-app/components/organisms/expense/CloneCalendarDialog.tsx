import React, { useState } from 'react';
import DayPicker, { DateUtils, DayModifiers } from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';

import isEmpty from 'lodash/isEmpty';

import msg from '@commons/languages';
import DateUtil from '@commons/utils/DateUtil';
import Dialog from '@mobile/components/molecules/commons/Dialog';

import 'react-day-picker/lib/style.css';
import './CloneCalendarDialog.scss';

const ROOT = 'mobile-app-organisms-expense-clone-calendar-dialog';
const MAX_CLONE_NUMBER = 20;

export const CALENDAR_CLONE = 'calendarClone';

type Props = {
  language: string;
  isOpen: boolean;
  defaultDate: string;
  closeDialog: (arg0: boolean) => void;
  onClickClone: (selectedDates: string[]) => void;
};

const CloneCalendarDialog = (props: Props) => {
  const [selectedDays, setSelectedDays] = useState([]);

  const closeDialog = () => {
    setSelectedDays([]);
    props.closeDialog(false);
  };

  const handleDayClick = (day: Date, { selected }: DayModifiers) => {
    if (selectedDays.length === MAX_CLONE_NUMBER && !selected) {
      return;
    }
    if (selected) {
      const selectedIndex = selectedDays.findIndex((selected) =>
        DateUtils.isSameDay(selected, day)
      );
      selectedDays.splice(selectedIndex, 1);
    } else {
      selectedDays.push(day);
    }
    setSelectedDays([...selectedDays]);
  };

  const handleClone = () => {
    props.onClickClone(selectedDays);
  };

  const [defaultDateYear, defaultDateMonth] = DateUtil.formatISO8601Date(
    props.defaultDate
  ).split('-');
  const modifiers = {
    defaultDay: new Date(
      Number(defaultDateYear),
      new Date().getMonth(),
      new Date().getDate()
    ),
  };

  const renderCanlender = () => (
    <div className={`${ROOT}__calender`}>
      <DayPicker
        month={new Date(Number(defaultDateYear), Number(defaultDateMonth) - 1)}
        selectedDays={selectedDays}
        onDayClick={handleDayClick}
        modifiers={modifiers}
        localeUtils={MomentLocaleUtils}
        locale={props.language}
      />
    </div>
  );

  const renderContent = () => (
    <div className={`${ROOT}__contents`}>
      <div className={`${ROOT}-date-select`}>
        {msg().Exp_Msg_CloneRecordMobileCalendar}
      </div>
      {renderCanlender()}
      <div className={`${ROOT}__calender-hint`}>
        {`${selectedDays.length} ${msg().Exp_Lbl_RecordCloneDay}`}
      </div>
    </div>
  );

  return (
    <div className={ROOT}>
      {props.isOpen && (
        <Dialog
          title={msg().Exp_Lbl_CloneSpecifiedDate}
          content={renderContent()}
          leftButtonLabel={msg().Com_Btn_Cancel}
          rightButtonLabel={msg().Exp_Lbl_Clone}
          rightButtonDisabled={isEmpty(selectedDays)}
          onClickCloseButton={closeDialog}
          onClickLeftButton={closeDialog}
          onClickRightButton={handleClone}
        />
      )}
    </div>
  );
};

export default CloneCalendarDialog;
