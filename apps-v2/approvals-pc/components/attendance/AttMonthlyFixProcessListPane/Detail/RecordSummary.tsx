import React from 'react';

import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import TextUtil from '@apps/commons/utils/TextUtil';

import { FixMonthlyRequestViewModel } from '@apps/approvals-pc/models/attendance/FixMonthlyRequestViewModel';

import RecordSummaryGroup from './RecordSummaryGroup';
import { toGroup } from '@attendance/ui/helpers/attendanceSummary/summaries';

import './RecordSummary.scss';

const ROOT = 'approvals-pc-att-monthly-process-list-pane-detail-record-summary';

const Summaries: React.FC<{
  summaries: FixMonthlyRequestViewModel['summaries'];
}> = ({ summaries }) => {
  const grouped = React.useMemo(
    () =>
      Array.from(toGroup(summaries).entries()).filter(
        ([_, summaries]) => summaries.length
      ),
    [summaries]
  );
  return (
    <div className={`${ROOT}__table`}>
      {grouped.map(([position, summaries]) => (
        <div
          key={position}
          className={`${ROOT}__col ${ROOT}__col--${position}`}
        >
          {summaries.map((summary) => (
            <RecordSummaryGroup key={summary.name} items={summary.items} />
          ))}
        </div>
      ))}
    </div>
  );
};

const RecordSummary: React.FC<{
  summaries: FixMonthlyRequestViewModel['summaries'];
  dividedSummaries: FixMonthlyRequestViewModel['dividedSummaries'];
}> = ({ summaries, dividedSummaries }) => (
  <div className={ROOT}>
    <div key="total" className={`${ROOT}__section`}>
      <div className={`${ROOT}__section-name`}>
        {dividedSummaries?.length ? (
          <div className={`${ROOT}__section-name`}>
            {msg().Att_Lbl_TotalSummary}
          </div>
        ) : null}
      </div>
      <Summaries summaries={summaries} />
    </div>
    {dividedSummaries?.map(({ name, startDate, endDate, summaries }) => (
      <div
        key={`${name}-${startDate}-${endDate}`}
        className={`${ROOT}__section`}
      >
        <div className={`${ROOT}__section-name`}>
          {TextUtil.template(
            msg().Att_Msg_AttSummarySummaryName,
            DateUtil.formatYMD(startDate),
            DateUtil.formatYMD(endDate),
            name
          )}
        </div>
        <Summaries summaries={summaries} />
      </div>
    ))}
  </div>
);

export default RecordSummary;
