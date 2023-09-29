import * as React from 'react';

import classNames from 'classnames';
import isNil from 'lodash/isNil';

import msg from '../../../../commons/languages';
import TimeUtil from '../../../../commons/utils/TimeUtil';

import Icon from '../../atoms/Icon';

import './DailyTaskHeader.scss';

const ROOT = 'mobile-app-organisms-tracking-daily-task-header';

type Props = Readonly<{
  includesNonDirectInputTask: boolean;
  isTemporaryWorkTime: boolean;
  timeOfAttendance: number | null;
  timeOfTimeTracking: number | null;
  totalRatio: number;
}>;

const getTextColor = (number: number | null): 'disable' | 'primary' => {
  return number !== 0 ? 'primary' : 'disable';
};

const DailyTaskHeader = React.memo<Props>((props) => {
  const formattedTimeTracking = React.useMemo(() => {
    return !isNil(props.timeOfTimeTracking)
      ? TimeUtil.toHHmm(props.timeOfTimeTracking)
      : '-';
  }, [props.timeOfTimeTracking]);

  const formattedAttendance = React.useMemo(() => {
    return TimeUtil.toHHmm(props.timeOfAttendance);
  }, [props.timeOfAttendance]);

  const totalRatio = React.useMemo(() => {
    return props.includesNonDirectInputTask ? props.totalRatio : '- ';
  }, [props.includesNonDirectInputTask, props.totalRatio]);

  const isFull = React.useMemo(() => {
    return props.totalRatio === 100;
  }, [props.totalRatio]);

  const textClassNames = classNames(
    `${ROOT}__text`,
    `${ROOT}__text--strong`,
    `${ROOT}__text--fix`
  );

  const timeTrackingClassNames = classNames(
    textClassNames,
    `${ROOT}__text--${getTextColor(props.timeOfTimeTracking)}`
  );

  const attendanceClassNames = classNames(
    textClassNames,
    `${ROOT}__text--${getTextColor(props.timeOfAttendance)}`
  );

  const ratioClassNames = classNames(`${ROOT}__text--strong`, {
    [`${ROOT}__text--error`]: props.includesNonDirectInputTask && !isFull,
  });

  return (
    <div className={ROOT}>
      <div className={`${ROOT}__time`}>
        <span className={`${ROOT}__label`}>
          <span>{msg().Trac_Lbl_TimeOfTimeTracking}:&nbsp;</span>
          <span className={timeTrackingClassNames}>
            {formattedTimeTracking}
          </span>
        </span>
        {!isNil(props.timeOfAttendance) && (
          <span className={`${ROOT}__label`}>
            <span>
              {props.isTemporaryWorkTime
                ? msg().Cal_Lbl_TemporaryWorkHours
                : msg().Trac_Lbl_TimeOfAttendance}
              :&nbsp;
            </span>
            <span className={attendanceClassNames}>{formattedAttendance}</span>
          </span>
        )}
      </div>
      <div className={`${ROOT}__percentage`}>
        <span className={`${ROOT}__label`}>
          {msg().Trac_Lbl_PercentageTotal}
        </span>
        <div className={`${ROOT}__icon-text`}>
          {props.includesNonDirectInputTask && !isFull && (
            <div className={`${ROOT}__icon`}>
              <Icon type="alert" color="#C23934" />
            </div>
          )}
          <span className={ratioClassNames}>{totalRatio}%</span>
        </div>
      </div>
    </div>
  );
});

export default DailyTaskHeader;
