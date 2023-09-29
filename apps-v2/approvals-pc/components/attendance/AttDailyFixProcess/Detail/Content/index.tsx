import * as React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import TextUtil from '@apps/commons/utils/TextUtil';

import { FixDailyRequestViewModel } from '@apps/approvals-pc/models/attendance/FixDailyRequestViewModel';

import AllowanceTable from '@apps/approvals-pc/components/attendance/particles/AllowanceTable';
import Attentions from '@apps/approvals-pc/components/attendance/particles/Attentions';
import ObjectivelyEventLogTable from '@apps/approvals-pc/components/attendance/particles/ObjectivelyEventLogTable';
import RecordTable from '@apps/approvals-pc/components/attendance/particles/RecordTable';
import RestReasonTable from '@apps/approvals-pc/components/attendance/particles/RestReasonTable';

import Annotation from './Annotation';
import Summaries from './Summaries';

const Container = styled.div``;

const TableContainer = styled.div`
  padding: 0px 16px;
  padding-top: 5px;
  margin-bottom: 20px;
`;

const RecordTableContainer = styled.div``;

const SummariesContainer = styled.div`
  padding-top: 16px;
`;

const Content: React.FC<{
  request: FixDailyRequestViewModel;
  closingDate: string;
  expanded?: boolean;
}> = ({ request: $request, closingDate, expanded: $expanded }) => {
  const [expanded, setExpanded] = React.useState<boolean>($expanded);
  const records7days = React.useMemo(() => {
    const idx = $request.records.findIndex(
      ({ recordDate }) => recordDate === $request.targetDate
    );
    const start = idx - 6 < 0 ? 0 : idx - 6;
    const end = idx + 1;
    return $request.records.slice(start, end);
  }, [$request]);
  const request = React.useMemo(() => {
    if (expanded) {
      return $request;
    } else {
      return {
        ...$request,
        records: records7days,
      };
    }
  }, [$request, expanded, records7days]);
  const onClickShowAll = () => {
    setExpanded(!expanded);
  };

  React.useEffect(() => {
    setExpanded(false);
  }, [$request.id]);

  return (
    <Container key={$request.id}>
      <Attentions {...request.attention} />
      <TableContainer>
        {TextUtil.template(
          msg().Com_Str_Parenthesis,
          TextUtil.template(msg().Com_Lbl_AsAt, DateUtil.formatYMD(closingDate))
        )}
        <RecordTableContainer>
          <RecordTable
            targetDate={request.targetDate}
            summary={request}
            enabledTotal={expanded}
          />
        </RecordTableContainer>
        <Annotation expanded={expanded} onClickShowAll={onClickShowAll} />
        <SummariesContainer>
          <Summaries
            summaries={request.summaries}
            dividedSummaries={request.dividedSummaries}
          />
        </SummariesContainer>
      </TableContainer>
      {request.dailyRestRecords ? (
        <RestReasonTable dailyRestRecordList={request.dailyRestRecords} />
      ) : null}
      {request.workingType.useAllowanceManagement ? (
        <AllowanceTable
          dailyAllowanceRecordList={request.dailyAllowanceRecords}
        />
      ) : null}
      {request.workingType.useObjectivelyEventLog ? (
        <ObjectivelyEventLogTable
          dailyObjectiveRecords={request.dailyObjectiveEventLogRecords}
        />
      ) : null}
    </Container>
  );
};
Content.defaultProps = {
  expanded: false,
};

export default Content;
