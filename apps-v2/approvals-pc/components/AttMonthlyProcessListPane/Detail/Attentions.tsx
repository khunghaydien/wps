import React from 'react';

import iconAttentions from '../../../../commons/images/iconAttention.png';
import msg from '../../../../commons/languages';
import TextUtil from '../../../../commons/utils/TextUtil';
import TimeUtil from '../../../../commons/utils/TimeUtil';

import './Attentions.scss';

const ROOT = 'approvals-pc-att-monthly-process-list-pane-detail-attentions';

type Props = Readonly<{
  ineffectiveWorkingTime: number;
  insufficientRestTime: number;
  paternityLeaveAtBirthSummary?: {
    id: string;
    startDateWorkTime: number;
    endDateWorkTime: number;
    totalWorkDays: number;
    totalWorkTime: number;
  }[];
  childCareAllowanceSummary?: {
    id: string;
    totalWorkTime: number;
  }[];
  childCareSummary?: {
    totalWorkDays: number;
  }[];
}>;

export default class Attentions extends React.Component<Props> {
  render() {
    const {
      ineffectiveWorkingTime,
      insufficientRestTime,
      paternityLeaveAtBirthSummary,
      childCareSummary,
      childCareAllowanceSummary,
    } = this.props;
    if (
      !ineffectiveWorkingTime &&
      !insufficientRestTime &&
      !paternityLeaveAtBirthSummary?.some(
        (value) =>
          value.startDateWorkTime ||
          value.endDateWorkTime ||
          value.totalWorkDays ||
          value.totalWorkTime
      ) &&
      !childCareSummary &&
      !childCareAllowanceSummary?.some((value) => value.totalWorkTime)
    ) {
      return '';
    }
    return (
      <div className={ROOT}>
        <div className={`${ROOT}__icon`}>
          <img src={iconAttentions} alt="" />
        </div>
        <div className={`${ROOT}__messages`}>
          <ul className={`${ROOT}__list`}>
            {insufficientRestTime > 0 ? (
              <li className={`${ROOT}__list-item`} key="insufficientRestTime">
                {TextUtil.template(
                  msg().Appr_Msg_FixSummaryConfirmInsufficientRestTime,
                  insufficientRestTime
                )}
              </li>
            ) : null}
            {ineffectiveWorkingTime > 0 ? (
              <li className={`${ROOT}__list-item`} key="ineffectiveWorkingTime">
                {TextUtil.template(
                  msg().Appr_Msg_FixSummaryConfirmIneffectiveWorkingTime,
                  ineffectiveWorkingTime
                )}
              </li>
            ) : null}
            {childCareSummary
              ?.filter((value) => value.totalWorkDays)
              .map((summary) => (
                <>
                  {summary.totalWorkDays ? (
                    <li
                      key={`childCareSummary-totalWorkDays`}
                      className={`${ROOT}__list-item`}
                    >
                      {TextUtil.template(
                        msg().Att_Msg_WorkOutsideOfWorkingHours,
                        summary.totalWorkDays
                      )}
                    </li>
                  ) : null}
                </>
              ))}
            {paternityLeaveAtBirthSummary
              ?.filter(
                (value) =>
                  value.startDateWorkTime ||
                  value.endDateWorkTime ||
                  value.totalWorkDays ||
                  value.totalWorkTime
              )
              .map((summary) => (
                <>
                  {summary.startDateWorkTime ? (
                    <li
                      key={`paternityLeaveAtBirthSummary-${summary.id}-startDateWorkTime`}
                      className={`${ROOT}__list-item`}
                    >
                      {TextUtil.template(
                        msg()
                          .Att_Msg_StartDateIsOverPossibleWorkTimeForPaternityLeaveAtBirth,
                        TimeUtil.toHHmm(summary.startDateWorkTime)
                      )}
                    </li>
                  ) : null}
                  {summary.endDateWorkTime ? (
                    <li
                      key={`paternityLeaveAtBirthSummary-${summary.id}-endDateWorkTime`}
                      className={`${ROOT}__list-item`}
                    >
                      {TextUtil.template(
                        msg()
                          .Att_Msg_EndDateIsOverPossibleWorkTimeForPaternityLeaveAtBirth,
                        TimeUtil.toHHmm(summary.endDateWorkTime)
                      )}
                    </li>
                  ) : null}
                  {summary.totalWorkDays ? (
                    <li
                      key={`paternityLeaveAtBirthSummary-${summary.id}-totalWorkDays`}
                      className={`${ROOT}__list-item`}
                    >
                      {TextUtil.template(
                        msg()
                          .Att_Msg_WorkDaysAreOverPossibleWorkTimeForPaternityLeaveAtBirth,
                        summary.totalWorkDays
                      )}
                    </li>
                  ) : null}
                  {summary.totalWorkTime ? (
                    <li
                      key={`paternityLeaveAtBirthSummary-${summary.id}-totalWorkTime`}
                      className={`${ROOT}__list-item`}
                    >
                      {TextUtil.template(
                        msg()
                          .Att_Msg_WorkTimeIsOverPossibleWorkTimeForPaternityLeaveAtBirth,
                        TimeUtil.toHHmm(summary.totalWorkTime)
                      )}
                    </li>
                  ) : null}
                </>
              ))}
            {childCareAllowanceSummary
              ?.filter((value) => value.totalWorkTime)
              .map((summary) => (
                <>
                  {summary.totalWorkTime ? (
                    <li
                      key={`childCareAllowanceSummary-${summary.id}-totalWorkTime`}
                      className={`${ROOT}__list-item`}
                    >
                      {TextUtil.template(
                        msg()
                          .Att_Msg_WorkTimeAreOverPossibleWorkTimeForChildCareAllowance,
                        TimeUtil.toHHmm(summary.totalWorkTime)
                      )}
                    </li>
                  ) : null}
                </>
              ))}
          </ul>
        </div>
      </div>
    );
  }
}
