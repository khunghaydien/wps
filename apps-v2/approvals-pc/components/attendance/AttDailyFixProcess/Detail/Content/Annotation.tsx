import * as React from 'react';

import styled from 'styled-components';

import TextToggleButton from '@apps/approvals-pc/components/attendance/AttDailyFixProcess/Detail/Content/TextToggleButton';
import RecordTableAnnotation from '@apps/approvals-pc/components/attendance/particles/RecordTableAnnotation';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  line-height: 32px;
`;

const Footer: React.FC<{
  expanded: boolean;
  onClickShowAll: () => void;
}> = ({ expanded, onClickShowAll }) => (
  <Container>
    <div>
      <TextToggleButton onClickShowAll={onClickShowAll} expanded={expanded} />
    </div>
    <div>
      <RecordTableAnnotation />
    </div>
  </Container>
);

export default Footer;
