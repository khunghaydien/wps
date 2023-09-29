import * as React from 'react';

import isNil from 'lodash/isNil';

import ButtonPlusLoading from '../../../../../commons/images/btnAddLoading.svg';
import imgBtnPlus from '../../../../../commons/images/btnPlus.png';
import { useModal } from '../../../../../core';

import DailyAllowanceContainer from '../../../containers/DailyAllowanceContainer';

import './DailyAllowanceButton.scss';

const ROOT = 'timesheet-pc-main-content-timesheet-daily-allowance-button';

type Props = Readonly<{
  isLoading: boolean;
  date: string;
  isLocked: boolean;
  availableAllowanceCount: number | null | undefined;
  dailyAllowanceList: [] | null | undefined;
}>;

const PlusButton = (props: { isLoading: boolean }) => {
  return props.isLoading ? (
    <ButtonPlusLoading
      data-testid="timesheet-pc__daily-allowance-button__plus-button"
      className={`${ROOT}__plus-button`}
    />
  ) : (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img
      data-testid="timesheet-pc__daily-allowance-button__plus-button"
      className={`${ROOT}__plus-button`}
      src={imgBtnPlus}
    />
  );
};

const DailyAllowanceButton: React.ComponentType<Props> = ({
  isLoading,
  date,
  isLocked,
  availableAllowanceCount,
  dailyAllowanceList,
}: Props) => {
  const { isOpen, openModal, closeModal, Modal } = useModal({ zIndex: 501000 });

  return (
    <>
      <button
        type="button"
        data-testid="timesheet-pc__daily-allowance-button"
        className={ROOT}
        disabled={isLoading}
        onClick={isLoading ? undefined : openModal}
      >
        {isNil(availableAllowanceCount) ? (
          <PlusButton isLoading={isLoading} />
        ) : (
          <span className={`${ROOT}__tag`}>{availableAllowanceCount}</span>
        )}
      </button>
      {isOpen && (
        <Modal>
          <DailyAllowanceContainer
            dailyAllowanceList={dailyAllowanceList}
            isLocked={isLocked}
            availableAllowanceCount={availableAllowanceCount}
            date={date}
            onClose={closeModal}
          />
        </Modal>
      )}
    </>
  );
};

DailyAllowanceButton.displayName = 'DailyAllowanceButton';

export default DailyAllowanceButton;
