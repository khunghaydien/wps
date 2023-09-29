import React, { useState } from 'react';

import Button from '@apps/commons/components/buttons/Button';
import RefreshIcon from '@apps/commons/images/icons/refresh.svg';
import msg from '@apps/commons/languages';

import './index.scss';

const ROOT = 'ts-psa__toggle-view';

type Props = {
  planningCycle: string;
  onSelectWeeklyMonthlyView: (intervalType: string) => void;
  setSelectedView: (intervalType: string) => void;
  selectedView?: string;
};
const FinanceToggleView = (props: Props) => {
  const [selectedView, setSelectedView] = useState(
    props.selectedView ? props.selectedView : 'Monthly'
  );
  const isViewSelected = (viewType: string) =>
    viewType === selectedView ? 'is-active' : '';
  return (
    <div className={`${ROOT}`}>
      <Button
        className={`${ROOT}__refresh-btn`}
        data-testid={`${ROOT}__refresh-btn`}
        onClick={() => props.onSelectWeeklyMonthlyView(selectedView)}
      >
        <RefreshIcon />
      </Button>
      <div className={`${ROOT}__select-view-mode`}>
        <Button
          data-testid={`${ROOT}__btn--week`}
          className={isViewSelected('Weekly')}
          onClick={() => {
            if (selectedView !== 'Weekly') {
              props.onSelectWeeklyMonthlyView('Weekly');
              setSelectedView('Weekly');
              props.setSelectedView('Weekly');
            }
          }}
          disabled={props.planningCycle === 'Monthly'}
        >
          {msg().Cal_Lbl_Week}
        </Button>
        <Button
          data-testid={`${ROOT}__btn--month`}
          className={isViewSelected('Monthly')}
          onClick={() => {
            if (selectedView !== 'Monthly') {
              props.onSelectWeeklyMonthlyView('Monthly');
              setSelectedView('Monthly');
              props.setSelectedView('Monthly');
            }
          }}
        >
          {msg().Com_Lbl_Month}
        </Button>
      </div>
    </div>
  );
};

export default FinanceToggleView;
