import React from 'react';
import { useSelector } from 'react-redux';

import styled from 'styled-components';

import { State } from '../../../reducers';

import { OpenAutoHoursAllocateDictDialogButton } from '@apps/time-tracking/AutoHoursAllocateDictDialog';

// NOTE: 承認者01などの「社員選択」ボタンと見た目を同じにする
const StyledButton = styled(OpenAutoHoursAllocateDictDialogButton)`
  padding: 0 6px;
  font-size: 12px;
  color: #53688c;
  :disabled {
    color: #aaa;
  }
`;

type OwnProps = {
  disabled: boolean;
  tmpEditRecordBase: { id: string };
  tmpEditRecord: { validDateFrom: string };
};

const mapStateToProps = (state: State) => ({
  userPermission: state.common.accessControl.permission,
});

const TimeAutoHoursAllocateDictFieldContainer: React.FC<OwnProps> = ({
  disabled,
  tmpEditRecord,
  tmpEditRecordBase,
}) => {
  const stateProps = useSelector(mapStateToProps);
  return (
    <StyledButton
      disabled={disabled}
      empId={tmpEditRecordBase.id}
      targetDate={tmpEditRecord.validDateFrom}
      userPermission={stateProps.userPermission}
      color="default"
    />
  );
};

export default TimeAutoHoursAllocateDictFieldContainer;
