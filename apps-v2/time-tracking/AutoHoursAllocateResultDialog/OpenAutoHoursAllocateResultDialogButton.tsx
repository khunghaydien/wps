import React from 'react';

import msg from '@apps/commons/languages';
import { Button, useModal } from '@apps/core';

import AutoHoursAllocateResultDialogApp, {
  Props as AppProps,
} from './AutoHoursAllocateResultDialogApp';

type Props = React.ComponentProps<typeof Button> &
  Omit<AppProps, 'close'> & {
    timeOfAttendance: number | null | undefined;
    timeOfExternalTaskTime: number | null;
    checkBeforeOpen?: () => Promise<boolean>;
  };

const OpenAutoHoursAllocateResultDialogButton: React.FC<Props> = ({
  targetDate,
  timeOfAttendance,
  timeOfExternalTaskTime,
  userPermission,
  empId,
  onApply,
  checkBeforeOpen = () => Promise.resolve(true),
  ...props
}: Props) => {
  const { isOpen, openModal, closeModal, Modal } = useModal();

  const onClickOpen = React.useCallback(
    async (event) => {
      // NOTE: awaitの後でも本来のevent.currentTargetをopenModalに渡せるようにする
      const eventAtTheBeginning = Object.create(event);
      eventAtTheBeginning.currentTarget = event.currentTarget;

      const isCheckOk = await checkBeforeOpen();

      if (isCheckOk) {
        openModal(eventAtTheBeginning);
      }
    },
    [checkBeforeOpen]
  );

  return (
    <>
      <Button {...props} onClick={onClickOpen}>
        {msg().Time_Btn_AllocateWorkingHoursAutomatically}
      </Button>
      {isOpen && (
        <Modal>
          <AutoHoursAllocateResultDialogApp
            close={closeModal}
            onApply={onApply}
            targetDate={targetDate}
            timeOfAttendance={timeOfAttendance}
            timeOfExternalTaskTime={timeOfExternalTaskTime}
            userPermission={userPermission}
            empId={empId}
          />
        </Modal>
      )}
    </>
  );
};

export default React.memo(OpenAutoHoursAllocateResultDialogButton);
