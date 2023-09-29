import * as React from 'react';

import styled from 'styled-components';

import msg from '@commons/languages';
import Dialog from '@mobile/components/molecules/commons/Dialog';

import zindexes from '@mobile/styles/variables/_zindex.scss';

export type Props = {
  messages: string[] | null;
  callback: (arg0: boolean) => void;
};

const Container = styled.div`
  position: fixed;
  z-index: ${zindexes.systemMessage};
`;

const Content = styled.div`
  margin: 6px 0 0;
`;

const List = styled.ul`
  padding-left: 2em;
  list-style-type: disc;
`;

const AttendanceRequestIgnoreWarningConfirm: React.FC<Props> = ({
  messages,
  callback,
}) => {
  const yes = React.useMemo(() => () => callback(true), [callback]);
  const no = React.useMemo(() => () => callback(false), [callback]);

  if (!messages || messages.length === 0) {
    return null;
  }
  return (
    <Container>
      <Dialog
        content={
          <Content>
            <p>{msg().Att_Msg_FixSummaryConfirm}</p>
            <List>
              {messages.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </List>
          </Content>
        }
        leftButtonLabel={msg().Com_Btn_Cancel}
        rightButtonLabel={msg().Com_Btn_Ok}
        onClickLeftButton={no}
        onClickRightButton={yes}
        onClickCloseButton={no}
      />
    </Container>
  );
};

export default AttendanceRequestIgnoreWarningConfirm;
