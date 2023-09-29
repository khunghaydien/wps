import * as React from 'react';

import classNames from 'classnames';

import msg from '../../../../commons/languages';
import { parseIntOrNull } from '../../../../commons/utils/NumberUtil';
import TextUtil from '../../../../commons/utils/TextUtil';
import NumberField from '../../molecules/commons/Fields/NumberField';

import { RestTimes } from '../../../../domain/models/attendance/RestTime';

import TextButton from '../../atoms/TextButton';
import AttTimeSelectRangeField, {
  Props as AttTimeSelectRangeFieldProps,
} from '../../molecules/attendance/AttTimeSelectRangeField';
import RestTimeItem from '../../molecules/attendance/RestTimeItem';

import './AttTimeList.scss';

const ROOT = 'mobile-app-components-organisms-attendance-att-time-list';

type Props = Readonly<{
  className?: string;
  readOnly?: boolean;
  workingTime: AttTimeSelectRangeFieldProps;
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
    // required?: boolean,
    // errors?: string[],
    onChangeValueStartTime?: (
      arg0: number,
      arg1: number | null,
      arg2: number | null
    ) => void;
    onChangeValueEndTime?: (
      arg0: number,
      arg1: number | null,
      arg2: number | null
    ) => void;
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

export default class AttTimeList extends React.PureComponent<Props> {
  render() {
    const className = classNames(ROOT, this.props.className);
    const { readOnly, workingTime, restTimes, otherRestTime } = this.props;

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
        {restTimes.value &&
          restTimes.value.map((restTime, idx: number, arr: Array<any>) => (
            <div key={idx} className={`${ROOT}__item`}>
              {/* @ts-ignore */}
              <RestTimeItem
                className={`${ROOT}__rest-times-${idx + 1}`}
                label={TextUtil.template(msg().Att_Lbl_RestTime, idx + 1)}
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
                  onChangeValue: (fromValue, toValue) => {
                    const { onChangeValueStartTime } = restTimes;
                    if (onChangeValueStartTime) {
                      onChangeValueStartTime(idx, fromValue, toValue);
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
                  onChangeValue: (fromValue, toValue) => {
                    const { onChangeValueEndTime } = restTimes;
                    if (onChangeValueEndTime) {
                      onChangeValueEndTime(idx, fromValue, toValue);
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
              <TextButton
                onClick={
                  // FIXME
                  // eslint-disable-next-line @typescript-eslint/no-empty-function
                  restTimes.onClickAdd || (() => {})
                }
                disabled={restTimes.readOnly || readOnly}
              >
                +{msg().Att_Lbl_AddRestTime}
              </TextButton>
            )}
        </div>
        {otherRestTime && (
          <div className={`${ROOT}__item`}>
            <NumberField
              className={`${ROOT}__other-rest-time`}
              label={msg().Att_Lbl_OtherRestTimeWithMinutes}
              value={String(otherRestTime.value)}
              onChange={(event: React.SyntheticEvent<any>) => {
                const { onChange } = otherRestTime;
                if (onChange) {
                  onChange(parseIntOrNull(event.currentTarget.value));
                }
              }}
              required={otherRestTime.required}
              readOnly={otherRestTime.readOnly || readOnly}
              errors={otherRestTime.errors}
            />
          </div>
        )}
      </div>
    );
  }
}
