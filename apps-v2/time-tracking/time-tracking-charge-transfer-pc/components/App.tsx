import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styled from 'styled-components';

import * as ToastMessageType from '@apps/time-tracking/time-tracking-charge-transfer-pc/constants/ToastMessageType';

import GlobalContainer from '@apps/commons/containers/GlobalContainer';
import PersonalMenuPopoverContainer from '@apps/commons/containers/PersonalMenuPopoverContainer';
import ToastContainer from '@apps/commons/containers/ToastContainer';
import { useModal } from '@apps/core';

import { State } from '@apps/time-tracking/time-tracking-charge-transfer-pc/modules';
import { action } from '@apps/time-tracking/time-tracking-charge-transfer-pc/modules/ui/timeTrackingCharge';

import AppActions from '@apps/time-tracking/time-tracking-charge-transfer-pc/action-dispatchers/App';

import ProxyEmployeeSelectDialogContainer from '@widgets/dialogs/ProxyEmployeeSelectDialog/containers/ProxyEmployeeSelectDialogContainer';

import AppHeader from '@apps/time-tracking/time-tracking-charge-transfer-pc/components/AppHeader';
import { PreventDateFormatDisplayCorruption } from '@apps/time-tracking/time-tracking-charge-transfer-pc/components/helpers/PreventDateFormatDisplayCorruption';

import TransferDialog from './TransferDialog';
import { useDelegate } from '@apps/time-tracking/time-tracking-charge-transfer-pc/hooks/useDelegate';
import { useSelectTask } from '@apps/time-tracking/time-tracking-charge-transfer-pc/hooks/useSelectTask';
import { useUpdateSummaryTask } from '@apps/time-tracking/time-tracking-charge-transfer-pc/hooks/useUpdateSummaryTask';
import TrackSummary from '@apps/time-tracking/TrackSummary';

const Container = styled.div`
  padding: 54px 0 0 0;
  background: #e5e5e5;
  height: 100vh;
`;

const TrackSummaryContainer = styled.div`
  padding: 20px;
`;

const DefaultToastMessageRender: React.FC<{
  children: string;
}> = ({ children }) => <>{children}</>;

const App: React.FC = () => {
  const [userPermission, user] = useDelegate();
  const { Modal, openModal, closeModal, isOpen } = useModal();
  const dispatch = useDispatch();
  const app = React.useMemo(() => AppActions(dispatch), [dispatch]);
  const updateSummaryTask = useUpdateSummaryTask(closeModal);
  const selectTask = useSelectTask();
  const [toastMessage, toastMessageType] = useSelector((state: State) => [
    state.common.toast.message,
    state.common.toast.options?.messageType,
  ]);

  const selectTaskAndOpenDialog = React.useCallback(
    (
      e: React.SyntheticEvent,
      targetSummary: Parameters<typeof selectTask>[number]
    ) => {
      selectTask(targetSummary);
      openModal(e);
    },
    [selectTask, openModal]
  );

  const closeDialog = React.useCallback(() => {
    dispatch(action.RESET());
    closeModal();
  }, [dispatch, closeModal]);

  let ToastMessageRender = DefaultToastMessageRender;
  switch (toastMessageType) {
    case ToastMessageType.TRANSFER_RESULT_WITH_WARNING:
      ToastMessageRender = PreventDateFormatDisplayCorruption;
      break;
  }
  const renderedMessage = (
    <ToastMessageRender>{toastMessage}</ToastMessageRender>
  );

  return (
    <GlobalContainer>
      <Container>
        <AppHeader />
        <TrackSummaryContainer>
          <TrackSummary.Transfer
            onSelect={selectTaskAndOpenDialog}
            appActions={app}
            userPermission={userPermission}
            user={user}
          />
        </TrackSummaryContainer>
      </Container>
      {isOpen && (
        <Modal>
          <TransferDialog onClose={closeDialog} onSave={updateSummaryTask} />
        </Modal>
      )}
      <PersonalMenuPopoverContainer
        showProxyEmployeeSelectButton
        showChangeApproverButton={false}
        showLeaveDetailButton={false}
      />
      <ProxyEmployeeSelectDialogContainer
        onDecide={app.selectDelegatedEmployee}
      />
      <ToastContainer message={renderedMessage} />
    </GlobalContainer>
  );
};

export default App;
