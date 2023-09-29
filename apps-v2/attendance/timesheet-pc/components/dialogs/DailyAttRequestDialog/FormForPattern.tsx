import * as React from 'react';

import styled from 'styled-components';

import msg from '../../../../../commons/languages';
import DateUtil from '../../../../../commons/utils/DateUtil';
import TimeUtil from '../../../../../commons/utils/TimeUtil';
import { CheckBox, Dropdown, Text, TextField } from '../../../../../core';

import { PatternRequest } from '@attendance/domain/models/AttDailyRequest/PatternRequest';
import { AttPattern, DIRECT_INPUT } from '@attendance/domain/models/AttPattern';
import * as RestTime from '@attendance/domain/models/RestTime';

import RangeMark from '../../../images/rangeMark.svg';
import AttTimeRangeField from '../fields/AttTimeRangeField';
import DateRangeField from '../fields/DateRangeField';
import FormRow from './FormRow';
import $createRestTimesFactory from '@attendance/domain/factories/RestTimesFactory';

import './FormForPattern.scss';

const createRestTimesFactory = $createRestTimesFactory();

const ROOT = 'timesheet-pc-dialogs-daily-att-request-dialog-form-for-pattern';
const DAY_TYPE = {
  Workday: 'Workday',
  Holiday: 'Holiday',
};
const S = {
  CheckBoxContainer: styled.div`
    display: flex;
    margin-top: 8px;
  `,
};

export type Props = {
  // state
  isReadOnly: boolean;
  targetRequest: PatternRequest;
  attPatternList: AttPattern[];
  selectedAttPattern: AttPattern | null;
  hasRange: boolean;

  // actions
  onUpdateHasRange: (arg0: boolean) => void;
  onUpdateValue: (
    arg0: keyof PatternRequest,
    arg1: PatternRequest[keyof PatternRequest]
  ) => void;
};
const TimeRange = ({
  startTime,
  endTime,
}: {
  startTime: number | null;
  endTime: number | null;
}) => (
  <div className={`${ROOT}__time-range`}>
    <Text size="large">{TimeUtil.toHHmm(startTime)}</Text>
    <div className={`${ROOT}__range-mark`}>
      <RangeMark />
    </div>
    <Text size="large">{TimeUtil.toHHmm(endTime)}</Text>
  </div>
);

const FormForPattern = (props: Props) => {
  const {
    isReadOnly,
    targetRequest,
    attPatternList,
    hasRange,
    onUpdateHasRange,
    onUpdateValue,
  } = props;
  const selectedAttPattern: AttPattern = props.selectedAttPattern || {
    name: '',
    code: '',
    startTime: null,
    endTime: null,
    restTimes: [],
    workSystem: '',
    flexStartTime: null,
    flexEndTime: null,
    withoutCoreTime: false,
  };
  const minOfEndDate = DateUtil.addDays(targetRequest.startDate, 1);

  const isShowPattern = () => {
    if (targetRequest.requestableDayType === null) {
      return true;
    } else {
      if (targetRequest.requestableDayType === DAY_TYPE.Holiday) {
        if (attPatternList.length === 0) {
          return false;
        } else {
          if (targetRequest.requestDayType === DAY_TYPE.Holiday) {
            return false;
          } else {
            return true;
          }
        }
      } else if (targetRequest.requestableDayType === DAY_TYPE.Workday) {
        return true;
      }
    }
  };
  React.useEffect(() => {
    if (
      targetRequest.requestableDayType === DAY_TYPE.Holiday &&
      attPatternList.length === 0
    ) {
      onUpdateValue('requestDayType', DAY_TYPE.Holiday);
    }
    if (targetRequest.requestableDayType === DAY_TYPE.Workday) {
      onUpdateValue('requestDayType', DAY_TYPE.Workday);
    }
  }, [attPatternList.length, onUpdateValue, targetRequest.requestableDayType]);

  let tempTemplate = null;
  if (targetRequest.requestableDayType === DAY_TYPE.Holiday) {
    tempTemplate = (
      <S.CheckBoxContainer>
        <CheckBox
          checked={
            targetRequest.requestDayType === DAY_TYPE.Holiday ||
            attPatternList.length === 0
          }
          onChange={(e) => {
            if (e.target.checked && !e.target.readOnly) {
              onUpdateValue('requestDayType', DAY_TYPE.Holiday);
            } else if (!e.target.checked && !e.target.readOnly) {
              onUpdateValue('requestDayType', null);
            }
          }}
          disabled={isReadOnly}
          readOnly={attPatternList.length === 0 ? true : isReadOnly}
        >
          {msg().Att_Lbl_ChangeToHoliday}
        </CheckBox>
      </S.CheckBoxContainer>
    );
  }
  const RestTimesFactory = React.useMemo(() => createRestTimesFactory(), []);

  if (targetRequest.requestableDayType === DAY_TYPE.Workday) {
    tempTemplate = <p>{msg().Att_Lbl_ChangeHolidayToWorkday}</p>;
  }

  return (
    <div className={ROOT}>
      <FormRow labelText={msg().Att_Lbl_Period}>
        <DateRangeField
          startDateFieldProps={{
            disabled: true,
            showsIcon: false,
            value: targetRequest.startDate,
            selected: targetRequest.startDate,
            onChange: (value) => onUpdateValue('startDate', value),
          }}
          endDateFieldProps={{
            disabled: isReadOnly,
            showsIcon: !isReadOnly,
            value: targetRequest.endDate,
            selected: targetRequest.endDate,
            minDate: minOfEndDate,
            onChange: (value) => onUpdateValue('endDate', value),
          }}
          onChangeHasRange={onUpdateHasRange}
          hasRange={hasRange}
          disabled={isReadOnly}
          required
        />
      </FormRow>

      {targetRequest.requestableDayType !== null ? (
        <FormRow
          key="requestDayType"
          labelText={msg().Att_Lbl_ChangeDayType}
          height={
            targetRequest.requestableDayType === DAY_TYPE.Workday
              ? 'thin'
              : null
          }
        >
          {tempTemplate}
        </FormRow>
      ) : null}
      {isShowPattern() ? (
        <React.Fragment>
          <FormRow labelText={msg().Att_Lbl_WorkingPattern}>
            <Dropdown
              options={attPatternList.map(({ name, code }) => ({
                label: name,
                value: code,
              }))}
              value={targetRequest.patternCode}
              onSelect={(e) => onUpdateValue('patternCode', e.value)}
              readOnly={isReadOnly}
            />
          </FormRow>

          {(selectedAttPattern.workSystem === 'JP:Modified' ||
            selectedAttPattern.workSystem === 'JP:Fix') &&
          selectedAttPattern.code !== DIRECT_INPUT ? (
            <FormRow labelText={msg().Admin_Lbl_WorkingHours} height="thin">
              <TimeRange
                startTime={selectedAttPattern.startTime}
                endTime={selectedAttPattern.endTime}
              />
            </FormRow>
          ) : null}

          {selectedAttPattern.workSystem === 'JP:Flex' ? (
            <FormRow labelText={msg().Admin_Lbl_FlexHours}>
              <TimeRange
                startTime={selectedAttPattern.flexStartTime}
                endTime={selectedAttPattern.flexEndTime}
              />
            </FormRow>
          ) : null}

          {selectedAttPattern.workSystem === 'JP:Flex' &&
          selectedAttPattern.withoutCoreTime === false ? (
            <FormRow labelText={msg().Admin_Lbl_CoreTime}>
              <TimeRange
                startTime={selectedAttPattern.startTime}
                endTime={selectedAttPattern.endTime}
              />
            </FormRow>
          ) : null}

          {selectedAttPattern.workSystem === 'JP:Discretion' ||
          selectedAttPattern.workSystem === 'JP:Manager' ? (
            <FormRow labelText={msg().Admin_Lbl_WorkingHoursCriterion}>
              <TimeRange
                startTime={selectedAttPattern.startTime}
                endTime={selectedAttPattern.endTime}
              />
            </FormRow>
          ) : null}

          {selectedAttPattern.workSystem !== 'JP:Manager' &&
          selectedAttPattern.code !== DIRECT_INPUT
            ? selectedAttPattern.restTimes.map((restTime, idx) => {
                if (restTime.startTime !== null && restTime.endTime !== null) {
                  return (
                    <FormRow
                      key={idx}
                      labelText={`${msg().Admin_Lbl_WorkingTypeRest}${idx + 1}`}
                      height="thin"
                    >
                      <TimeRange
                        startTime={restTime.startTime}
                        endTime={restTime.endTime}
                      />
                    </FormRow>
                  );
                }
                return null;
              })
            : null}

          {selectedAttPattern.workSystem === 'JP:Manager'
            ? selectedAttPattern.restTimes.map((restTime, idx) => {
                if (restTime.startTime !== null && restTime.endTime !== null) {
                  return (
                    <FormRow
                      key={idx}
                      labelText={`${msg().Admin_Lbl_WorkingTypeRestCriterion}${
                        idx + 1
                      }`}
                    >
                      <TimeRange
                        startTime={restTime.startTime}
                        endTime={restTime.endTime}
                      />
                    </FormRow>
                  );
                }
                return null;
              })
            : null}
        </React.Fragment>
      ) : null}

      {selectedAttPattern.code === DIRECT_INPUT &&
      targetRequest.requestDayType !== DAY_TYPE.Holiday ? (
        <React.Fragment>
          <FormRow labelText={msg().Admin_Lbl_WorkingHours} height="thin">
            <AttTimeRangeField
              startTime={{
                value: TimeUtil.toHHmm(targetRequest.startTime),
                onBlur: (value) =>
                  onUpdateValue('startTime', TimeUtil.parseMinutes(value)),
              }}
              endTime={{
                value: TimeUtil.toHHmm(targetRequest.endTime),
                onBlur: (value) =>
                  onUpdateValue('endTime', TimeUtil.parseMinutes(value)),
              }}
              disabled={isReadOnly}
              required
            />
          </FormRow>
          {targetRequest.patternRestTimes.map(
            (restTime, idx, restTimes: RestTime.RestTimes) => {
              if (
                isReadOnly &&
                restTime.startTime !== null &&
                restTime.endTime !== null
              ) {
                return (
                  <FormRow
                    key={idx}
                    labelText={`${msg().Admin_Lbl_WorkingTypeRest}${idx + 1}`}
                    height="thin"
                  >
                    <AttTimeRangeField
                      startTime={{
                        value: TimeUtil.toHHmm(restTime.startTime),
                        onBlur: (value) =>
                          onUpdateValue(
                            'patternRestTimes',
                            RestTimesFactory.update(restTimes, idx, {
                              ...restTime,
                              startTime: TimeUtil.parseMinutes(value),
                            })
                          ),
                      }}
                      endTime={{
                        value: TimeUtil.toHHmm(restTime.endTime),
                        onBlur: (value) =>
                          onUpdateValue(
                            'patternRestTimes',
                            RestTimesFactory.update(restTimes, idx, {
                              ...restTime,
                              endTime: TimeUtil.parseMinutes(value),
                            })
                          ),
                      }}
                      disabled={isReadOnly}
                    />
                  </FormRow>
                );
              } else if (!isReadOnly) {
                return (
                  <FormRow
                    key={idx}
                    labelText={`${msg().Admin_Lbl_WorkingTypeRest}${idx + 1}`}
                  >
                    <AttTimeRangeField
                      startTime={{
                        value: TimeUtil.toHHmm(restTime.startTime),
                        onBlur: (value) =>
                          onUpdateValue(
                            'patternRestTimes',
                            RestTimesFactory.update(restTimes, idx, {
                              ...restTime,
                              startTime: TimeUtil.parseMinutes(value),
                            })
                          ),
                      }}
                      endTime={{
                        value: TimeUtil.toHHmm(restTime.endTime),
                        onBlur: (value) =>
                          onUpdateValue(
                            'patternRestTimes',
                            RestTimesFactory.update(restTimes, idx, {
                              ...restTime,
                              endTime: TimeUtil.parseMinutes(value),
                            })
                          ),
                      }}
                      disabled={isReadOnly}
                    />
                  </FormRow>
                );
              }
              return null;
            }
          )}
        </React.Fragment>
      ) : null}

      <FormRow labelText={msg().Att_Lbl_Remarks}>
        <TextField
          maxLength={255}
          minRows={3}
          value={targetRequest.remarks || ''}
          onChange={(e) => onUpdateValue('remarks', e.target.value)}
          readOnly={isReadOnly}
        />
      </FormRow>
    </div>
  );
};

export default FormForPattern;
