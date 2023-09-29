import React from 'react';

import styled from 'styled-components';

import { STATUS } from '@attendance/domain/models/LegalAgreementRequest';

import ApprovedIcon from '../../../images/approvedIcon.svg';
import PendingIcon from '../../../images/pendingIcon.svg';
import PendingIsForReapplyIcon from '../../../images/pendingIsForReapplyIcon.svg';
import RejectIcon from '../../../images/rejectIcon.svg';
import RejectIsForReapplyIcon from '../../../images/rejectIsForReapplyIcon.svg';

export type Props = {
  status: string | null | undefined;
  isForReapply?: boolean | null | undefined;
  selected?: boolean;
  disabled?: boolean;
  children: string | null;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const ItemButton = styled.button<{ selected: boolean; disabled: boolean }>`
  display: flex;
  width: 100%;
  padding: 6px 0 6px 20px;
  align-items: center;
  justify-content: flex-start;
  border: none;
  outline: none;
  background-color: ${({ selected }) => (selected ? '#ebf3f7' : '#fff')};
  color: ${({ disabled }) => (disabled ? '#ccc' : '#000')};
  text-align: left;

  &:hover:not(:disabled) {
    background-color: #f3f2f2;
  }
`;

const ItemButtonIcon = styled.div`
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ItemButtonContent = styled.div<{ selected: boolean }>`
  margin-left: 4px;
  color: ${({ selected }) => (selected ? '#2782ed' : 'none')};
  font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};
`;

const ContentName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  overflow-wrap: anywhere;
  width: 150px;
`;

const MAP_STATE_TO_ICON = {
  [STATUS.APPROVED]: <ApprovedIcon />,
  [STATUS.APPROVAL_IN]: <PendingIcon />,
  [STATUS.REJECTED]: <RejectIcon />,
  [STATUS.CANCELED]: <RejectIcon />,
  [STATUS.REMOVED]: <RejectIcon />,
};

const MAP_STATE_TO_ICON_IS_FOR_REAPPLY = {
  [STATUS.APPROVED]: <ApprovedIcon />, // 勤務表がロックされてる場合
  [STATUS.APPROVAL_IN]: <PendingIsForReapplyIcon />,
  [STATUS.REJECTED]: <RejectIsForReapplyIcon />,
  [STATUS.CANCELED]: <RejectIsForReapplyIcon />,
  [STATUS.REMOVED]: <RejectIsForReapplyIcon />,
};

const MenuItem: React.FC<Props> = ({
  status,
  isForReapply = false,
  selected = false,
  disabled = false,
  children,
  onClick,
}) => {
  const RequestIcon = isForReapply
    ? status && MAP_STATE_TO_ICON_IS_FOR_REAPPLY[status]
    : status && MAP_STATE_TO_ICON[status];

  return (
    <li>
      <ItemButton
        type="button"
        selected={selected}
        disabled={disabled}
        onClick={onClick}
      >
        <ItemButtonIcon>{RequestIcon}</ItemButtonIcon>
        <ItemButtonContent selected={selected}>
          <ContentName title={children}>{children}</ContentName>
        </ItemButtonContent>
      </ItemButton>
    </li>
  );
};

export default MenuItem;
