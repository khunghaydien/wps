import * as React from 'react';

import SelectField from '../../../molecules/commons/Fields/SelectField';
import SFDateField from '../../../molecules/commons/Fields/SFDateField';
import TextAreaField from '../../../molecules/commons/Fields/TextAreaField';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';

import { WORK_SYSTEM_TYPE } from '@apps/attendance/domain/models/WorkingType';
import { isForReapply } from '@attendance/domain/models/AttDailyRequest';
import { HolidayWorkRequest } from '@attendance/domain/models/AttDailyRequest/HolidayWorkRequest';
import { AttPattern, DIRECT_INPUT } from '@attendance/domain/models/AttPattern';
import { SUBSTITUTE_LEAVE_TYPE } from '@attendance/domain/models/SubstituteLeaveType';

import Layout from '../../../../containers/organisms/attendance/DailyRequestDetailLayoutContainer';

import RadioButtonGroup from '../../../atoms/RadioButtonGroup';
import AttTimeSelectRangeField from '../../../molecules/attendance/AttTimeSelectRangeField';

import './HolidayWorkRequestPage.scss';

const ROOT =
  'mobile-app-pages-attendance-daily-request-details-holiday-work-request-page';

export type Props = Readonly<{
  readOnly: boolean;
  request: HolidayWorkRequest;
  selectedPattern: AttPattern;
  typeOptions: Array<{
    label: string;
    value: string;
  }>;
  validation: {
    [key: string]: string[];
  };
  onUpdateValue: (
    arg0: keyof HolidayWorkRequest,
    arg1: HolidayWorkRequest[keyof HolidayWorkRequest]
  ) => void;
}>;

const isShowPatten = (request: HolidayWorkRequest): boolean =>
  request.enabledPatternApply &&
  request.substituteLeaveType !== SUBSTITUTE_LEAVE_TYPE.Substitute;

const isDirectInputOnly = (request: HolidayWorkRequest): boolean =>
  request.patterns?.length === 1 &&
  request.patterns?.at(0)?.code === DIRECT_INPUT;

const isSubstitute = (request: HolidayWorkRequest): boolean =>
  request.substituteLeaveType === SUBSTITUTE_LEAVE_TYPE.Substitute;

const isDirectInput = (request: HolidayWorkRequest): boolean =>
  request.patternCode === DIRECT_INPUT;

const isFlexWithoutCore = (pattern: AttPattern): boolean =>
  pattern.workSystem === WORK_SYSTEM_TYPE.JP_Flex && pattern.withoutCoreTime;

const formatOptions = (
  patterns: HolidayWorkRequest['patterns']
): Array<{ label: string; value: string }> =>
  (patterns || []).map((pattern) => ({
    label: pattern.name,
    value: pattern.code,
  }));

export default class HolidayWorkRequestPage extends React.Component<Props> {
  render() {
    const { readOnly, request, validation, typeOptions, onUpdateValue } =
      this.props;

    const { enabledPatternApply, substituteLeaveTypes } = request;

    const isReapplying = isForReapply(request);
    const showPatten = isShowPatten(request);
    const directInput = isDirectInput(request);
    const substitute = isSubstitute(request);

    const selectedPattern: AttPattern = this.props.selectedPattern || {
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

    const flexWithoutCore = isFlexWithoutCore(selectedPattern);

    return (
      <div className={ROOT}>
        <Layout>
          <div className={`${ROOT}__item`}>
            <SFDateField
              readOnly={readOnly}
              disabled={!readOnly && !isReapplying}
              required
              label={msg().Att_Lbl_HolidayWorkDate}
              value={request.startDate}
              errors={validation.startDate}
              onChange={(_e: React.ChangeEvent<HTMLElement>, { date }) =>
                onUpdateValue('startDate', DateUtil.fromDate(date))
              }
            />
          </div>
          {substituteLeaveTypes.length > 1 && (
            <div className={`${ROOT}__item`}>
              <RadioButtonGroup
                classic
                readOnly={readOnly}
                label={{ label: msg().Att_Lbl_ReplacementDayOff }}
                options={typeOptions}
                value={request.substituteLeaveType || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onUpdateValue('substituteLeaveType', e.target.value)
                }
              />
            </div>
          )}
          {substitute && (
            <div className={`${ROOT}__item`}>
              <SFDateField
                readOnly={readOnly}
                required
                label={msg().Att_Lbl_ScheduledDateOfSubstitute}
                value={request.substituteDate || ''}
                errors={validation.substituteDate}
                onChange={(_e: React.ChangeEvent<HTMLElement>, { date }) =>
                  onUpdateValue('substituteDate', DateUtil.fromDate(date))
                }
              />
            </div>
          )}
          {showPatten && !isDirectInputOnly(request) && (
            <div className={`${ROOT}__item`}>
              <SelectField
                className={`${ROOT}__patterns`}
                readOnly={readOnly}
                disabled={readOnly}
                required
                label={msg().Att_Lbl_WorkingPattern}
                options={formatOptions(request.patterns)}
                value={request.patternCode}
                errors={validation.patternCode}
                onChange={(e) =>
                  onUpdateValue('patternCode', e.currentTarget.value)
                }
              />
            </div>
          )}
          {((showPatten && (directInput || flexWithoutCore)) ||
            !enabledPatternApply ||
            substitute) && (
            <div className={`${ROOT}__item`}>
              <AttTimeSelectRangeField
                className={`${ROOT}__times`}
                readOnly={readOnly}
                disabled={readOnly}
                required
                from={{
                  label: msg().Admin_Lbl_WorkingTypeStartTerm,
                  value: request.startTime,
                  onChangeValue: (arg0, _arg1) =>
                    onUpdateValue('startTime', arg0),
                }}
                to={{
                  label: msg().Admin_Lbl_WorkingTypeEndTerm,
                  value: request.endTime,
                  onChangeValue: (_arg0, arg1) =>
                    onUpdateValue('endTime', arg1),
                }}
                errors={validation.startTime || validation.endTime}
              />
            </div>
          )}
          {showPatten && !directInput && !flexWithoutCore && (
            <React.Fragment>
              <div className={`${ROOT}__item`}>
                <AttTimeSelectRangeField
                  className={`${ROOT}__times`}
                  readOnly={readOnly}
                  disabled={!readOnly}
                  from={{
                    label: msg().Admin_Lbl_WorkingTypeStartTerm,
                    value: selectedPattern.startTime,
                  }}
                  to={{
                    label: msg().Admin_Lbl_WorkingTypeEndTerm,
                    value: selectedPattern.endTime,
                  }}
                  errors={validation.startTime || validation.endTime}
                />
              </div>
            </React.Fragment>
          )}
          {showPatten &&
            !directInput &&
            selectedPattern.restTimes
              .filter(
                ({ startTime, endTime }) =>
                  startTime !== null && endTime !== null
              )
              .map((restTime, idx) => (
                <div key={idx} className={`${ROOT}__item`}>
                  <AttTimeSelectRangeField
                    className={`${ROOT}__times`}
                    readOnly={readOnly}
                    disabled={!readOnly}
                    label={`${msg().$Att_Lbl_CustomRest}${idx + 1}`}
                    from={{
                      value: restTime.startTime,
                    }}
                    to={{
                      value: restTime.endTime,
                    }}
                  />
                </div>
              ))}

          <div className={`${ROOT}__item`}>
            <TextAreaField
              className={`${ROOT}__remarks`}
              readOnly={readOnly}
              disabled={readOnly}
              label={msg().Att_Lbl_Remarks}
              rows={3}
              value={request.remarks}
              onChange={(event: React.SyntheticEvent<HTMLTextAreaElement>) =>
                onUpdateValue('remarks', event.currentTarget.value)
              }
            />
          </div>
        </Layout>
      </div>
    );
  }
}
