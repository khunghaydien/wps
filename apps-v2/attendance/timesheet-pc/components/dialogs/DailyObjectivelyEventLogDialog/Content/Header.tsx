import * as React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';

import {
  EventTypeCell,
  LinkedTimeCell,
  RemoveCell,
  Row,
  SourceCell,
  StampTimeCell,
  SyncCell,
} from './Table';

// FIXME: https://github.com/microsoft/TypeScript/issues/37597
// @ts-ignore
const Container = styled(Row)`
  background-color: #f4f6f9;
  color: #53688c;
  border-bottom: 1px solid #d8dde6;
  padding: 0px 10px;
  overflow: hidden;
`;

const Header: React.FC<{
  'data-testid'?: string;
  readOnly: boolean;
  allowedEditLogs: boolean;
}> = ({ 'data-testid': testid, readOnly, allowedEditLogs }) => (
  <Container data-testid={testid || ''}>
    <SourceCell data-testid={testid ? `${testid}-source` : ''}>
      {msg().Att_Lbl_ObjectivelyEventLogSource}
    </SourceCell>
    <EventTypeCell data-testid={testid ? `${testid}-event-type` : ''}>
      {msg().Att_Lbl_ObjectivelyEventLogEventType}
    </EventTypeCell>
    <StampTimeCell data-testid={testid ? `${testid}-stamp-time` : ''}>
      {msg().Att_Lbl_ObjectivelyEventLogTime}
    </StampTimeCell>
    <SyncCell data-testid={testid ? `${testid}-sync` : ''}>
      {msg().Att_Lbl_ObjectivelyEventLogSync}
    </SyncCell>
    <LinkedTimeCell data-testid={testid ? `${testid}-linked-time` : ''}>
      {msg().Att_Lbl_ObjectivelyEventLogLinkedTime}
    </LinkedTimeCell>
    {allowedEditLogs && !readOnly ? (
      <RemoveCell data-testid={testid ? `${testid}-remove` : ''} />
    ) : null}
  </Container>
);

Header.defaultProps = {
  'data-testid': '',
};

export default Header;
