import * as React from 'react';
import { useSelector } from 'react-redux';

import { State } from '../modules';

import DailySummaryTriggerButton from '../components/DailySummaryTriggerButton';

type OwnProps = {
  'data-testid'?: string;
  children: React.ReactNode;
  className?: string;
  onClick: (e: React.SyntheticEvent) => void;
};

const DailySummaryButtonContainer: React.FC<OwnProps> = (props: OwnProps) => {
  const userSetting = useSelector((state: State) => state.userSetting);
  const onClick = React.useCallback(
    (e: React.SyntheticEvent) => {
      // TODO Remove @ts-ignore after migrating userSetting reducer
      // @ts-ignore
      if (userSetting.useWorkTime) {
        props.onClick(e);
      }
    },
    [props.onClick]
  );

  return <DailySummaryTriggerButton {...props} onClick={onClick} />;
};

export default React.memo<OwnProps>(DailySummaryButtonContainer);
