import React, { useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { FunctionTypeList } from '../../constants/functionType';

import DetailActions from '../../action-dispatchers/pattern/detail';
import ListActions from '../../action-dispatchers/pattern/list';
import PanelActions from '../../action-dispatchers/pattern/panel';

import { State } from '../../reducers';

import DetailPane from '../../presentational-components/AttPattern/DetailPane';

import { RECORD_LIMIT_PER_PAGE } from './ListPaneContainer';

export type OwnProps = {
  useFunction: FunctionTypeList;
};

const mapStateToProps = (state: State) => ({
  modeBase: state.detailPane.ui.modeBase,
  editRecord: state.editRecord,
  tmpEditRecord: state.tmpEditRecord,
  companyId: state.base.menuPane.ui.targetCompanyId,
  sfObjFieldValues: state.sfObjFieldValues,
  getOrganizationSetting: state.getOrganizationSetting,
  searchCondition: state.pattern.ui.searchCondition,
  limitPerPage: RECORD_LIMIT_PER_PAGE,
  sortOrder: state.pattern.ui.list.sortOrder,
  isOverLimit: state.pattern.ui.list.hasMoreRecords,
  currentPage: state.base.listPane.ui.paging.current,
  offsetCodes: state.pattern.ui.list.offsetCodes,
});

const useMapDispatchToProps = () => {
  const dispatch = useDispatch();

  return React.useMemo(() => {
    const detailActions = DetailActions(dispatch);
    const panelAcions = PanelActions(dispatch);
    const listActions = ListActions(dispatch);

    return {
      create: detailActions.create,
      changeRecordValue: detailActions.changeRecordValue,
      updateBase: detailActions.updateBase,
      remove: detailActions.remove,
      startEditingBase: detailActions.startEditingBase,
      cancelEditing: detailActions.cancelEditing,
      closeDetailPanel: panelAcions.closeDetailPanel,
      setSelectedRowIndex: listActions.setSelectedRowIndex,
    };
  }, [dispatch]);
};

const DetailPaneContainer: React.FC<OwnProps> = ({ useFunction }) => {
  const stateProps = useSelector(mapStateToProps, shallowEqual);
  const {
    editRecord,
    tmpEditRecord,
    searchCondition,
    companyId,
    limitPerPage,
    sortOrder,
    isOverLimit,
    currentPage,
    offsetCodes,
  } = stateProps;

  const originalCondition = React.useMemo(
    () => searchCondition.origin,
    [searchCondition]
  );

  const {
    create,
    changeRecordValue,
    updateBase,
    remove,
    startEditingBase,
    cancelEditing,
    closeDetailPanel,
    setSelectedRowIndex,
  } = useMapDispatchToProps();

  const createHandler = useCallback(() => {
    create(
      editRecord,
      tmpEditRecord,
      useFunction,
      companyId,
      originalCondition,
      sortOrder,
      limitPerPage,
      isOverLimit
    );
  }, [
    create,
    editRecord,
    tmpEditRecord,
    useFunction,
    companyId,
    originalCondition,
    sortOrder,
    limitPerPage,
    isOverLimit,
  ]);

  const changeRecordValueHandler = useCallback(changeRecordValue, [
    changeRecordValue,
  ]);

  const updateBaseHandler = useCallback(() => {
    const offsetCode = offsetCodes[currentPage - 1];
    const pagingCondition = { offsetCode, currentPage };

    updateBase(
      editRecord,
      tmpEditRecord,
      useFunction,
      companyId,
      originalCondition,
      sortOrder,
      limitPerPage,
      isOverLimit,
      pagingCondition
    );
  }, [
    offsetCodes,
    currentPage,
    updateBase,
    editRecord,
    tmpEditRecord,
    useFunction,
    companyId,
    originalCondition,
    sortOrder,
    limitPerPage,
    isOverLimit,
  ]);

  const removeHandler = useCallback(() => {
    remove(
      tmpEditRecord.id,
      companyId,
      originalCondition,
      sortOrder,
      limitPerPage,
      isOverLimit
    );
  }, [
    remove,
    tmpEditRecord.id,
    companyId,
    originalCondition,
    sortOrder,
    limitPerPage,
    isOverLimit,
  ]);

  const startEditingBaseHandler = useCallback(() => {
    startEditingBase(editRecord);
  }, [startEditingBase, editRecord]);

  const cancelEditingHandler = useCallback(() => {
    cancelEditing(editRecord);
  }, [cancelEditing, editRecord]);

  const closeDetailPanelHandler = useCallback(() => {
    setSelectedRowIndex(-1);
    closeDetailPanel();
  }, [closeDetailPanel, setSelectedRowIndex]);

  return (
    <DetailPane
      {...stateProps}
      isSinglePane={false}
      useFunction={useFunction}
      onClickSaveButton={createHandler}
      onChangeDetailItem={changeRecordValueHandler}
      onClickUpdateButton={updateBaseHandler}
      onClickDeleteButton={removeHandler}
      onClickEditDetailButton={startEditingBaseHandler}
      onClickCancelEditButton={cancelEditingHandler}
      onClickCancelButton={closeDetailPanelHandler}
    />
  );
};

export default DetailPaneContainer;
