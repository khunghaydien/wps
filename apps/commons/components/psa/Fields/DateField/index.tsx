import React from 'react';
import ReactDOM from 'react-dom';

import moment, { Moment } from 'moment';

import msg from '@apps/commons/languages/index';

import CalendarIcon from '../../../../images/icons/calendar.svg';
import DateField from '../../../fields/DateField';

import './index.scss';

const ROOT = 'ts-psa__date-field';

type Props = {
  className?: string;
  dataTestId?: string;
  disabled?: boolean;
  maxDate?: Moment; // YYYY-MM-DD
  minDate?: Moment; // YYYY-MM-DD
  onChange?: Function;
  placeholder?: string;
  required?: boolean;
  value: string;
  enableValidation?: boolean;
  isResetted?: boolean;
  doRefresh?: number;
};

/**
 * This component is extracted so that can be reusable
 * It simply served as a wrapper to add the calendarIcon to the DateField
 */
const PsaDateField = ({
  className = '',
  dataTestId = '',
  disabled = false,
  required = false,
  placeholder = '',
  value,
  onChange,
  minDate,
  maxDate,
  enableValidation,
  isResetted,
  doRefresh,
}: Props) => {
  // Needed to show popper inside the dialog. See https://github.com/Hacker0x01/react-datepicker/issues/1366
  const $el = document.querySelector('body');

  const PopperContainer = ({ children }) =>
    ReactDOM.createPortal(children, $el);

  const [date, setDate] = React.useState(value);
  const [isDateValid, setIsDateValid] = React.useState(true);

  React.useEffect(() => {
    if (isResetted) {
      setDate(value);
      setIsDateValid(true);
    }
  }, [value, doRefresh]);

  const onChangeLocal = (e) => {
    const selectedDate = e.trim();
    setDate(selectedDate);
    if (enableValidation) {
      // for those where formik validation is not present
      const isDateUsedValid = moment(
        selectedDate,
        ['YYYY-MM-DD', 'YYYY/M/D', 'L', 'MM/DD/YYYY'],
        true
      ).isValid();

      if (isDateUsedValid) {
        setIsDateValid(true);
        onChange(selectedDate);
      } else if (!isDateUsedValid && e !== '') {
        setIsDateValid(false);
      } else if (!isDateUsedValid && e === '') {
        setIsDateValid(true);
        onChange(selectedDate);
      }
    } else {
      // formik will handle the errors.
      onChange(selectedDate);
    }
  };

  return (
    <React.Fragment>
      <div className={`${ROOT}__container`}>
        <DateField
          className={className}
          data-test-id={dataTestId}
          disabled={disabled}
          checkDateFormat
          maxDate={maxDate}
          minDate={minDate}
          onChange={onChangeLocal}
          placeholder={placeholder}
          popperClassName={`${ROOT}__popper`}
          popperContainer={PopperContainer}
          required={required}
          value={date}
        />
        <div className={`${ROOT}__calendar-icon-wrapper`}>
          <CalendarIcon className={`${ROOT}__calendar-icon-body`} />
        </div>
      </div>
      {!isDateValid && (
        <div className={`${ROOT}__error`}>{msg().Psa_Lbl_InvalidDate}</div>
      )}
    </React.Fragment>
  );
};

export default PsaDateField;
