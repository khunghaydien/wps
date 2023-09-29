import * as React from 'react';
import { CSSTransition } from 'react-transition-group';

import styled from 'styled-components';

const DETAIL_OFFSET_LEFT = 308;

const Container = styled.div`
  position: relative;
  min-width: 1024px;
  width: 100%;
  height: calc(100vh - 42px);
  overflow: hidden;
`;

const ListContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #fff;
  overflow: hidden;
  z-index: 0;

  &.opened-detail {
    &.enter-done {
      width: ${DETAIL_OFFSET_LEFT}px;
    }
    &.exit-done {
      width: 100%;
    }
  }

  &.opened-detail-enter {
    width: 100%;
  }
  &.opened-detail-enter-active {
    width: 100%;
  }
  &.opened-detail-exit {
    width: ${DETAIL_OFFSET_LEFT}px;
  }
  &.opened-detail-exit-active {
    width: 100%;
  }
`;

const DetailContainer = styled.div<{
  opened: boolean;
}>`
  position: absolute;
  top: 0;
  left: ${({ opened }) => (opened ? `${DETAIL_OFFSET_LEFT}px` : '110%')};
  right: 0;
  bottom: 0;
  width: calc(100% - ${DETAIL_OFFSET_LEFT}px);
  overflow: hidden;
  z-index: 1;
  transition: left 0.25s ease;
  background-color: #f2f2f2;
  box-shadow: -3px 10px 15px rgba(0, 0, 0, 0.25);
`;

const DetailScrollArea = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const AttDailyFixProcess: React.FC<{
  className?: string;
  openedDetail: boolean;
  List: React.FC;
  Detail: React.FC;
  children?: React.ReactNode;
}> = ({ className, openedDetail, List, Detail, children }) => (
  <Container className={className}>
    <CSSTransition in={openedDetail} timeout={250} className="opened-detail">
      <ListContainer>
        <List />
      </ListContainer>
    </CSSTransition>
    <DetailContainer opened={openedDetail}>
      <DetailScrollArea>
        <Detail />
      </DetailScrollArea>
    </DetailContainer>
    {children}
  </Container>
);
AttDailyFixProcess.defaultProps = {
  className: '',
  children: null,
};

export default AttDailyFixProcess;
