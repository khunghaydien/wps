import * as React from 'react';

import { DAY_TYPE } from '../../../../constants/timesheet';

import msg from '../../../../../commons/languages';
import DateUtil from '../../../../../commons/utils/DateUtil';
import TimeUtil from '../../../../../commons/utils/TimeUtil';
import DateRangeField from '../../../molecules/commons/Fields/DateRangeField';
import SelectField from '../../../molecules/commons/Fields/SelectField';
import TextAreaField from '../../../molecules/commons/Fields/TextAreaField';

import { PatternRequest } from '@attendance/domain/models/AttDailyRequest/PatternRequest';
import { AttPattern, DIRECT_INPUT } from '@attendance/domain/models/AttPattern';
import * as RestTime from '@attendance/domain/models/RestTime';

import Layout from '../../../../containers/organisms/attendance/DailyRequestDetailLayoutContainer';

import AttTimeSelectRangeField from '../../../molecules/attendance/AttTimeSelectRangeField';
import DayTypeToggleButton from '../../../molecules/attendance/DayTypeToggleButton';
import $createRestTimesFactory from '@attendance/domain/factories/RestTimesFactory';

import './PatternRequestPage.scss';

const createRestTimesFactory = $createRestTimesFactory();

const ROOT =
  'mobile-app-pages-attendance-daily-request-details-pattern-request-page';

export type Props = Readonly<{
  readOnly: boolean;
  request: PatternRequest;
  selectedAttPattern: AttPattern;
  validation: {
    [key: string]: string[];
  };
  patternOptions: {
    label: string;
    value: string;
  }[];
  onChangeStartDate: (arg0: string) => void;
  onChangeEndDate: (arg0: string) => void;
  onChangePatternCode: (arg0: string) => void;
  onChangeRemarks: (arg0: string) => void;
  onChangeSwitchWorkDayToHoliday: (
    arg0: PatternRequest[keyof PatternRequest]
  ) => void;
  onUpdate: (
    arg0: keyof PatternRequest,
    arg1: PatternRequest[keyof PatternRequest]
  ) => void;
}>;

export default class PatternRequestPage extends React.Component<Props> {
  componentDidMount() {
    const { request, patternOptions, onChangeSwitchWorkDayToHoliday } =
      this.props;
    if (
      request.requestableDayType === DAY_TYPE.Holiday &&
      patternOptions.length === 0
    ) {
      onChangeSwitchWorkDayToHoliday(DAY_TYPE.Holiday);
    }
    if (request.requestableDayType === DAY_TYPE.Workday) {
      onChangeSwitchWorkDayToHoliday(DAY_TYPE.Workday);
    }
  }

  componentDidUpdate(preProps: Props) {
    const { request, patternOptions, onChangeSwitchWorkDayToHoliday } =
      this.props;
    if (preProps.request.requestableDayType !== request.requestableDayType) {
      if (
        request.requestableDayType === DAY_TYPE.Holiday &&
        patternOptions.length === 0
      ) {
        onChangeSwitchWorkDayToHoliday(DAY_TYPE.Holiday);
      }
      if (request.requestableDayType === DAY_TYPE.Workday) {
        onChangeSwitchWorkDayToHoliday(DAY_TYPE.Workday);
      }
    }
  }

  isShowPattern = (props: Props) => {
    const { request, patternOptions } = props;
    if (request.requestableDayType === null) {
      return true;
    } else {
      if (request.requestableDayType === DAY_TYPE.Holiday) {
        if (patternOptions.length === 0) {
          return false;
        } else {
          if (request.requestDayType === DAY_TYPE.Holiday) {
            return false;
          } else {
            return true;
          }
        }
      } else if (request.requestableDayType === DAY_TYPE.Workday) {
        return true;
      }
    }
  };

  RestTimesFactory = () => createRestTimesFactory();

  selectedAttPattern: AttPattern = this.props.selectedAttPattern || {
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

  render() {
    const {
      readOnly,
      request,
      validation,
      patternOptions,
      onChangeStartDate,
      onChangeEndDate,
      onChangePatternCode,
      onChangeRemarks,
      onChangeSwitchWorkDayToHoliday,
      onUpdate,
    } = this.props;

    const selectedAttPattern: AttPattern = this.props.selectedAttPattern || {
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

    return (
      <div className={ROOT}>
        <Layout>
          <div className={`${ROOT}__item`}>
            <DateRangeField
              label={msg().Att_Lbl_Period}
              start={{
                readOnly,
                disabled: !readOnly,
                value: request.startDate,
                onChange: (e: React.ChangeEvent<HTMLElement>, { date }) =>
                  onChangeStartDate(DateUtil.fromDate(date)),
                errors: validation.startDate,
              }}
              end={{
                readOnly,
                value: request.endDate,
                onChange: (e: React.ChangeEvent<HTMLElement>, { date }) =>
                  onChangeEndDate(DateUtil.fromDate(date)),
                errors: validation.endDate,
              }}
              required
            />
          </div>
          <div className={`${ROOT}__item`}>
            {request.requestableDayType ? (
              <DayTypeToggleButton
                label={msg().Att_Lbl_ChangeDayType}
                readOnly={patternOptions.length === 0 || readOnly}
                requestableDayType={request.requestableDayType}
                value={
                  request.requestDayType === DAY_TYPE.Holiday ||
                  patternOptions.length === 0
                }
                onChange={(value) => {
                  if (patternOptions.length === 0 || readOnly) {
                    return false;
                  } else {
                    onChangeSwitchWorkDayToHoliday(
                      value ? DAY_TYPE.Holiday : null
                    );
                  }
                }}
              />
            ) : null}
          </div>
          {this.isShowPattern(this.props) ? (
            <div>
              <div className={`${ROOT}__item`}>
                <SelectField
                  className={`${ROOT}__patterns`}
                  label={msg().Att_Lbl_WorkingPattern}
                  options={patternOptions || []}
                  readOnly={readOnly}
                  value={request.patternCode}
                  onChange={(e) => onChangePatternCode(e.currentTarget.value)}
                  errors={validation.patternCode}
                  required
                />
              </div>

              {(selectedAttPattern.workSystem === 'JP:Modified' ||
                selectedAttPattern.workSystem === 'JP:Fix') &&
              selectedAttPattern.code !== DIRECT_INPUT ? (
                <div className={`${ROOT}__item`}>
                  <AttTimeSelectRangeField
                    className={`${ROOT}__times`}
                    from={{
                      label: msg().Admin_Lbl_WorkingTypeStartTime,
                      value: selectedAttPattern.startTime,
                    }}
                    to={{
                      label: msg().Admin_Lbl_WorkingTypeEndTime,
                      value: selectedAttPattern.endTime,
                    }}
                    errors={validation.startTime || validation.endTime}
                    readOnly={readOnly}
                    disabled={!readOnly}
                  />
                </div>
              ) : null}

              {selectedAttPattern.workSystem === 'JP:Flex' ? (
                <div className={`${ROOT}__item`}>
                  <AttTimeSelectRangeField
                    className={`${ROOT}__times`}
                    label={msg().Admin_Lbl_FlexHours}
                    from={{
                      value: selectedAttPattern.flexStartTime,
                    }}
                    to={{
                      value: selectedAttPattern.flexEndTime,
                    }}
                    errors={validation.flexStartTime || validation.flexEndTime}
                    readOnly={readOnly}
                    disabled={!readOnly}
                  />
                </div>
              ) : null}

              {selectedAttPattern.workSystem === 'JP:Flex' &&
              selectedAttPattern.withoutCoreTime === false ? (
                <div className={`${ROOT}__item`}>
                  <AttTimeSelectRangeField
                    className={`${ROOT}__times`}
                    label={msg().Admin_Lbl_CoreTime}
                    from={{
                      value: selectedAttPattern.startTime,
                    }}
                    to={{
                      value: selectedAttPattern.endTime,
                    }}
                    errors={validation.startTime || validation.endTime}
                    readOnly={readOnly}
                    disabled={!readOnly}
                  />
                </div>
              ) : null}

              {selectedAttPattern.workSystem === 'JP:Discretion' ||
              selectedAttPattern.workSystem === 'JP:Manager' ? (
                <div className={`${ROOT}__item`}>
                  <AttTimeSelectRangeField
                    className={`${ROOT}__times`}
                    label={msg().Admin_Lbl_WorkingHoursCriterion}
                    from={{
                      value: selectedAttPattern.startTime,
                    }}
                    to={{
                      value: selectedAttPattern.endTime,
                    }}
                    errors={validation.startTime || validation.endTime}
                    readOnly={readOnly}
                    disabled={!readOnly}
                  />
                </div>
              ) : null}

              {selectedAttPattern.workSystem !== 'JP:Manager' &&
              selectedAttPattern.code !== DIRECT_INPUT
                ? selectedAttPattern.restTimes &&
                  selectedAttPattern.restTimes.map((restTime, idx: number) => {
                    if (
                      restTime.startTime !== null &&
                      restTime.endTime !== null
                    ) {
                      return (
                        <div key={idx} className={`${ROOT}__item`}>
                          <AttTimeSelectRangeField
                            className={`${ROOT}__times`}
                            label={`${msg().Admin_Lbl_WorkingTypeRest}${
                              idx + 1
                            }`}
                            from={{
                              value: restTime.startTime,
                            }}
                            to={{
                              value: restTime.endTime,
                            }}
                            readOnly={readOnly}
                            disabled={!readOnly}
                          />
                        </div>
                      );
                    }
                    return null;
                  })
                : null}

              {selectedAttPattern.workSystem === 'JP:Manager'
                ? selectedAttPattern.restTimes &&
                  selectedAttPattern.restTimes.map((restTime, idx: number) => {
                    if (
                      restTime.startTime !== null &&
                      restTime.endTime !== null
                    ) {
                      return (
                        <div key={idx} className={`${ROOT}__item`}>
                          <AttTimeSelectRangeField
                            className={`${ROOT}__times`}
                            label={`${
                              msg().Admin_Lbl_WorkingTypeRestCriterion
                            }${idx + 1}`}
                            from={{
                              value: restTime.startTime,
                            }}
                            to={{
                              value: restTime.endTime,
                            }}
                            readOnly={readOnly}
                            disabled={!readOnly}
                          />
                        </div>
                      );
                    }
                    return null;
                  })
                : null}
            </div>
          ) : null}

          {selectedAttPattern.code === DIRECT_INPUT &&
          request.requestDayType !== DAY_TYPE.Holiday ? (
            <div>
              <div className={`${ROOT}__item`}>
                <AttTimeSelectRangeField
                  className={`${ROOT}__times`}
                  from={{
                    label: msg().Admin_Lbl_WorkingTypeStartTime,
                    value: request.startTime,
                    onChangeValue: (startTime, _endTime) => {
                      onUpdate('startTime', startTime);
                    },
                  }}
                  to={{
                    label: msg().Admin_Lbl_WorkingTypeEndTime,
                    value: request.endTime,
                    onChangeValue: (_startTime, endTime) => {
                      onUpdate('endTime', endTime);
                    },
                  }}
                  required
                  errors={validation.startTime || validation.endTime}
                  disabled={readOnly}
                />
              </div>
              {request.patternRestTimes.map(
                (restTime, idx, restTimes: RestTime.RestTimes) => {
                  if (
                    readOnly &&
                    restTime.startTime !== null &&
                    restTime.endTime !== null
                  ) {
                    return (
                      <div key={idx} className={`${ROOT}__item`}>
                        <AttTimeSelectRangeField
                          className={`${ROOT}__times`}
                          label={`${msg().Admin_Lbl_WorkingTypeRest}${idx + 1}`}
                          from={{
                            value: restTime.startTime,
                            onChangeValue: (startTime, _endTime) => {
                              onUpdate(
                                'patternRestTimes',
                                this.RestTimesFactory().update(restTimes, idx, {
                                  ...restTime,
                                  startTime: TimeUtil.parseMinutes(startTime),
                                })
                              );
                            },
                          }}
                          to={{
                            value: restTime.endTime,
                            onChangeValue: (_startTime, endTime) => {
                              onUpdate(
                                'patternRestTimes',
                                this.RestTimesFactory().update(restTimes, idx, {
                                  ...restTime,
                                  endTime: TimeUtil.parseMinutes(endTime),
                                })
                              );
                            },
                          }}
                          disabled={readOnly}
                        />
                      </div>
                    );
                  } else if (!readOnly) {
                    return (
                      <div className={`${ROOT}__item`}>
                        <AttTimeSelectRangeField
                          className={`${ROOT}__times`}
                          label={`${msg().Admin_Lbl_WorkingTypeRest}${idx + 1}`}
                          from={{
                            value: restTime.startTime,
                            onChangeValue: (startTime, _endTime) => {
                              onUpdate(
                                'patternRestTimes',
                                this.RestTimesFactory().update(restTimes, idx, {
                                  ...restTime,
                                  startTime: TimeUtil.parseMinutes(startTime),
                                })
                              );
                            },
                          }}
                          to={{
                            value: restTime.endTime,
                            onChangeValue: (_startTime, endTime) => {
                              onUpdate(
                                'patternRestTimes',
                                this.RestTimesFactory().update(restTimes, idx, {
                                  ...restTime,
                                  endTime: TimeUtil.parseMinutes(endTime),
                                })
                              );
                            },
                          }}
                          disabled={readOnly}
                        />
                      </div>
                    );
                  }
                  return null;
                }
              )}
            </div>
          ) : null}

          <div className={`${ROOT}__item`}>
            <TextAreaField
              className={`${ROOT}__remarks`}
              label={msg().Att_Lbl_Remarks}
              rows={3}
              value={request.remarks}
              onChange={(event: React.SyntheticEvent<HTMLTextAreaElement>) =>
                onChangeRemarks(event.currentTarget.value)
              }
              readOnly={readOnly}
              errors={validation.remarks}
            />
          </div>
        </Layout>
      </div>
    );
  }
}
