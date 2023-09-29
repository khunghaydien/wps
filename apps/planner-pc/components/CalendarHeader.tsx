import * as React from 'react';

import styled from 'styled-components';

import msg from '../../commons/languages';
import variables from '../../commons/styles/wsp.scss';
import {
  ArrowLeftButton,
  ArrowRightButton,
  Button as CommonButton,
  Dropdown,
  Option,
} from '../../core';

type Props = Readonly<{
  onClickToday: () => void;
  onClickNext: () => void;
  onClickPrevious: () => void;
  onSelectDate: (value: Option) => void;
  onSelectCalendarMode: (value: Option) => void;
  dateList: ReadonlyArray<Option>;
  date: string;
  calendarMode: 'week' | 'month';
}>;

const Container = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: transparent;
  width: 100%;
  height: 32px;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
`;

const MonthSelectContainer = styled.div`
  min-width: 160px;
`;

const MonthSelect = styled(Dropdown)`
  background: transparent;
  border: none;
  border-radius: 0;
  color: ${variables['color-text-2']};
  font-size: 16px;
  line-height: 24px;
  font-weight: bold;
  height: 24px;
  min-height: 24px;
  padding: 0;

  &:hover {
    background: transparent;
    border-bottom: 1px solid ${variables['color-text-2']};
  }
`;

const TodayButton = styled(CommonButton)`
  min-width: 70px;
  height: 32px;
  padding: 7px 0 8px 0;
  margin-left: 32px;
  color: ${variables['color-text-1']};
  font-size: 13px;
  line-height: 17px;
`;

const DropdownWrapper = styled.div`
  margin-left: 20px;
`;

const Switching = styled(Dropdown)`
  font-size: 13px;
  line-height: 17px;
  width: 95px;
  height: 32px;
`;

const Previous = styled.div`
  margin-left: 22px;
`;

const Next = styled.div`
  margin-left: 6px;
`;

const CalendarHeader: React.FC<Props> = (props: Props) => {
  return (
    <Container>
      <Content>
        <MonthSelectContainer>
          <MonthSelect
            data-testid="navigating-month"
            onSelect={props.onSelectDate}
            options={props.dateList}
            value={props.date}
          />
        </MonthSelectContainer>
        <TodayButton
          data-testid="navigating-today"
          onClick={props.onClickToday}
        >
          {msg().Cal_Lbl_Today}
        </TodayButton>
        <DropdownWrapper>
          <Switching
            data-testid="switching-calendar"
            onSelect={props.onSelectCalendarMode}
            options={[
              { label: msg().Cal_Lbl_Month, value: 'month' },
              { label: msg().Cal_Lbl_Week, value: 'week' },
            ]}
            value={props.calendarMode}
          />
        </DropdownWrapper>
        <Previous>
          <ArrowLeftButton
            data-testid="navigating-prev"
            onClick={props.onClickPrevious}
          />
        </Previous>
        <Next>
          <ArrowRightButton
            data-testid="navigating-next"
            onClick={props.onClickNext}
          />
        </Next>
      </Content>
    </Container>
  );
};

export default CalendarHeader;
