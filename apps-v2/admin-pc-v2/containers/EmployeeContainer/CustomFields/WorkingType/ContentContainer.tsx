import React, { useCallback, useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import WorkingTypeActions from '../../../../action-dispatchers/employee/WorkingType';

import { State as V2State } from '../../../../reducers';
import { State } from '@admin-pc/reducers';

import Content from '../../../../presentational-components/Employee/WorkingType/Content';

export type Props = {
  targetDate: string;
  companyId: string;
};

const mapStateToProps = (state: State) => ({
  workingTypes: state.searchWorkingType,
  searchCondition: state.workingType.ui.searchCondition,
  limit: state.workingType.ui.paging.limit,
  limitPerPage: state.workingType.ui.paging.limitPerPage,
  sortCondition: state.workingType.ui.list.sortOrder,
  currentPage: state.workingType.ui.paging.current,
  total: state.workingType.ui.list.total,
  offsetCodes: state.workingType.ui.list.offsetCodes,
  isOverLimit: state.workingType.ui.list.hasMoreRecords,
});

const useMapDispatchToProps = () => {
  const dispatch = useDispatch();

  return useMemo(() => {
    const workingTypeActions = WorkingTypeActions(dispatch);

    return {
      init: workingTypeActions.init,
      setSearchCondition: workingTypeActions.setSearchCondition,
      saveCondition: workingTypeActions.saveCondition,
      search: workingTypeActions.search,
      turnPage: workingTypeActions.turnPage,
      onClickRow: workingTypeActions.onClickRow,
    };
  }, [dispatch]);
};

const ContentContainer: React.FC<Props> = ({ targetDate, companyId }) => {
  const {
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

  const selectedWorkingType = useSelector(
    (state: V2State) => state.employee.ui.workingTypeDialog.workingType,
    shallowEqual
  );

  const {
    init: $init,
    search,
    turnPage,
    setSearchCondition,
    saveCondition,
    onClickRow,
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
    search({ ...newCondition, companyId }, sortCondition, limitPerPage, false);
  }, [
    saveCondition,
    newCondition,
    search,
    companyId,
    sortCondition,
    limitPerPage,
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
      offsetCodes,
      turnPage,
      originalCondition,
      companyId,
      sortCondition,
      limitPerPage,
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
        true
      );
    },
    [search, originalCondition, companyId, sortCondition, limitPerPage]
  );

  const onClickListRow = useCallback(
    (selectedRow, _index) => {
      onClickRow(selectedRow);
    },
    [onClickRow]
  );

  const init = useCallback(() => {
    $init(companyId, targetDate, limitPerPage);
  }, [$init, companyId, targetDate, limitPerPage]);

  useEffect(() => {
    init();
  }, []);

  return (
    <Content
      {...stateProps}
      selectedWorkingType={selectedWorkingType}
      targetDate={targetDate}
      searchCondition={newCondition}
      sortCondition={sortCondition}
      limitPerPage={limitPerPage}
      pageCondition={pageCondition}
      onClickSearchButton={onClickSearchButton}
      onChangeSearchValue={setSearchCondition}
      onClickPagerLink={onClickPagerLink}
      onClickListHeaderCell={onClickListHeaderCell}
      onClickRow={onClickListRow}
    />
  );
};

export default ContentContainer;
