import React, { useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import AllocateResultEditActions from '../../action-dispatchers/AllocateResult';
import AppActions from '../../action-dispatchers/App';

import Content, { HandlerProps, ValueProps } from '../../components/Content';

type OwnProps = {
  empId: string | undefined;
  targetDate: string;
};

const mapStateToProps = (state): Omit<ValueProps, keyof OwnProps> => ({
  jobList: state.entities.jobList,
  resultList: state.ui.allocateResult.editing,
  checkAll: state.ui.allocateResult.checkAll,
});

const useMapDispatchToProps = ({
  targetDate,
}: {
  targetDate: string;
}): Omit<HandlerProps, keyof OwnProps> => {
  const dispatch = useDispatch();

  return useMemo(() => {
    const allocateResult = AllocateResultEditActions(dispatch);
    const app = AppActions(dispatch);

    return {
      toggleCheckAll: allocateResult.toggleCheckAll,
      toggleCheckbox: allocateResult.toggleCheckbox,
      selectJob: allocateResult.selectJobFromDropdown,
      selectWork: allocateResult.selectWorkCategory,
      selectTaskTime: allocateResult.selectTaskTime,
      onOkForJobSelectDialog: allocateResult.selectJobFromDialog,
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
