import * as React from 'react';

import classNames from 'classnames';
import isNil from 'lodash/isNil';

import Tooltip from '../../../../commons/components/Tooltip';
import ButtonPlusLoading from '../../../../commons/images/btnAddLoading.svg';
import imgBtnPlus from '../../../../commons/images/btnPlus.png';
import msg from '../../../../commons/languages';
import TimeUtil from '../../../../commons/utils/TimeUtil';
import { useModal } from '../../../../core';

import DailySummaryContainer from '../../../containers/DailySummaryContainer';

import './DailySummaryButton.scss';

const ROOT = 'timesheet-pc-main-content-timesheet-daily-summary-button';

type Props = Readonly<{
  isLoading: boolean;
  date: string;
  showAlert: boolean;
  totalTaskTime: number | null | undefined;
}>;

const HintTooltip = (props: {
  id: string;
  hasAlert: boolean;
  children: React.ReactNode;
}) => {
  return (
    <>
      {props.hasAlert ? (
        <Tooltip
          id={props.id}
          content={msg().Att_TimeTracking_Hint}
          align="top left"
        >
          <div>{props.children}</div>
        </Tooltip>
      ) : (
        props.children
      )}
    </>
  );
};

const PlusButton = (props: { isLoading: boolean }) => {
  return props.isLoading ? (
    <ButtonPlusLoading
      data-testid="timesheet-pc__daily-summary-button__plus-button"
      className={`${ROOT}__plus-button`}
    />
  ) : (
    <img
      data-testid="timesheet-pc__daily-summary-button__plus-button"
      className={`${ROOT}__plus-button`}
      src={imgBtnPlus}
    />
  );
};

const DailySummaryButton: React.ComponentType<Props> = ({
  isLoading,
  date,
  showAlert,
  totalTaskTime,
}: Props) => {
  const { isOpen, openModal, closeModal, Modal } = useModal({ zIndex: 501000 });

  return (
    <>
      <button
        type="button"
        data-testid="timesheet-pc__daily-summary-button"
        className={ROOT}
        disabled={isLoading}
        onClick={isLoading ? undefined : openModal}
      >
        <HintTooltip
          id={`timesheet-pc__daily-summary-button__${date}`}
          hasAlert={showAlert}
        >
          {showAlert ? (
            <div
              data-testid="timesheet-pc__daily-summary-button__alert-mark"
              className={`${ROOT}__mark--alert`}
            />
          ) : null}

          {isNil(totalTaskTime) ? (
            <PlusButton isLoading={isLoading} />
          ) : (
            <span
              data-testid="timesheet-pc__daily-summary-button__task-time"
              className={classNames(`${ROOT}__total-task-time`, {
                [`${ROOT}--alert`]: showAlert,
                [`${ROOT}--ok`]: !showAlert,
              })}
            >
              {TimeUtil.toHHmm(totalTaskTime)}
            </span>
          )}
        </HintTooltip>
      </button>
      {isOpen && (
        <Modal>
          <DailySummaryContainer date={date} onClose={closeModal} />
        </Modal>
      )}
    </>
  );
};

DailySummaryButton.displayName = 'DailySummaryButton';

export default DailySummaryButton;
