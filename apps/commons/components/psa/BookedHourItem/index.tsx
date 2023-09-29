import React, { useEffect, useState } from 'react';

import classNames from 'classnames';

import TextField from '@apps/commons/components/fields/TextField';
import { floorToOneDecimal } from '@apps/commons/utils/psa/resourcePlannerUtil';

import { RoleStatus } from '@apps/domain/models/psa/RoleStatus';

import './index.scss';

type Props = {
  activityTitle: string;
  assignmentStatus: string;
  availableHours: Array<Array<number>>;
  bookedHours?: Array<Array<number>>;
  currentDateIndicator?: Array<boolean>;
  hideTotalHours?: boolean;
  isCustomSchedule?: boolean;
  outOfRangeArray: Array<boolean>;
  projectTitle?: string;
  setCustomHours?: (customHours: Array<number>) => void;
  testId: string;
  totalAvailableHours: number;
};

const ROOT = 'ts-psa__resource-planner__resource-list-item';

const BookedHourItem = (props: Props) => {
  const [customHours, setCustomHours] = useState([]);

  const { assignmentStatus } = props;
  const isNonProject = assignmentStatus === '-';
  const isConfirmed = assignmentStatus === RoleStatus.Confirmed;
  const isInProgress = assignmentStatus === RoleStatus.InProgress;
  const isSoftBooked = assignmentStatus === RoleStatus.SoftBooked;
  const isCompleted = assignmentStatus === RoleStatus.Completed;

  const [column1, setColumn1] = useState('');
  const [column2, setColumn2] = useState('');
  const [column3, setColumn3] = useState('');
  const [column4, setColumn4] = useState('');
  const [column5, setColumn5] = useState('');
  const [column6, setColumn6] = useState('');
  const [column7, setColumn7] = useState('');
  const [column8, setColumn8] = useState('');
  const [column9, setColumn9] = useState('');
  const [column10, setColumn10] = useState('');
  const [column11, setColumn11] = useState('');
  const [column12, setColumn12] = useState('');

  const processHour = (minutes) => {
    if (+minutes === -1) return 0;
    const hour = +minutes > 0 ? floorToOneDecimal(+minutes / 60) : minutes;
    return hour;
  };

  useEffect(() => {
    if (props.availableHours && props.availableHours[0]) {
      setCustomHours(props.availableHours[0]);
      setColumn1('' + processHour(props.availableHours[0][0]));
      setColumn3('' + processHour(props.availableHours[0][2]));
      setColumn2('' + processHour(props.availableHours[0][1]));
      setColumn4('' + processHour(props.availableHours[0][3]));
      setColumn5('' + processHour(props.availableHours[0][4]));
      setColumn6('' + processHour(props.availableHours[0][5]));
      setColumn7('' + processHour(props.availableHours[0][6]));
      setColumn8('' + processHour(props.availableHours[0][7]));
      setColumn9('' + processHour(props.availableHours[0][8]));
      setColumn10('' + processHour(props.availableHours[0][9]));
      setColumn11('' + processHour(props.availableHours[0][10]));
      setColumn12('' + processHour(props.availableHours[0][11]));
    }
  }, [props.availableHours]);

  useEffect(() => {
    if (!props.isCustomSchedule) {
      if (column1 === '') {
        setColumn1('0');
      }
      if (column2 === '') {
        setColumn2('0');
      }
      if (column3 === '') {
        setColumn3('0');
      }
      if (column4 === '') {
        setColumn4('0');
      }
      if (column5 === '') {
        setColumn5('0');
      }
      if (column6 === '') {
        setColumn6('0');
      }
      if (column7 === '') {
        setColumn7('0');
      }
      if (column8 === '') {
        setColumn8('0');
      }
      if (column9 === '') {
        setColumn9('0');
      }
      if (column10 === '') {
        setColumn10('0');
      }
      if (column11 === '') {
        setColumn11('0');
      }
      if (column12 === '') {
        setColumn12('0');
      }
    }
  }, [props.isCustomSchedule]);

  const dynFunctions: any = [];
  dynFunctions.setColumn1 = (arg1) => setColumn1(arg1);
  dynFunctions.setColumn2 = (arg1) => setColumn2(arg1);
  dynFunctions.setColumn3 = (arg1) => setColumn3(arg1);
  dynFunctions.setColumn4 = (arg1) => setColumn4(arg1);
  dynFunctions.setColumn5 = (arg1) => setColumn5(arg1);
  dynFunctions.setColumn6 = (arg1) => setColumn6(arg1);
  dynFunctions.setColumn7 = (arg1) => setColumn7(arg1);
  dynFunctions.setColumn8 = (arg1) => setColumn8(arg1);
  dynFunctions.setColumn9 = (arg1) => setColumn9(arg1);
  dynFunctions.setColumn10 = (arg1) => setColumn10(arg1);
  dynFunctions.setColumn11 = (arg1) => setColumn11(arg1);
  dynFunctions.setColumn12 = (arg1) => setColumn12(arg1);

  const onChangeCustomHour = (hour, index) => {
    if (hour === '') {
      customHours[index] = '';
      setCustomHours(customHours);
      dynFunctions[`setColumn${index + 1}`](hour);
    } else if (hour.match(/^$|^([0-9]|1[012])(\.\d{0,1})?$/)) {
      if (+hour > 12) {
        hour = '12';
      }
      if (hour.match(/^\d*(\.\d+)?$/)) {
        customHours[index] = Math.ceil(hour * 60);
        setCustomHours(customHours);
        props.setCustomHours(customHours);
        dynFunctions[`setColumn${index + 1}`](hour);
      } else {
        customHours[index] = Math.ceil(hour * 60);
        setCustomHours(customHours);
        dynFunctions[`setColumn${index + 1}`](hour);
      }
    }
  };

  const getFontColor = (minutes, index) => {
    let fontColor = '';
    if (props.bookedHours) {
      if (minutes !== props.bookedHours[0][index]) {
        fontColor = 'is-edited';
      }
      if (minutes === -1 && props.bookedHours[0][index] === 0) {
        fontColor = '';
      }
    }
    return fontColor;
  };
  const renderFirstColumn = (
    <div className={`${ROOT}__first-column`}>
      <div className={`${ROOT}__resource-item-info`}>
        <span className={`${ROOT}__resource-item-info__first-row`}>
          {props.projectTitle}
        </span>
        <span className={`${ROOT}__resource-item-info__second-row`}>
          {props.activityTitle}
        </span>
      </div>
    </div>
  );

  return (
    <div className={`${ROOT}`} data-testid={props.testId}>
      <div className={`${ROOT}__resources`}>{renderFirstColumn}</div>
      <div className={`${ROOT}__values`}>
        {!props.hideTotalHours && (
          <div className={`${ROOT}__total-hours`}>
            {floorToOneDecimal(props.totalAvailableHours / 60)}
          </div>
        )}
        {!props.isCustomSchedule &&
          props.availableHours &&
          props.availableHours[0] !== undefined &&
          props.availableHours.map((hours) =>
            hours.map((minutes, index) => {
              const hour = minutes === -1 ? 0 : minutes / 60;
              const isNonProjectAndNotAvailable = isNonProject && minutes === 0;
              const isOutOfRange =
                props.outOfRangeArray[index] || isNonProjectAndNotAvailable;
              const isToday =
                props.currentDateIndicator && props.currentDateIndicator[index];
              const isNotAvailable =
                minutes === -1 || isNonProjectAndNotAvailable;
              const isFullyBooked = hour === 0;
              let hourDisplay: any = isOutOfRange ? '-' : hour;
              if (hour && hour > 0) {
                hourDisplay = minutes / 60;
              }
              if (!isNaN(hourDisplay)) {
                hourDisplay = floorToOneDecimal(hourDisplay);
              }
              const bookedColorCSS = classNames({
                'is-notAvailable':
                  isOutOfRange || isNotAvailable || isFullyBooked,
                'is-confirmed': isConfirmed || isInProgress || isCompleted,
                'is-softBooked': isSoftBooked,
                'is-nonProject': isNonProject,
              });

              return (
                <span
                  className={`${ROOT}__background ${isToday && 'is-today'}`}
                >
                  <span
                    className={`${ROOT}__booked-hour-value ${bookedColorCSS}`}
                  >
                    {hourDisplay}
                  </span>
                </span>
              );
            })
          )}
        {props.isCustomSchedule && (
          <>
            <span className={`${ROOT}__background`}>
              <TextField
                disabled={props.outOfRangeArray[0]}
                className={`${ROOT}__custom-booked-hour-value ${getFontColor(
                  customHours[0],
                  0
                )}`}
                type={'text'}
                value={column1}
                onChange={(e) => onChangeCustomHour(e.target.value, 0)}
              />
            </span>
            <span className={`${ROOT}__background`}>
              <TextField
                disabled={props.outOfRangeArray[1]}
                className={`${ROOT}__custom-booked-hour-value ${getFontColor(
                  customHours[1],
                  1
                )}`}
                type={'text'}
                value={column2}
                onChange={(e) => onChangeCustomHour(e.target.value, 1)}
              />
            </span>
            <span className={`${ROOT}__background`}>
              <TextField
                disabled={props.outOfRangeArray[2]}
                className={`${ROOT}__custom-booked-hour-value ${getFontColor(
                  customHours[2],
                  2
                )}`}
                type={'text'}
                value={column3}
                onChange={(e) => onChangeCustomHour(e.target.value, 2)}
              />
            </span>
            <span className={`${ROOT}__background`}>
              <TextField
                disabled={props.outOfRangeArray[3]}
                className={`${ROOT}__custom-booked-hour-value ${getFontColor(
                  customHours[3],
                  3
                )}`}
                type={'text'}
                value={column4}
                onChange={(e) => onChangeCustomHour(e.target.value, 3)}
              />
            </span>
            <span className={`${ROOT}__background`}>
              <TextField
                disabled={props.outOfRangeArray[4]}
                className={`${ROOT}__custom-booked-hour-value ${getFontColor(
                  customHours[4],
                  4
                )}`}
                type={'text'}
                value={column5}
                onChange={(e) => onChangeCustomHour(e.target.value, 4)}
              />
            </span>
            <span className={`${ROOT}__background`}>
              <TextField
                disabled={props.outOfRangeArray[5]}
                className={`${ROOT}__custom-booked-hour-value ${getFontColor(
                  customHours[5],
                  5
                )}`}
                type={'text'}
                value={column6}
                onChange={(e) => onChangeCustomHour(e.target.value, 5)}
              />
            </span>
            <span className={`${ROOT}__background`}>
              <TextField
                disabled={props.outOfRangeArray[6]}
                className={`${ROOT}__custom-booked-hour-value ${getFontColor(
                  customHours[6],
                  6
                )}`}
                type={'text'}
                value={column7}
                onChange={(e) => onChangeCustomHour(e.target.value, 6)}
              />
            </span>
            <span className={`${ROOT}__background`}>
              <TextField
                disabled={props.outOfRangeArray[7]}
                className={`${ROOT}__custom-booked-hour-value ${getFontColor(
                  customHours[7],
                  7
                )}`}
                type={'text'}
                value={column8}
                onChange={(e) => onChangeCustomHour(e.target.value, 7)}
              />
            </span>
            <span className={`${ROOT}__background`}>
              <TextField
                disabled={props.outOfRangeArray[8]}
                className={`${ROOT}__custom-booked-hour-value ${getFontColor(
                  customHours[8],
                  8
                )}`}
                type={'text'}
                value={column9}
                onChange={(e) => onChangeCustomHour(e.target.value, 8)}
              />
            </span>
            <span className={`${ROOT}__background`}>
              <TextField
                disabled={props.outOfRangeArray[9]}
                className={`${ROOT}__custom-booked-hour-value ${getFontColor(
                  customHours[9],
                  9
                )}`}
                type={'text'}
                value={column10}
                onChange={(e) => onChangeCustomHour(e.target.value, 9)}
              />
            </span>
            <span className={`${ROOT}__background`}>
              <TextField
                disabled={props.outOfRangeArray[10]}
                className={`${ROOT}__custom-booked-hour-value ${getFontColor(
                  customHours[10],
                  10
                )}`}
                type={'text'}
                value={column11}
                onChange={(e) => onChangeCustomHour(e.target.value, 10)}
              />
            </span>
            <span className={`${ROOT}__background`}>
              <TextField
                disabled={props.outOfRangeArray[11]}
                className={`${ROOT}__custom-booked-hour-value ${getFontColor(
                  customHours[11],
                  11
                )}`}
                type={'text'}
                value={column12}
                onChange={(e) => onChangeCustomHour(e.target.value, 11)}
              />
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default BookedHourItem;
