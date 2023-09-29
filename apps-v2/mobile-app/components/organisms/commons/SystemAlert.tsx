import * as React from 'react';

import styled from 'styled-components';

import msg from '@commons/languages';
import Dialog from '@mobile/components/molecules/commons/Dialog';

import zindexes from '@mobile/styles/variables/_zindex.scss';

export type Props = {
  message: string;
  callback: () => void;
};

const Container = styled.div`
  position: fixed;
  z-index: ${zindexes.systemMessage};
`;

const Content = styled.div`
  margin: 6px 0 0;
`;

export default (props: Props) => {
  const { message, callback } = props;
  if (message) {
    return (
      <Container>
        <Dialog
          content={<Content>{message}</Content>}
          centerButtonLabel={msg().Com_Btn_Ok}
          onClickCenterButton={callback}
          onClickCloseButton={callback}
        />
      </Container>
    );
  }

  return '';
};
