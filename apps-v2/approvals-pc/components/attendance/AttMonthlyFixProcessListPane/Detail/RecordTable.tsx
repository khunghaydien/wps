import React from 'react';

import styled from 'styled-components';

import { FixMonthlyRequestViewModel } from '@apps/approvals-pc/models/attendance/FixMonthlyRequestViewModel';

import $RecordTable from '@apps/approvals-pc/components/attendance/particles/RecordTable';
import Annotation from '@apps/approvals-pc/components/attendance/particles/RecordTableAnnotation';

const Container = styled.div`
  max-width: 1124px;
  padding: 0 15px;
  margin: 0 0 16px;
`;

const RecordTable: React.FC<{ summary: FixMonthlyRequestViewModel }> = ({
  summary,
}) => (
  <Container>
    <$RecordTable summary={summary} />
    <Annotation />
  </Container>
);

export default RecordTable;
