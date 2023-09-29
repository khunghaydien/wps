import React, { useCallback, useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { OPTION_VALUE } from '../../../../modules/workingType/ui/pattern/tab';

import PatternActions, {
  ListPattern,
} from '../../../../action-dispatchers/working-type/pattern';

import { State } from '../../../../reducers';

import Content from '../../../../presentational-components/WorkingType/Fields/AttPattern/Content';
import PatternDialog from '../../../../presentational-components/WorkingType/Fields/AttPattern/PatternDialog';

export type Props = React.ComponentProps<
  React.ComponentProps<typeof PatternDialog>['ContentContainer']
>;

const mapStateToProps = (state: State) => ({
  patterns: state.searchAttPattern,
  companyId: state.base.menuPane.ui.targetCompanyId,
  searchCondition: state.pattern.ui.searchCondition,
  limit: state.pattern.ui.paging.limit,
  limitPerPage: state.pattern.ui.paging.limitPerPage,
  sortCondition: state.pattern.ui.list.sortOrder,
  currentPage: state.pattern.ui.paging.current,
  total: state.pattern.ui.list.total,
  offsetCodes: state.pattern.ui.list.offsetCodes,
  isOverLimit: state.pattern.ui.list.hasMoreRecords,
  detailSelectedPattern:
    state.workingType.ui.pattern.selectedPattern.selectedPattern,
  selectedPatterns: state.workingType.ui.pattern.selectedTable.selectedTable,
  selectedSortOrder: state.workingType.ui.pattern.selectedTable.sortOrder,
  selectedTab: state.workingType.ui.pattern.tab.tabValue,
});

const useMapDispatchToProps = () => {
  const dispatch = useDispatch();

  return useMemo(() => {
    const patternActions = PatternActions(dispatch);

    return {
      init: patternActions.initDialog,
      setSearchCondition: patternActions.setSearchCondition,
      saveCondition: patternActions.saveCondition,
      search: patternActions.search,
      turnPage: patternActions.turnPage,
      sortTable: patternActions.sortSelectedTable,
      onClickRow: patternActions.onClickRow,
      setTab: patternActions.setTabValue,
    };
  }, [dispatch]);
};

const ContentContainer: React.FC<Props> = ({ isOpen, workSystem }) => {
  const {
    companyId,
    currentPage,
    limit,
    isOverLimit,
    total,
    offsetCodes,
    searchCondition,
    sortCondition,
    limitPerPage,
    detailSelectedPattern,
    selectedSortOrder,
    selectedPatterns,
    ...stateProps
  } = useSelector(mapStateToProps, shallowEqual);

  const {
    init: $init,
    search,
    turnPage,
    setSearchCondition,
    saveCondition,
    sortTable,
    onClickRow,
    setTab,
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

  const onClickSearchButton = useCallback(() => {
    saveCondition(newCondition);
    search(
      { ...newCondition, companyId, workSystem },
      sortCondition,
      limitPerPage,
      false
    );
  }, [
    saveCondition,
    newCondition,
    search,
    companyId,
    workSystem,
    sortCondition,
    limitPerPage,
  ]);

  const onClickPagerLink = useCallback(
    (currentPage: number) => {
      const offsetCode = offsetCodes[currentPage - 1];
      turnPage(
        { ...originalCondition, companyId, workSystem },
        sortCondition,
        limitPerPage,
        offsetCode,
        currentPage
      );
    },
    [
      offsetCodes,
      turnPage,
      originalCondition,
      companyId,
      workSystem,
      sortCondition,
      limitPerPage,
    ]
  );

  const onClickListHeaderCell = useCallback(
    (field: string) => {
      search(
        { ...originalCondition, companyId, workSystem },
        {
          ...sortCondition,
          field,
        },
        limitPerPage,
        true
      );
    },
    [
      search,
      originalCondition,
      companyId,
      workSystem,
      sortCondition,
      limitPerPage,
    ]
  );

  const sortSelectedTable = useCallback(
    () => sortTable(selectedSortOrder),
    [selectedSortOrder, sortTable]
  );

  const onClickListRow = useCallback(
    (
      selectedRow: {
        [key: string]: any;
      },
      _index: number
    ) => {
      onClickRow(selectedRow as ListPattern);
    },
    [onClickRow]
  );

  const init = useCallback(() => {
    $init(companyId, workSystem, limitPerPage, detailSelectedPattern);
  }, [$init, companyId, workSystem, limitPerPage, detailSelectedPattern]);

  useEffect(() => {
    if (isOpen) {
      init();
      if (detailSelectedPattern.length > 0) {
        setTab(OPTION_VALUE.CHOSEN);
      }
    }
  }, [isOpen, detailSelectedPattern]);

  return (
    <Content
      {...stateProps}
      selectedPatterns={selectedPatterns}
      searchCondition={newCondition}
      sortCondition={sortCondition}
      selectedSortOrder={selectedSortOrder}
      pageCondition={pageCondition}
      onClickSearchButton={onClickSearchButton}
      onChangeSearchValue={setSearchCondition}
      onClickPagerLink={onClickPagerLink}
      onClickListHeaderCell={onClickListHeaderCell}
      onClickRow={onClickListRow}
      sortSelectedTable={sortSelectedTable}
      setTab={setTab}
    />
  );
};

export default ContentContainer;
