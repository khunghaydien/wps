import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import configList from '../../constants/configList/attendanceFeatureSetting';
import { FunctionTypeList } from '../../constants/functionType';

import { openDetailPanel } from '../../action-dispatchers/feature-setting/panel';

import { State } from '../../reducers';

import Component from '../../presentational-components/AttendanceFeatureSetting/MainContents/ListPane';

const ListContainer = (ownProps: {
  title: string;
  useFunction: FunctionTypeList;
}) => {
  const dispatch = useDispatch();
  const Actions = React.useMemo(
    () =>
      bindActionCreators(
        {
          openDetailPanel,
        },
        dispatch
      ),
    [dispatch]
  );

  const props = useSelector((state: State) => ({
    itemList: state.searchAttendanceFeatureSetting,
    value2msgkey: state.value2msgkey,
  }));

  const onClickRow = React.useCallback(
    (
      index: number,
      selectedRow: {
        [key: string]: any;
      }
    ) => {
      Actions.openDetailPanel(props.itemList[selectedRow.originIndex]);
    },
    [Actions, props.itemList]
  );
  return (
    <Component
      configList={configList}
      title={ownProps.title}
      useFunction={ownProps.useFunction}
      itemList={props.itemList}
      value2msgkey={props.value2msgkey}
      onClickRow={onClickRow}
    />
  );
};

export default ListContainer;
