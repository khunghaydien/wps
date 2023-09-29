import * as React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';

import ListHeader from '@mobile/components/atoms/ListHeader';

const Container = styled.div`
  display: flex;
  width: 100%;
`;

const TitleContainer = styled.div`
  display: flex;
  width: 100%;
`;

const LinkIconContainer = styled.div`
  // Icon width + Left margin + Right margin
  min-width: ${16 + 12 + 12}px;
  max-width: ${16 + 12 + 12}px;
`;

const StatusHeader = styled(ListHeader)`
  // Icon width + Left margin + Right margin
  min-width: ${16 + 12 + 8}px;
  max-width: ${16 + 12 + 8}px;
`;

const DateHeader = styled(ListHeader)`
  width: 100%;
  text-align: center;
  // NOTE: Here is not multiples of 4 by designer's order.
  // https://teamspiritdev.atlassian.net/browse/GENIE-10356
  min-width: ${135 - 36}px;
`;

const StartTimeHeader = styled(ListHeader)`
  &&& {
    width: 100%;
    text-align: center;
  }
`;

const EndTimeHeader = styled(ListHeader)`
  &&& {
    width: 100%;
    text-align: center;
  }
`;

const MonthlyListHeader: React.FC = () => {
  return (
    <Container>
      <TitleContainer>
        <StatusHeader />
        <DateHeader>{msg().Att_Lbl_Date}</DateHeader>
        <StartTimeHeader>{msg().Att_Lbl_TimeIn}</StartTimeHeader>
        <EndTimeHeader>{msg().Att_Lbl_TimeOut}</EndTimeHeader>
      </TitleContainer>
      <LinkIconContainer>
        <ListHeader />
      </LinkIconContainer>
    </Container>
  );
};

export default MonthlyListHeader;
