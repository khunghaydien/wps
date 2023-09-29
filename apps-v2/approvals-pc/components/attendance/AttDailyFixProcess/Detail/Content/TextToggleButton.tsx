import * as React from 'react';

import styled from 'styled-components';

import imgIconArrowDown from '@apps/commons/images/btnArrowDown.png';
import imgIconArrowUp from '@apps/commons/images/btnArrowUp.png';
import msg from '@apps/commons/languages';

const Container = styled.span`
  :first-child {
    text-align: left;
  }
  :last-child {
    text-align: right;
  }
  > img {
    margin-right: 4px;
  }
`;

const ExpandingButton: React.FC = () => (
  <>
    <img src={imgIconArrowDown} alt="toggle" />
    {msg().Att_Btn_DisplayAll}
  </>
);

const ContractingButton: React.FC = () => (
  <>
    <img src={imgIconArrowUp} alt="toggle" />
    {msg().Att_Btn_DisplayPart}
  </>
);

const TextToggleButton: React.FC<{
  expanded: boolean;
  onClickShowAll: () => void;
}> = ({ expanded, onClickShowAll }) => (
  <Container onClick={onClickShowAll} aria-hidden="true">
    {expanded ? <ContractingButton /> : <ExpandingButton />}
  </Container>
);

export default TextToggleButton;
