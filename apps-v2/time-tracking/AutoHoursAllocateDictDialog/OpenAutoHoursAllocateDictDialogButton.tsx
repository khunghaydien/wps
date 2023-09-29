import React from 'react';

import msg from '@apps/commons/languages';
import { Button, LinkButton, useModal } from '@apps/core';

import { AutoHoursAllocationResult } from '@apps/domain/models/time-tracking/AutoHoursAllocationResult';

import AutoHoursAllocateDictDialogApp, {
  Props as AppProps,
} from './AutoHoursAllocateDictDialogApp';

type Props = React.ComponentProps<typeof Button> &
  Omit<AppProps, 'close'> & {
    appearance?: 'button' | 'link';
    resultItem?: AutoHoursAllocationResult;
  };

const OpenAutoHoursAllocateDictDialogButton: React.FC<Props> = ({
  targetDate,
  userPermission,
  empId,
  resultItem,
  appearance = 'button',
  color = 'primary',
  ...props
}: Props) => {
  const { isOpen, openModal, closeModal, Modal } = useModal();
  return (
    <>
      {appearance === 'button' && (
        <Button {...props} color={color} onClick={openModal}>
          {msg().Time_Btn_OpenTimeTrackingDictionary}
        </Button>
      )}
      {appearance === 'link' && (
        <LinkButton {...props} size="large" onClick={openModal}>
          {msg().Time_Btn_EditDictionary}
        </LinkButton>
      )}
      {isOpen && (
        <Modal>
          <AutoHoursAllocateDictDialogApp
            close={closeModal}
            targetDate={targetDate}
            userPermission={userPermission}
            empId={empId}
            resultItem={resultItem}
          />
        </Modal>
      )}
    </>
  );
};

export default React.memo(OpenAutoHoursAllocateDictDialogButton);
