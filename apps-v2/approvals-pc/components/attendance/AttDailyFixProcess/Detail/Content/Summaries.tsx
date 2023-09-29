import * as React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import TextUtil from '@apps/commons/utils/TextUtil';

import { FixDailyRequestViewModel } from '@apps/approvals-pc/models/attendance/FixDailyRequestViewModel';
import { SUMMARY_ITEM_NAME } from '@attendance/domain/models/approval/FixMonthlyRequest';

import TextToggleButton from '@apps/approvals-pc/components/attendance/AttDailyFixProcess/Detail/Content/TextToggleButton';
import $RecordSummaryItem from '@apps/approvals-pc/components/attendance/particles/RecordSummaryItem';

const RecordSummaryItem: React.FC<{
  summary: FixDailyRequestViewModel['summaries'][number];
}> = ({ summary }) => (
  <>
    {summary.items
      .map((item) => {
        switch (item.name) {
          case SUMMARY_ITEM_NAME.ANNUAL_PAID_LEAVE_DAYS:
            return <$RecordSummaryItem key={item.name} {...item} />;
          case SUMMARY_ITEM_NAME.GENERAL_PAID_LEAVE_DAYS:
          case SUMMARY_ITEM_NAME.UNPAID_LEAVE_DAYS:
            return [
              <$RecordSummaryItem key={item.name} {...item} />,
              item.items.map((child) => (
                <$RecordSummaryItem
                  key={item.name}
                  {...child}
                  isSubItem={true}
                />
              )),
            ];
          default:
            return <$RecordSummaryItem key={item.name} {...item} />;
        }
      })
      .flat()}
  </>
);

const TotalSummaries = styled.div`
  margin: 0px 0 32px;
`;

const DividedSummaries = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Container = styled.div`
  margin: 0px 16px 32px 0px;
`;

const Content = styled.div`
  width: 340px;
  min-width: 340px;
`;

const Title = styled.div`
  padding: 0px 0px 4px;
`;

const Table = styled.div`
  border: 1px solid #d8dde6;
  background-color: #fff;
`;

const Footer = styled.div`
  margin-top: 4px;
`;

const Summary: React.FC<{
  summaries: FixDailyRequestViewModel['summaries'];
  dividedSummaries: FixDailyRequestViewModel['dividedSummaries'];
  expanded?: boolean;
}> = ({ summaries, dividedSummaries, expanded: $expanded }) => {
  const [expanded, setExpanded] = React.useState<boolean>($expanded);

  const onClickShowAll = () => {
    setExpanded(!expanded);
  };

  return (
    <div>
      <TotalSummaries>
        <Container>
          <Content>
            {dividedSummaries?.length ? (
              <Title>{msg().Att_Lbl_TotalSummary}</Title>
            ) : null}
            <Table>
              {summaries.map((summary) => (
                <RecordSummaryItem key={summary.name} summary={summary} />
              ))}
            </Table>
          </Content>
          {dividedSummaries?.length ? (
            <Footer>
              <TextToggleButton
                onClickShowAll={onClickShowAll}
                expanded={expanded}
              />
            </Footer>
          ) : null}
        </Container>
      </TotalSummaries>
      {expanded ? (
        <DividedSummaries>
          {dividedSummaries?.map(({ name, startDate, endDate, summaries }) => (
            <Container key={`${name}-${startDate}-${endDate}`}>
              <Content>
                <Title>
                  {TextUtil.template(
                    msg().Att_Msg_AttSummarySummaryName,
                    DateUtil.formatYMD(startDate),
                    DateUtil.formatYMD(endDate),
                    name
                  )}
                </Title>
                <Table>
                  {summaries.map((summary) => (
                    <RecordSummaryItem key={summary.name} summary={summary} />
                  ))}
                </Table>
              </Content>
            </Container>
          ))}
        </DividedSummaries>
      ) : null}
    </div>
  );
};

Summary.defaultProps = {
  expanded: false,
};

export default Summary;
