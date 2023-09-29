import * as React from 'react';

import styled from 'styled-components';

import msg from '@commons/languages';

import DatePicker from '../../particles/DatePicker';
import Cell from './particles/Cell';

const Container = styled.div`
  display: flex;
`;

const Title = styled(Cell)`
  padding-right: 5px;
`;

const Separation = styled(Cell)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
`;

const DatePickerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const convertToDate = (date: string) => (date ? new Date(date) : null);

const DateSelector: React.FC<{
  startDate: string;
  endDate: string;
  onChangeStartDate: (date: string) => void;
  onChangeEndDate: (date: string) => void;
}> = ({ startDate, endDate, onChangeStartDate, onChangeEndDate }) => {
  const dtStartDate = React.useMemo(
    () => convertToDate(startDate),
    [startDate]
  );
  const dtEndDate = React.useMemo(() => convertToDate(endDate), [endDate]);

  return (
    <Container>
      <Title>{msg().Att_Lbl_Period}:</Title>
      <DatePickerWrapper>
        <DatePicker
          selectsStart={true}
          value={startDate}
          selected={dtStartDate}
          startDate={dtStartDate}
          endDate={dtEndDate}
          onChangeDate={onChangeStartDate}
        />
      </DatePickerWrapper>
      <Separation>
        <span>-</span>
      </Separation>
      <DatePickerWrapper>
        <DatePicker
          selectsEnd={true}
          value={endDate}
          selected={dtEndDate}
          startDate={dtStartDate}
          endDate={dtEndDate}
          onChangeDate={onChangeEndDate}
        />
      </DatePickerWrapper>
    </Container>
  );
};

export default DateSelector;
