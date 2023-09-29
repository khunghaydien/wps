import React, { SyntheticEvent, useCallback, useMemo } from 'react';

import format from 'date-fns/format';
import parse from 'date-fns/parse';

import { useModal } from '@apps/core';
import { DEFAULT_Z_INDEX as MODAL_DEFAULT_Z_INDEX } from '@apps/core/hooks/useModal';

import { JobHistory } from '@apps/domain/models/time-tracking/JobHistory';

import JobSelectDialog from '@apps/time-tracking/JobSelectDialog';
import { useDate } from '@apps/time-tracking/time-tracking-charge-transfer-pc/hooks/useDate';
import { useDelegate } from '@apps/time-tracking/time-tracking-charge-transfer-pc/hooks/useDelegate';
import { useDestinationTask } from '@apps/time-tracking/time-tracking-charge-transfer-pc/hooks/useDestinationTask';
import { useSummary } from '@apps/time-tracking/time-tracking-charge-transfer-pc/hooks/useSummary';
import { useToast } from '@apps/time-tracking/time-tracking-charge-transfer-pc/hooks/useToast';

type OpenDialog = (e: SyntheticEvent<any>) => void;
type Dialog = React.ComponentType;
type IsOpen = boolean;

export const useJobSelectDialog = (): [Dialog, OpenDialog, IsOpen] => {
  const { Modal, openModal, closeModal, isOpen } = useModal({
    zIndex: MODAL_DEFAULT_Z_INDEX + 1,
  });
  const [{ summaryPeriod }] = useSummary();
  const [startDate, endDate, setStartDate, setEndDate] = useDate();
  const [_unused, setDestinationTask] = useDestinationTask();
  const [showError] = useToast('error');
  const [_, user] = useDelegate();

  const onSelect = useCallback(
    ({
      baseId: jobId,
      name: jobName,
      code: jobCode,
      validFrom,
      validTo,
    }: JobHistory): void => {
      setDestinationTask({
        jobId,
        jobName,
        jobCode,
        validFrom,
        validTo,
        workCategoryId: '',
        workCategoryCode: '',
        workCategoryName: '',
      });

      const validFromDate = parse(validFrom);
      const validToDate = parse(validTo);
      if (startDate < validFromDate || startDate > validToDate) {
        setStartDate(validFromDate);
      }
      if (endDate > validToDate || endDate < validFromDate) {
        setEndDate(validToDate);
      }
    },
    [setDestinationTask, startDate, endDate, setStartDate, setEndDate]
  );

  const onError = useCallback((e: Error) => showError(e.message), [showError]);

  const Component: React.ComponentType = useMemo(
    // eslint-disable-next-line react/display-name
    (): React.FC => (): React.ReactElement =>
      (
        <>
          {isOpen && (
            <Modal>
              <JobSelectDialog
                useHistory
                query={{
                  empId: user?.isDelegated ? user.id : undefined,
                  startDate: format(summaryPeriod.startDate, 'YYYY-MM-DD'),
                  endDate: format(summaryPeriod.endDate, 'YYYY-MM-DD'),
                }}
                onClose={closeModal}
                onSelect={onSelect}
                onError={onError}
              />
            </Modal>
          )}
        </>
      ),
    [closeModal, startDate, endDate, isOpen, onError, onSelect, summaryPeriod]
  );
  Component.displayName = 'JobSelectDialog';

  return [Component, openModal, isOpen];
};
