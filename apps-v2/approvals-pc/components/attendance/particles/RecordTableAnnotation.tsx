import * as React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';

import { DAY_TYPE } from '@attendance/domain/models/AttDailyRecord';

import DayTypeSymbol from '@apps/attendance/ui/components/DayTypeSymbol';

const Container = styled.div`
  line-height: 32px;
  height: 32px;
`;
const DayTypeIcon = styled.div`
  float: left;
  line-height: 30px;
  transform: scale(0.6);
  text-align: left;
`;
const DayType = styled.div`
  height: 30px;
  font-size: 10px;
  line-height: 10px;
  margin-top: 10px;
  padding-top: 1px;
  float: left;
`;

const RecordTableAnnotation: React.FC = () => (
  <Container>
    <DayTypeIcon>
      <DayTypeSymbol dayType={DAY_TYPE.Holiday} />
    </DayTypeIcon>
    <DayType>= {msg().Att_Lbl_StatutoryHoliday}, </DayType>
    <DayTypeIcon>
      <DayTypeSymbol dayType={DAY_TYPE.LegalHoliday} />
    </DayTypeIcon>
    <DayType>= {msg().Att_Lbl_LegalHoliday}, </DayType>
    <DayTypeIcon>
      <DayTypeSymbol dayType={DAY_TYPE.PreferredLegalHoliday} />
    </DayTypeIcon>
    <DayType>= {msg().Att_Lbl_PreferredLegalHoliday}</DayType>
  </Container>
);

export default RecordTableAnnotation;
