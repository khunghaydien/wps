import * as React from 'react';

import classNames from 'classnames';

import styled from 'styled-components';

import msg from '../../../../commons/languages';
import { parseIntOrNull } from '../../../../commons/utils/NumberUtil';
import TextUtil from '../../../../commons/utils/TextUtil';

import { RestTimeReason } from '@attendance/domain/models/RestTimeReason';

import {
  RestTime,
  RestTimes,
} from '@mobile/modules/attendance/timesheet/ui/daily/editing';

import TextButton from '../../atoms/TextButton';
import AttTimeSelectRangeField, {
  Props as AttTimeSelectRangeFieldProps,
} from '../../molecules/attendance/AttTimeSelectRangeField';
import OtherRestTime from '../../molecules/attendance/OtherRestTime';
import RestTimeItem from '../../molecules/attendance/RestTimeItem';

import './AttTimeList.scss';

const ROOT = 'mobile-app-components-organisms-attendance-att-time-list';

type Props = Readonly<{
  className?: string;
  readOnly?: boolean;
  workingTime: AttTimeSelectRangeFieldProps;
  restTimeReasons?: RestTimeReason[];
  enabledRestReason?: boolean;
  restTimes: {
    value?: RestTimes;
    min?: number;
    max?: number;
    readOnly?: boolean;
    placeholder?:
      | string
      | string[]
      | {
          startTime: string;
          endTime: string;
        }[];
    defaultValue?:
      | number
      | null
      | Array<number | null>
      | {
          startTime: number | null;
          endTime: number | null;
        }[];
    onChangeValue?: (index: number, value: RestTime | null) => void;
    onClickRemove?: (arg0: number) => void;
    onClickAdd?: () => void;
  };
  otherRestTime?: {
    value: number | null;
    readOnly?: boolean;
    required?: boolean;
    errors?: string[];
    onChange?: (arg0: number | null) => void;
  };
  otherRestReason?: {
    value: RestTimeReason | null;
    readOnly?: boolean;
    required?: boolean;
    errors?: string[];
    onChange?: (arg0: RestTimeReason | null) => void;
  };
}>;

const getRestTimeProp = <T extends string | number | null>(
  value: T | Array<T> | Array<{ startTime: T; endTime: T }> | void,
  idx: number,
  propName: 'startTime' | 'endTime'
): T | void => {
  if (Array.isArray(value)) {
    const obj = value[idx];
    if (obj && typeof obj === 'object') {
      return obj[propName];
    } else {
      // @ts-ignore
      return obj;
    }
  } else {
    return value;
  }
};

const AttTimeList: React.FC<Props> = (props) => {
  const className = classNames(ROOT, props.className);
  const {
    readOnly,
    enabledRestReason,
    workingTime,
    restTimes,
    otherRestTime,
    otherRestReason,
    restTimeReasons,
  } = props;

  const StyledTextButton = styled(TextButton)`
    height: 100%;
    .mobile-app-atoms-text-button__button {
      text-align: left;
      white-space: normal;
    }
  `;
  return (
    <div className={className}>
      <div className={`${ROOT}__item`}>
        <AttTimeSelectRangeField
          {...workingTime}
          from={{
            ...workingTime.from,
            label: msg().Att_Lbl_AttendanceStartTime,
          }}
          to={{
            ...workingTime.to,
            label: msg().Att_Lbl_AttendanceEndTime,
          }}
          className={`${ROOT}__times`}
          readOnly={readOnly}
        />
      </div>
      {restTimes?.value &&
        restTimes?.value.map((restTime, idx: number, arr: Array<any>) => (
          <div key={restTime.id} className={`${ROOT}__item`}>
            {/* @ts-ignore */}
            <RestTimeItem
              className={`${ROOT}__rest-times-${idx + 1}`}
              label={TextUtil.template(msg().Att_Lbl_CustomRestTime, idx + 1)}
              enabledRestReason={enabledRestReason}
              restTimeReasons={restTimeReasons}
              selectedRestReason={
                restTime?.restReason?.code ? restTime.restReason : null
              }
              onUpdateReason={(value: RestTimeReason | null) => {
                const { onChangeValue } = restTimes;
                if (onChangeValue) {
                  onChangeValue(idx, {
                    ...restTime,
                    restReason: value,
                  });
                }
              }}
              placeholder={
                (typeof restTimes.placeholder === 'string' &&
                  restTimes.placeholder) ||
                undefined
              }
              startTime={{
                value: restTime.startTime,
                placeholder: getRestTimeProp<string>(
                  restTimes.placeholder,
                  idx,
                  'startTime'
                ),
                defaultValue: getRestTimeProp<number | null>(
                  restTimes.defaultValue,
                  idx,
                  'startTime'
                ),
                onChangeValue: (fromValue) => {
                  const { onChangeValue } = restTimes;
                  if (onChangeValue) {
                    onChangeValue(idx, {
                      ...restTime,
                      startTime: fromValue,
                    });
                  }
                },
              }}
              endTime={{
                value: restTime.endTime,
                placeholder: getRestTimeProp<string>(
                  restTimes.placeholder,
                  idx,
                  'endTime'
                ),
                defaultValue: getRestTimeProp<number | null>(
                  restTimes.defaultValue,
                  idx,
                  'endTime'
                ),
                onChangeValue: (_, toValue) => {
                  const { onChangeValue } = restTimes;
                  if (onChangeValue) {
                    onChangeValue(idx, {
                      ...restTime,
                      endTime: toValue,
                    });
                  }
                },
              }}
              onClickRemove={() => {
                const { onClickRemove } = restTimes;
                if (onClickRemove) {
                  onClickRemove(idx);
                }
              }}
              isDisabledRemove={
                restTimes.min !== null &&
                restTimes.min !== undefined &&
                arr.length <= restTimes.min
              }
              readOnly={restTimes.readOnly || readOnly}
            />
          </div>
        ))}
      <div className={`${ROOT}__item`}>
        {restTimes.value &&
          (restTimes.max === null ||
            restTimes.max === undefined ||
            restTimes.value.length < restTimes.max) && (
            <StyledTextButton
              onClick={
                // FIXME
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                restTimes.onClickAdd || (() => {})
              }
              disabled={restTimes.readOnly || readOnly}
            >
              +{msg().Att_Lbl_CustomAddRestTime}
            </StyledTextButton>
          )}
      </div>
      {otherRestTime && (
        <div className={`${ROOT}__item`}>
          <OtherRestTime
            className={`${ROOT}__other-rest-time`}
            label={msg().Att_Lbl_OtherRestTimeWithMinutes}
            value={String(otherRestTime.value)}
            onChange={(event: React.SyntheticEvent<any>) => {
              const { onChange } = otherRestTime;
              if (onChange) {
                onChange(parseIntOrNull(event.currentTarget.value));
              }
            }}
            enabledRestReason={enabledRestReason}
            restTimeReasons={restTimeReasons}
            otherRestReason={otherRestReason}
            required={otherRestTime.required}
            readOnly={otherRestTime.readOnly || readOnly}
            errors={otherRestTime.errors}
          />
        </div>
      )}
    </div>
  );
};

export default AttTimeList;
