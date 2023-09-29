import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import AllocateDictEditActions from '../../action-dispatchers/AutoHoursAllocateDict';

import DialogFrame from '../../components/DialogFrame';

import BlockScreen from './BlockScreenContainer';
import ContentContainer from './ContentContainer';
import Notification from './NotificationContainer';
import SpinnerContainer from './SpinnerContainer';

type Props = {
  empId: string;
  targetDate: string;
  onClose: () => void;
};

const Index: React.FC<Props> = ({ empId, targetDate, onClose }) => {
  const mapStateToProps = (state) => ({
    dictList: state.ui.allocateDic.byKey,
    basicSetting: state.ui.basicSetting,
  });

  const { dictList, basicSetting } = useSelector(mapStateToProps, shallowEqual);
  const dispatch = useDispatch();
  const allocateDic = AllocateDictEditActions(dispatch);

  const onClickSaveButton = () =>
    allocateDic.saveDict(empId, dictList, basicSetting);

  return (
    <>
      <DialogFrame onClose={onClose} onClickSaveButton={onClickSaveButton}>
        <ContentContainer empId={empId} targetDate={targetDate} />
      </DialogFrame>
      <BlockScreen />
      <Notification />
      <SpinnerContainer />
    </>
  );
};

export default Index;
