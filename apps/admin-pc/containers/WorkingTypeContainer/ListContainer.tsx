import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import configList from '../../constants/configList/workingType';
import { FunctionTypeList } from '../../constants/functionType';

import { actions as listActions } from '../../modules/workingType/ui/list';
import { actions as searchConditionActions } from '../../modules/workingType/ui/searchCondition';

import { startEditingNewRecord } from '../../action-dispatchers/working-type/detail';
import { search } from '../../action-dispatchers/working-type/list';
import { openDetailPanel } from '../../action-dispatchers/working-type/panel';

import { State } from '../../reducers';

import Component from '../../presentational-components/WorkingType/MainContents/ListPane';

const ListContainer = (ownProps: {
  title: string;
  useFunction: FunctionTypeList;
}) => {
  const dispatch = useDispatch();
  const Actions = React.useMemo(
    () =>
      bindActionCreators(
        {
          startEditingNewRecord,
          openDetailPanel,
          setSearchCondition: searchConditionActions.set,
          search,
          resetSelectedIndex: listActions.resetSelectedIndex,
        },
        dispatch
      ),
    [dispatch]
  );

  const props = useSelector((state: State) => ({
    selectedCode: state.workingType.ui.list.selectedCode,
    itemList: state.searchWorkingType,
    selectedHistoryId: state.workingType.ui.detail.selectedHistoryId,
    searchCondition: state.workingType.ui.searchCondition,
    value2msgkey: state.value2msgkey,
    sfObjFieldValues: state.sfObjFieldValues,
    companyId: state.base.menuPane.ui.targetCompanyId,
  }));

  const onClickCreateNewButton = React.useCallback(() => {
    Actions.startEditingNewRecord(props.companyId, props.sfObjFieldValues);
  }, [Actions, props.sfObjFieldValues]);

  const onChangeHistoryTargetDate = React.useCallback(
    (value: string) => {
      Actions.setSearchCondition('targetDate', value);
    },
    [Actions]
  );

  const onClickSearchButton = React.useCallback(() => {
    Actions.search({
      companyId: props.companyId,
      targetDate: props.searchCondition.targetDate,
    });
  }, [Actions, props.companyId, props.searchCondition.targetDate]);

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

  React.useEffect(() => {
    Actions.resetSelectedIndex();
  }, [props.companyId]);

  return (
    <Component
      configList={configList}
      title={ownProps.title}
      useFunction={ownProps.useFunction}
      selectedCode={props.selectedCode}
      itemList={props.itemList}
      historyTargetDate={props.searchCondition.targetDate}
      value2msgkey={props.value2msgkey}
      onChangeHistoryTargetDate={onChangeHistoryTargetDate}
      onClickCreateNewButton={onClickCreateNewButton}
      onClickSearchButton={onClickSearchButton}
      onClickRow={onClickRow}
    />
  );
};

export default ListContainer;
