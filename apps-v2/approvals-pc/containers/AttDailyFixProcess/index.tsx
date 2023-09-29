import * as React from 'react';
import { useSelector, useStore } from 'react-redux';

import { State } from '@apps/approvals-pc/modules';
import * as tabs from '@apps/approvals-pc/modules/ui/tabs';

import Component from '@apps/approvals-pc/components/attendance/AttDailyFixProcess';

import DetailContainer from './DetailContainer';
import ListContainer from './ListContainer';
import subscriber from './subscriber';

const AttDailyFixProcessContainer: React.FC = () => {
  const store = useStore();
  const openedDetail = useSelector(
    (state: State) => !!state.ui.attFixDaily.selectedId
  );
  const selected = useSelector(
    (state: State) => state.ui.tabs.selected === tabs.tabType.ATT_FIX_DAILY
  );

  React.useEffect(() => {
    if (!selected) {
      return;
    }
    return subscriber(store);
  }, [store, selected]);

  if (!selected) {
    return null;
  }

  return (
    <Component
      openedDetail={openedDetail}
      List={ListContainer}
      Detail={DetailContainer}
    />
  );
};

export default AttDailyFixProcessContainer;
