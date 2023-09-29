import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { State } from '@apps/approvals-pc/modules';
import { actions as selectedIdAction } from '@apps/approvals-pc/modules/ui/attFixDaily/selectedId';

import Component from '@apps/approvals-pc/components/attendance/AttDailyFixProcess/Detail/Header';

const HeaderContainer: React.FC = () => {
  const dispatch = useDispatch();
  const selectedId = useSelector(
    (state: State) => state.ui.attFixDaily.selectedId
  );
  const record = useSelector((state: State) =>
    state.ui.attFixDaily.records.originalRecords.find(
      ({ id }) => id === selectedId
    )
  );
  const onClickClose = React.useCallback(() => {
    dispatch(selectedIdAction.clear());
  }, [dispatch]);

  if (!selectedId) {
    return null;
  }

  return <Component record={record} onClickClose={onClickClose} />;
};

export default HeaderContainer;
