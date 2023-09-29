import * as React from 'react';

import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import TextUtil from '@apps/commons/utils/TextUtil';

import { State } from '@attendance/timesheet-pc-summary/modules/entities/summary';

import SummaryGroup from './SummaryGroup';
import { toGroup } from '@attendance/ui/helpers/attendanceSummary/summaries';

import './TimesheetSummaryFooter.scss';

const ROOT = 'timesheet-pc-summary-timesheet-summary-footer';

const Summaries: React.FC<{
  summaries: State['summaries'];
  masked: State['masked'];
}> = ({ summaries, masked }) => {
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
            <SummaryGroup
              key={summary.name}
              items={summary.items}
              masked={masked}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const TimesheetSummaryFooter: React.FC<{
  summaries: State['summaries'];
  dividedSummaries: State['dividedSummaries'];
  masked: State['masked'];
}> = ({ summaries, dividedSummaries, masked }) => (
  <div className={ROOT}>
    <div key="total" className={`${ROOT}__section`}>
      {dividedSummaries?.length ? (
        <div className={`${ROOT}__section-name`}>
          {msg().Att_Lbl_TotalSummary}
        </div>
      ) : null}
      <Summaries summaries={summaries} masked={masked} />
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
        <Summaries summaries={summaries} masked={masked} />
      </div>
    ))}
  </div>
);

export default TimesheetSummaryFooter;
