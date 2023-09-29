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
      oldProps.tmpEditRecord.workSystem !== newProps.tmpEditRecord.workSystem
    );
  },
  getDefaultValue: (props: Props) => {
    const { requireEarlyStartWorkApplyBefore } = props.tmpEditRecord;
    const $requireEarlyStartWorkApplyBefore =
      requireEarlyStartWorkApplyBefore?.toString();

    if ($requireEarlyStartWorkApplyBefore) {
      return $requireEarlyStartWorkApplyBefore;
    }
    // 新規の時は労働時間制によりデフォルトの値を設定します。
    // 裁量労働制から他の労働時間制変更、再び裁量労働制に戻った場合もデフォルト値になります。
    const { workSystem } = props.tmpEditRecord;
    if (workSystem === 'JP:Discretion') {
      return '300';
    } else {
      return '';
    }
  },
})(AdminAttTimeField);

export const ChangedEarlyStartRequiredTimeAmLeaveBefore =
  createDelayInitializeComponent({
    checkReceiveProps: (oldProps: Props, newProps: Props) => {
      return (
        oldProps.tmpEditRecord.workSystem !== newProps.tmpEditRecord.workSystem
      );
    },
    getDefaultValue: (props: Props) => {
      const { changedEarlyStartRequiredTimeAmLeaveBefore } =
        props.tmpEditRecord;
      const $changedEarlyStartRequiredTimeAmLeaveBefore =
        changedEarlyStartRequiredTimeAmLeaveBefore?.toString();
      if ($changedEarlyStartRequiredTimeAmLeaveBefore) {
        return $changedEarlyStartRequiredTimeAmLeaveBefore;
      }
      return '';
    },
  })(AdminAttTimeField);

export const ChangedEarlyStartRequiredTimePmLeaveBefore =
  createDelayInitializeComponent({
    checkReceiveProps: (oldProps: Props, newProps: Props) => {
      return (
        oldProps.tmpEditRecord.workSystem !== newProps.tmpEditRecord.workSystem
      );
    },
    getDefaultValue: (props: Props) => {
      const { changedEarlyStartRequiredTimePmLeaveBefore } =
        props.tmpEditRecord;
      const $changedEarlyStartRequiredTimePmLeaveBefore =
        changedEarlyStartRequiredTimePmLeaveBefore?.toString();
      if ($changedEarlyStartRequiredTimePmLeaveBefore) {
        return $changedEarlyStartRequiredTimePmLeaveBefore;
      }
      return '';
    },
  })(AdminAttTimeField);

export const ChangedEarlyStartRequiredTimeHalfLeaveBefore =
  createDelayInitializeComponent({
    checkReceiveProps: (oldProps: Props, newProps: Props) => {
      return (
        oldProps.tmpEditRecord.workSystem !== newProps.tmpEditRecord.workSystem
      );
    },
    getDefaultValue: (props: Props) => {
      const { changedEarlyStartRequiredTimeHalfLeaveBefore } =
        props.tmpEditRecord;
      const $changedEarlyStartRequiredTimeHalfLeaveBefore =
        changedEarlyStartRequiredTimeHalfLeaveBefore?.toString();
      if ($changedEarlyStartRequiredTimeHalfLeaveBefore) {
        return $changedEarlyStartRequiredTimeHalfLeaveBefore;
      }
      return '';
    },
  })(AdminAttTimeField);

export const RequireOvertimeWorkApplyAfter = createDelayInitializeComponent({
  checkReceiveProps: (oldProps: Props, newProps: Props) => {
    return (
      oldProps.tmpEditRecord.workSystem !== newProps.tmpEditRecord.workSystem
    );
  },
  getDefaultValue: (props: Props) => {
    const { requireOvertimeWorkApplyAfter } = props.tmpEditRecord;
    const $requireOvertimeWorkApplyAfter =
      requireOvertimeWorkApplyAfter?.toString();

    if ($requireOvertimeWorkApplyAfter) {
      return $requireOvertimeWorkApplyAfter;
    }
    // 新規の時は労働時間制によりデフォルトの値を設定します。
    // 裁量労働制から他の労働時間制変更、再び裁量労働制に戻った場合もデフォルト値になります。
    const { workSystem } = props.tmpEditRecord;
    if (workSystem === 'JP:Discretion') {
      return '1320';
    } else {
      return '';
    }
  },
})(AdminAttTimeField);

export const ChangedOvertimeRequiredTimeAmLeaveAfter =
  createDelayInitializeComponent({
    checkReceiveProps: (oldProps: Props, newProps: Props) => {
      return (
        oldProps.tmpEditRecord.workSystem !== newProps.tmpEditRecord.workSystem
      );
    },
    getDefaultValue: (props: Props) => {
      const { changedOvertimeRequiredTimeAmLeaveAfter } = props.tmpEditRecord;
      const $changedOvertimeRequiredTimeAmLeaveAfter =
        changedOvertimeRequiredTimeAmLeaveAfter?.toString();
      if ($changedOvertimeRequiredTimeAmLeaveAfter) {
        return $changedOvertimeRequiredTimeAmLeaveAfter;
      }
      return '';
    },
  })(AdminAttTimeField);

export const ChangedOvertimeRequiredTimePmLeaveAfter =
  createDelayInitializeComponent({
    checkReceiveProps: (oldProps: Props, newProps: Props) => {
      return (
        oldProps.tmpEditRecord.workSystem !== newProps.tmpEditRecord.workSystem
      );
    },
    getDefaultValue: (props: Props) => {
      const { changedOvertimeRequiredTimePmLeaveAfter } = props.tmpEditRecord;
      const $changedOvertimeRequiredTimePmLeaveAfter =
        changedOvertimeRequiredTimePmLeaveAfter?.toString();
      if ($changedOvertimeRequiredTimePmLeaveAfter) {
        return $changedOvertimeRequiredTimePmLeaveAfter;
      }
      return '';
    },
  })(AdminAttTimeField);

export const ChangedOvertimeRequiredTimeHalfLeaveAfter =
  createDelayInitializeComponent({
    checkReceiveProps: (oldProps: Props, newProps: Props) => {
      return (
        oldProps.tmpEditRecord.workSystem !== newProps.tmpEditRecord.workSystem
      );
    },
    getDefaultValue: (props: Props) => {
      const { changedOvertimeRequiredTimeHalfLeaveAfter } = props.tmpEditRecord;
      const $changedOvertimeRequiredTimeHalfLeaveAfter =
        changedOvertimeRequiredTimeHalfLeaveAfter?.toString();
      if ($changedOvertimeRequiredTimeHalfLeaveAfter) {
        return $changedOvertimeRequiredTimeHalfLeaveAfter;
      }
      return '';
    },
  })(AdminAttTimeField);
