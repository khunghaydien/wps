import React, { useCallback, useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { initialState as listInitState } from '../../modules/pattern/ui/list';
import { initialState as conditionInitState } from '../../modules/pattern/ui/searchCondition';

import DetailActions from '../../action-dispatchers/pattern/detail';
import ListActions from '../../action-dispatchers/pattern/list';
import PanelActions from '../../action-dispatchers/pattern/panel';

import { State } from '../../reducers';

import ListPane from '../../presentational-components/AttPattern/ListPane';

const RECORD_LIMIT = 5000;
export const RECORD_LIMIT_PER_PAGE = 200;

export type OwnProps = {
  title: string;
};

const mapStateToProps = (state: State) => ({
  patterns: state.searchAttPattern,
  value2msgkey: state.value2msgkey,
  sfObjFieldValues: state.sfObjFieldValues,
  companyId: state.base.menuPane.ui.targetCompanyId,
  searchCondition: state.pattern.ui.searchCondition,
  selectedRowIndex: state.base.listPane.ui.list.selectedRowIndex,
  limit: RECORD_LIMIT,
  limitPerPage: RECORD_LIMIT_PER_PAGE,
  sortCondition: state.pattern.ui.list.sortOrder,
  currentPage: state.base.listPane.ui.paging.current,
  total: state.pattern.ui.list.total,
  offsetCodes: state.pattern.ui.list.offsetCodes,
  isOverLimit: state.pattern.ui.list.hasMoreRecords,
});

const useMapDispatchToProps = () => {
  const dispatch = useDispatch();

  return useMemo(() => {
    const detailActions = DetailActions(dispatch);
    const listActions = ListActions(dispatch);
    const panelAcions = PanelActions(dispatch);

    return {
      getConstantsAttPattern: listActions.getConstantsAttPattern,
      init: listActions.init,
      setSearchCondition: listActions.setSearchCondition,
      saveCondition: listActions.saveCondition,
      search: listActions.search,
      turnPage: listActions.turnPage,
      setSelectedRowIndex: listActions.setSelectedRowIndex,
      startEditingNewRecord: detailActions.startEditingNewRecord,
      openDetailPanel: panelAcions.openDetailPanel,
    };
  }, [dispatch]);
};

const ListPaneContainer: React.FC<OwnProps> = (ownProps) => {
  const {
    companyId,
    sfObjFieldValues,
    currentPage,
    limit,
    isOverLimit,
    total,
    offsetCodes,
    searchCondition,
    sortCondition,
    limitPerPage,
    ...stateProps
  } = useSelector(mapStateToProps, shallowEqual);

  const {
    getConstantsAttPattern,
    init: $init,
    search,
    turnPage,
    startEditingNewRecord,
    openDetailPanel,
    setSearchCondition,
    saveCondition,
    setSelectedRowIndex,
  } = useMapDispatchToProps();

  const [originalCondition, newCondition] = useMemo(
    () => [searchCondition.origin, searchCondition.new],
    [searchCondition]
  );

  const pageCondition = useMemo(
    () => ({
      currentPage,
      limitPerPage,
      limit,
      total,
      isOverLimit,
    }),
    [currentPage, isOverLimit, limit, limitPerPage, total]
  );

  const onClickCreateNewButton = useCallback(() => {
    setSelectedRowIndex(-1);
    startEditingNewRecord(companyId, sfObjFieldValues);
  }, [setSelectedRowIndex, startEditingNewRecord, companyId, sfObjFieldValues]);

  const onClickSearchButton = useCallback(() => {
    saveCondition(newCondition);
    search(
      { ...newCondition, companyId },
      sortCondition,
      limitPerPage,
      isOverLimit,
      false,
      false
    );
  }, [
    saveCondition,
    newCondition,
    sortCondition,
    limitPerPage,
    isOverLimit,
    search,
    companyId,
  ]);

  const onClickPagerLink = useCallback(
    (currentPage: number) => {
      const offsetCode = offsetCodes[currentPage - 1];
      turnPage(
        { ...originalCondition, companyId },
        sortCondition,
        limitPerPage,
        offsetCode,
        currentPage
      );
    },
    [
      companyId,
      offsetCodes,
      originalCondition,
      limitPerPage,
      sortCondition,
      turnPage,
    ]
  );

  const onClickListHeaderCell = useCallback(
    (field: string) => {
      search(
        { ...originalCondition, companyId },
        {
          ...sortCondition,
          field,
        },
        limitPerPage,
        isOverLimit,
        true,
        false
      );
    },
    [
      companyId,
      search,
      originalCondition,
      isOverLimit,
      limitPerPage,
      sortCondition,
    ]
  );

  const onClickListRow = useCallback(
    (
      selectedRow: {
        [key: string]: any;
      },
      index: number
    ) => {
      setSelectedRowIndex(index);
      openDetailPanel(selectedRow);
    },
    [openDetailPanel, setSelectedRowIndex]
  );

  const init = useCallback(() => {
    setSelectedRowIndex(-1);
    $init(
      { ...conditionInitState.origin, companyId },
      listInitState.sortOrder,
      limitPerPage
    );
  }, [$init, companyId, limitPerPage, setSelectedRowIndex]);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    getConstantsAttPattern();
  }, []);

  return (
    <ListPane
      {...ownProps}
      {...stateProps}
      searchCondition={newCondition}
      sortCondition={sortCondition}
      limitPerPage={limitPerPage}
      pageCondition={pageCondition}
      onClickSearchButton={onClickSearchButton}
      onClickCreateNewButton={onClickCreateNewButton}
      onChangeSearchValue={setSearchCondition}
      onClickPagerLink={onClickPagerLink}
      onClickListHeaderCell={onClickListHeaderCell}
      onClickListRow={onClickListRow}
    />
  );
};

export default ListPaneContainer;
