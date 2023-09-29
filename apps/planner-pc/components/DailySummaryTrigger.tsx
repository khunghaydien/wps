import * as React from 'react';

import { format } from 'date-fns';

import { useModal } from '../../core';

import { Permission } from '../../domain/models/access-control/Permission';

import DailySummaryTriggerButtonContainer from '../containers/DailySummaryTriggerButtonContainer';

import DailySummary, { CloseEvent } from '../../daily-summary';

type Props = Readonly<{
  'data-testid'?: string;
  children?: React.ReactNode;
  className?: string;
  date: Date;
  userPermission: Permission;
  isInitialView?: boolean;
  onClose?: (closeEvent: CloseEvent) => void;
}>;

const DailySummaryTrigger: React.FC<Props> = ({
  'data-testid': testId,
  className,
  children,
  date,
  userPermission,
  isInitialView,
  onClose,
}: Props) => {
  const { isOpen, openModal, closeModal, Modal } = useModal({
    isOpen: isInitialView,
  });
  const close = React.useCallback(
    (e: CloseEvent) => {
      if (e.dismissed) {
        closeModal();
      }
      if (onClose) {
        onClose(e);
      }
    },
    [closeModal, onClose]
  );
  const targetDate = React.useMemo(() => {
    return format(date, 'YYYY-MM-DD');
  }, [date]);

  return (
    <>
      {!isInitialView && (
        <DailySummaryTriggerButtonContainer
          data-testid={testId}
          className={className}
          onClick={openModal}
        >
          {children}
        </DailySummaryTriggerButtonContainer>
      )}
      {isOpen && (
        <Modal>
          <DailySummary
            data-testid={testId}
            date={targetDate}
            userPermission={userPermission}
            onClose={close}
          />
        </Modal>
      )}
    </>
  );
};

export default React.memo<Props>(DailySummaryTrigger);
