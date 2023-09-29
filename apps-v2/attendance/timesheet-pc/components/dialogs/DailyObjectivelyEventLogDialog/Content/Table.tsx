import styled from 'styled-components';

const CELL_SIZE = {
  SOURCE: 300,
  EVENT_TYPE: 100,
  STAMP_TIME: 100,
  SYNC: 100,
  LINKED_TIME: 200,
  REMOVED: 150,
} as const;

export const SourceCell = styled.div`
  width: ${CELL_SIZE.SOURCE}px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const EventTypeCell = styled.div`
  width: ${CELL_SIZE.EVENT_TYPE}px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
`;

export const StampTimeCell = styled.div`
  width: ${CELL_SIZE.STAMP_TIME}px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
`;

export const SyncCell = styled.div`
  width: ${CELL_SIZE.SYNC}px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
`;

export const LinkedTimeCell = styled.div`
  width: ${CELL_SIZE.LINKED_TIME}px;
  white-space: nowrap;
  overflow: hidden;
`;

export const RemoveCell = styled.div`
  min-width: ${CELL_SIZE.REMOVED}px;
  max-width: ${CELL_SIZE.REMOVED}px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
`;

export const Row = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  text-align: left;
  > * {
    padding: 0px 10px;
  }
  > *:first-child {
    padding-left: 20px;
  }
  > *:last-child {
    padding-right: 20px;
  }
`;
