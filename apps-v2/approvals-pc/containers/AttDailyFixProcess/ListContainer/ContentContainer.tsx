import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { State } from '@apps/approvals-pc/modules';
import { actions as $checkedAction } from '@apps/approvals-pc/modules/ui/attFixDaily/checked';
import { actions as $recordsAction } from '@apps/approvals-pc/modules/ui/attFixDaily/records';
import { actions as $selectedIdAction } from '@apps/approvals-pc/modules/ui/attFixDaily/selectedId';

import Component from '@apps/approvals-pc/components/attendance/AttDailyFixProcess/List/Content';

import useCheckAll from '@attendance/ui/pc/approval-pc/hooks/useCheckAll';

const ContentContainer: React.FC = () => {
  const dispatch = useDispatch();
  const recordsAction = React.useMemo(
    () => bindActionCreators($recordsAction, dispatch),
    [dispatch]
  );
  const checkedAction = React.useMemo(
    () => bindActionCreators($checkedAction, dispatch),
    [dispatch]
  );
  const selectedIdAction = React.useMemo(
    () => bindActionCreators($selectedIdAction, dispatch),
    [dispatch]
  );
  const originalRecords = useSelector(
    (state: State) => state.ui.attFixDaily.records.originalRecords
  );
  const records = useSelector(
    (state: State) => state.ui.attFixDaily.records.records
  );
  const order = useSelector(
    (state: State) => state.ui.attFixDaily.records.order
  );
  const selectedId = useSelector(
    (state: State) => state.ui.attFixDaily.selectedId
  );
  const checkedIds = useSelector(
    (state: State) => state.ui.attFixDaily.checked.ids
  );
  const maxSelection = useSelector(
    (state: State) => state.ui.attFixDaily.checked.max
  );
  const targetIds = React.useMemo(() => records.map(({ id }) => id), [records]);
  const {
    checkAll: onCheckAll,
    checkedAll,
    check: onCheckRow,
  } = useCheckAll<string>({
    targets: targetIds,
    checked: checkedIds,
    setChecked: checkedAction.set,
    max: maxSelection,
  });
  const onClickRow = React.useCallback(
    (requestId) => {
      if (selectedId === requestId) {
        selectedIdAction.clear();
      } else {
        selectedIdAction.set(requestId);
      }
    },
    [selectedId, selectedIdAction]
  );

  React.useEffect(
    () => () => {
      checkedAction.clear();
    },
    [checkedAction, originalRecords]
  );

  return (
    <Component
      maxSelection={maxSelection}
      requests={records}
      order={order}
      selectedId={selectedId}
      checkedIds={checkedIds}
      checkedAll={checkedAll}
      onClickSort={recordsAction.sort}
      onClickRow={onClickRow}
      onCheckRow={onCheckRow}
      onCheckAll={onCheckAll}
      onChangeMaxSelection={checkedAction.setMax}
    />
  );
};

export default ContentContainer;
