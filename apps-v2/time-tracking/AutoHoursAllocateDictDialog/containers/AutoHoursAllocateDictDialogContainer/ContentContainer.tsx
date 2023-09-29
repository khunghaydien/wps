import React, { useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { State } from '../../modules';

import AppActions from '../../action-dispatchers/App';
import AllocateDictEditActions from '../../action-dispatchers/AutoHoursAllocateDict';

import Content, { HandlerProps, ValueProps } from '../../components/Content';

type OwnProps = {
  empId: string;
  targetDate: string;
};

const mapStateToProps = (state: State): Omit<ValueProps, keyof OwnProps> => ({
  jobList: state.entities.jobList,
  dictList: state.ui.allocateDic.byKey,
  dictListAllKeys: state.ui.allocateDic.allKeys,
  basicSetting: state.ui.basicSetting,
  errors: state.ui.allocateDic.errors,
});

const useMapDispatchToProps = ({
  targetDate,
}: {
  targetDate: string;
}): Omit<HandlerProps, keyof OwnProps> => {
  const dispatch = useDispatch();

  return useMemo(() => {
    const allocateDic = AllocateDictEditActions(dispatch);
    const app = AppActions(dispatch);

    return {
      // dictionary table
      selectJob: allocateDic.selectJobFromDropdown,
      selectWorkCategory: allocateDic.editWorkCategory,
      editPriority: allocateDic.editPriority,
      editItemField: allocateDic.editItemField,
      addItem: allocateDic.addItem,
      deleteItem: allocateDic.deleteItem,
      onOkForJobSelectDialog: allocateDic.selectJobFromDialog,

      // basic setting
      selectBasicJob: allocateDic.selectBasicJobFromDropdown,
      editBasicWorkCategory: allocateDic.editBasicWorkCategory,
      editOverlappingEvent: allocateDic.editOverlappingEvent,
      editExceedActWorkHour: allocateDic.editExceedActWorkHour,
      onOkForBasicJobSelectDialog: allocateDic.selectBasicJobFromDialog,

      onErrorForJobSelectDialog: app.showErrorNotification,
    };
  }, [dispatch, targetDate]);
};

const ContentContainer: React.FC<OwnProps> = ({ empId, targetDate }) => {
  const stateProps = useSelector(mapStateToProps, shallowEqual);
  const dispatchProps = useMapDispatchToProps({ targetDate });

  return (
    <Content
      empId={empId}
      targetDate={targetDate}
      {...stateProps}
      {...dispatchProps}
    />
  );
};

export default ContentContainer;
