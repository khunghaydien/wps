import * as React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import { Button } from '@apps/core';

type Props = {
  readonly onClickViewScheduledDetails: () => void;
};

const S = {
  Container: styled.footer`
    width: 100%;
    height: 100%;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  `,
};

const Footer: React.ComponentType<Props> = React.memo((props: Props) => (
  <S.Container>
    <Button onClick={props.onClickViewScheduledDetails} color="primary">
      {msg().Psa_Btn_ViewScheduledDetails}
    </Button>
  </S.Container>
));

export default Footer;
