import React from 'react';

import styled from 'styled-components';

import { Dialog } from '../../core';

import CalendarContainer from '../containers/CalendarContainer';
import ConfirmDialogContainer from '../containers/ConfirmDialogContainer';
import EventListPopupContainer from '../containers/EventListPopupContainer';
import HeaderContainer from '../containers/HeaderContainer';
import TaskCardContainer from '../containers/TaskCardContainer';
import TrackSummaryCardContainer from '../containers/TrackSummaryCardContainer';
import WorkReportCardContainer from '../containers/WorkReportCardContainer';

import Footer from './Footer';
import LoadingScreen from './LoadingScreen';

type Props = {
  'data-testid'?: string;
  readOnly?: boolean;
  hasLeave: boolean;
  isModal?: boolean;
  isLoading: boolean;
  isDelegated: boolean;
  onClose: (e: React.SyntheticEvent<HTMLElement>) => void;
  onSave: (e: React.SyntheticEvent<HTMLElement>) => void;
  onSaveAndLeave: (e: React.SyntheticEvent<HTMLElement>) => void;
};

const DialogContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;

  /* Background */
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 50000;
`;

const Wrapper = styled.div`
  width: 95vw;
  height: 90vh;
  min-width: 1100px;
  min-height: 572px;
  max-width: 1600px;
  max-height: 1264px;
  z-index: 50001;
  position: absolute;
`;

const StyledDialog = styled(Dialog)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ContentsWrapper = styled.div`
  position: relative;
  width: 100%;

  /* 90vh -  header - footer - close button */
  height: calc(90vh - 60px - 60px - 32px);
  min-height: calc(572px - 60px - 60px - 32px);
  display: flex;
  align-items: center;
  z-index: 0;
`;

const CalendarWrapper = styled.div`
  flex: 0 0 310px;
  height: 100%;
  position: relative;
  overflow-x: hidden;
  border-right: 1px solid #ddd;
`;

const SummaryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  flex: 1 1 auto;
  background: #e5e5e5;
  overflow: auto;
`;

const Container = styled.div`
  padding: 20px;
  width: 100%;
`;

const VerticalSpacer = styled.div`
  height: 20px;
  min-height: 20px;
  width: 100%;
  background: transparent;
`;

const Divider = styled.hr`
  height: 1px;
  width: 100%;
  color: #ddd;
  margin: 0;
  padding: 0;
`;

const Contents = ({ isLoading = false }: { isLoading: boolean }) => {
  return (
    <ContentsWrapper>
      <LoadingScreen isLoading={isLoading} />
      <CalendarWrapper>
        <CalendarContainer />
      </CalendarWrapper>
      <SummaryWrapper>
        <Container>
          <TrackSummaryCardContainer />
        </Container>
        <Divider />
        <Container>
          <TaskCardContainer />
          <VerticalSpacer />
          <WorkReportCardContainer />
        </Container>
      </SummaryWrapper>
    </ContentsWrapper>
  );
};

const DailySummary = ({ isModal = true, ...props }: Props) => {
  return (
    <DialogContainer>
      <Wrapper>
        <StyledDialog
          data-testid={props['data-testid']}
          isModal={isModal}
          header={<HeaderContainer />}
          content={<Contents isLoading={props.isLoading} />}
          footer={
            <Footer
              readOnly={props.readOnly}
              isDelegated={props.isDelegated}
              isLoading={props.isLoading}
              hasLeave={props.hasLeave}
              onSave={props.onSave}
              onClose={props.onClose}
              onSaveAndLeave={props.onSaveAndLeave}
            />
          }
          onClose={props.onClose}
        />
        <EventListPopupContainer />
      </Wrapper>
      <ConfirmDialogContainer />
    </DialogContainer>
  );
};

export default DailySummary;
