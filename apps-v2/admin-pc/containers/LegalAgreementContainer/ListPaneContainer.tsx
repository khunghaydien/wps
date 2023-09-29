import React, { useCallback, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import DetailAcions from '../../action-dispatchers/legal-agreement/detail';
import ListAcions from '../../action-dispatchers/legal-agreement/list';
import PanelAcions from '../../action-dispatchers/legal-agreement/panel';

import { State } from '../../reducers';

import ListPane from '../../presentational-components/LegalAgreement/ListPane';

type OwnProps = {
  title: string;
};

const mapStateToProps = (state: State) => ({
  selectedCode: state.legalAgreement.ui.list.selectedCode,
  itemList: state.searchLegalAgreement,
  selectedHistoryId: state.legalAgreement.ui.detail.selectedHistoryId,
  historyTargetDate: state.legalAgreement.ui.searchCondition.targetDate,
  value2msgkey: state.value2msgkey,
  sfObjFieldValues: state.sfObjFieldValues,
  companyId: state.base.menuPane.ui.targetCompanyId,
});

const ListPaneContainer: React.FC<OwnProps> = (ownProps) => {
  const dispatch = useDispatch();
  const detailActions = DetailAcions(dispatch);
  const listActions = ListAcions(dispatch);
  const panelAcions = PanelAcions(dispatch);

  const { companyId, sfObjFieldValues, ...stateProps } = useSelector(
    mapStateToProps,
    shallowEqual
  );

  const onClickCreateNewButton = useCallback(() => {
    detailActions.startEditingNewRecord(companyId, sfObjFieldValues);
  }, [detailActions, sfObjFieldValues]);

  const onChangeHistoryTargetDate = useCallback(
    (value: string) => {
      listActions.setSearchCondition('targetDate', value);
    },
    [listActions]
  );

  const searchList = useCallback(() => {
    listActions.search({
      companyId: companyId,
    });
  }, [listActions, companyId]);

  const onClickSearchButton = useCallback(() => {
    listActions.search({
      companyId: companyId,
      targetDate: stateProps.historyTargetDate,
    });
  }, [listActions, companyId, stateProps.historyTargetDate]);

  const onClickRow = useCallback(
    (
      _index: number,
      selectedRow: {
        [key: string]: any;
      }
    ) => {
      panelAcions.openDetailPanel(stateProps.itemList[selectedRow.originIndex]);
    },
    [panelAcions, stateProps.itemList]
  );

  useEffect(() => {
    listActions.resetSelectedIndex();
  }, [companyId]);

  return (
    <ListPane
      {...ownProps}
      {...stateProps}
      onClickCreateNewButton={onClickCreateNewButton}
      onChangeHistoryTargetDate={onChangeHistoryTargetDate}
      searchList={searchList}
      onClickSearchButton={onClickSearchButton}
      onClickRow={onClickRow}
    />
  );
};

export default ListPaneContainer;
