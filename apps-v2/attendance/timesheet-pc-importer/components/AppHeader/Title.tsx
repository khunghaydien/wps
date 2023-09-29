import * as React from 'react';

import styled from 'styled-components';

import msg from '@commons/languages';

import ImgIconHeader from '@attendance/timesheet-pc-importer/images/Time&Attendance.svg';

const Container = styled.div`
  display: flex;
`;

const IconArea = styled.div`
  width: 32px;
  height: 32px;
  margin: auto 20px;
}
`;

const TextArea = styled.div`
  margin: auto 0;
`;

const TitleText = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: #666666;
`;

const Title: React.FC = () => (
  <Container>
    <IconArea>
      <ImgIconHeader />
    </IconArea>
    <TextArea>
      <TitleText>{msg().Att_Lbl_ImpTitle}</TitleText>
    </TextArea>
  </Container>
);

export default Title;
