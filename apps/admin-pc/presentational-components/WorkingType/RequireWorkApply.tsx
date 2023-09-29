import React from 'react';

import AttTimeField from '../../../commons/components/fields/AttTimeField';
import { parseIntOrStringNull } from '../../../commons/utils/NumberUtil';
import TimeUtil from '../../../commons/utils/TimeUtil';

import createDelayInitializeComponent from '../DelayInitializeComponent';

type Props = {
  config: {
    key: string;
    isRequired: boolean;
  };
  disabled: boolean;
  tmpEditRecord: Record<string, any>;
  mode: string;
  // false positive
  // eslint-disable-next-line react/no-unused-prop-types
  tmpEditRecordBase: Record<string, any>;
  onChangeDetailItem: (arg0: string, arg1: any) => void;
};

class AdminAttTimeField extends React.Component<Props> {
  render() {
    const { config, disabled, tmpEditRecord, onChangeDetailItem } = this.props;
    const { key, isRequired } = config;
    return (
      <AttTimeField
        key={key}
        disabled={disabled}
        onBlur={(value) => {
          onChangeDetailItem(key, String(TimeUtil.toMinutes(value)));
        }}
        value={TimeUtil.toHHmm(parseIntOrStringNull(tmpEditRecord[key]))}
        required={isRequired}
      />
    );
  }
}

export const RequireEarlyStartWorkApplyBefore = createDelayInitializeComponent({
  checkReceiveProps: (oldProps: Props, newProps: Props) => {
    return (
      oldProps.tmpEditRecordBase.workSystem !==
      newProps.tmpEditRecordBase.workSystem
    );
  },
  getDefaultValue: (props: Props) => {
    const { id, workSystem } = props.tmpEditRecordBase;
    const { requireEarlyStartWorkApplyBefore } = props.tmpEditRecord;
    const mode = props.mode;
    if ((id && requireEarlyStartWorkApplyBefore) || mode === 'clone') {
      return requireEarlyStartWorkApplyBefore;
    }
    // 新規の時は労働時間制によりデフォルトの値を設定します。
    // 裁量労働制から他の労働時間制変更、再び裁量労働制に戻った場合もデフォルト値になります。
    if (workSystem === 'JP:Discretion') {
      return '300';
    } else {
      return '';
    }
  },
})(AdminAttTimeField);

export const RequireOvertimeWorkApplyAfter = createDelayInitializeComponent({
  checkReceiveProps: (oldProps: Props, newProps: Props) => {
    return (
      oldProps.tmpEditRecordBase.workSystem !==
      newProps.tmpEditRecordBase.workSystem
    );
  },
  getDefaultValue: (props: Props) => {
    const { id, workSystem } = props.tmpEditRecordBase;
    const { requireOvertimeWorkApplyAfter } = props.tmpEditRecord;
    const mode = props.mode;
    if ((id && requireOvertimeWorkApplyAfter) || mode === 'clone') {
      return requireOvertimeWorkApplyAfter;
    }
    // 新規の時は労働時間制によりデフォルトの値を設定します。
    // 裁量労働制から他の労働時間制変更、再び裁量労働制に戻った場合もデフォルト値になります。
    if (workSystem === 'JP:Discretion') {
      return '1320';
    } else {
      return '';
    }
  },
})(AdminAttTimeField);
