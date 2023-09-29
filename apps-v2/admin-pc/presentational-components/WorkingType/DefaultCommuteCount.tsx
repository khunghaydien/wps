import * as React from 'react';

import SelectField from '../../../commons/components/fields/SelectField';
import msg from '../../../commons/languages';

import {
  COMMUTE_STATE,
  CommuteState,
  toCommuteCount,
  toCommuteState,
} from '@attendance/domain/models/CommuteCount';

import { Config } from '@apps/admin-pc/utils/ConfigUtil';

type Props = {
  config: Config;
  commuteCountKeys: {
    [key: string]: string;
  };
  disabled: boolean;
  tmpEditRecord: Record<string, any>;
  onChangeDetailItem: (arg0: string, arg1: any) => void;
};

const DefaultCommuteCount: React.FC<Props> = (props) => {
  const {
    config,
    commuteCountKeys,
    disabled,
    tmpEditRecord,
    onChangeDetailItem,
  } = props;

  React.useEffect(() => {
    onChangeDetailItem(
      config.key,
      toCommuteState({
        forwardCount: tmpEditRecord.defaultCommuteForwardCount,
        backwardCount: tmpEditRecord.defaultCommuteBackwardCount,
      })
    );
  }, [tmpEditRecord[config.key]]);
  return (
    <SelectField
      value={toCommuteState({
        forwardCount: tmpEditRecord.defaultCommuteForwardCount,
        backwardCount: tmpEditRecord.defaultCommuteBackwardCount,
      })}
      options={[
        {
          text: msg().Att_Lbl_CommuteCountUnentered,
          value: COMMUTE_STATE.UNENTERED,
        },
        {
          text: msg().Att_Lbl_CommuteCountNone,
          value: COMMUTE_STATE.NONE,
        },
        {
          text: msg().Att_Lbl_CommuteCountBothWays,
          value: COMMUTE_STATE.BOTH_WAYS,
        },
        {
          text: msg().Att_Lbl_CommuteCountForward,
          value: COMMUTE_STATE.FORWARD,
        },
        {
          text: msg().Att_Lbl_CommuteCountBackward,
          value: COMMUTE_STATE.BACKWARD,
        },
      ]}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
        const {
          forwardCount: defaultCommuteForwardCount,
          backwardCount: defaultCommuteBackwardCount,
        } = toCommuteCount(e.currentTarget.value as CommuteState);
        onChangeDetailItem(config.key, e.currentTarget.value);
        onChangeDetailItem(
          commuteCountKeys.defaultCommuteForwardCount,
          defaultCommuteForwardCount
        );
        onChangeDetailItem(
          commuteCountKeys.defaultCommuteBackwardCount,
          defaultCommuteBackwardCount
        );
      }}
      disabled={disabled}
    />
  );
};

export default DefaultCommuteCount;
