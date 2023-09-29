import React from 'react';

import DateRangeField from '../../../../commons/components/fields/DateRangeField';
import Label from '../../../../commons/components/fields/Label';
import SelectField from '../../../../commons/components/fields/SelectField';
import TextField from '../../../../commons/components/fields/TextField';
import msg from '../../../../commons/languages';

import { EditingShortTimeWorkPeriodStatus } from '../../../models/short-time-work/ShortTimeWorkPeriodStatus';
import { ShortTimeWorkSetting } from '../../../models/short-time-work/ShortTimeWorkSetting';

const workSystemTranslateMap = {
  'JP:Fix': () => msg().Admin_Lbl_JP_Fix,
  'JP:Flex': () => msg().Admin_Lbl_JP_Flex,
  'JP:Modified': () => msg().Admin_Lbl_JP_Modified,
};

const buildShortTimeWorkSettingOption = (
  setting: ShortTimeWorkSetting
): { text: string; value: string } => {
  const workSystem = workSystemTranslateMap[setting.workSystem]();
  return {
    text: `${setting.name} (${workSystem})`,
    value: setting.id,
  };
};

export type Props = {
  parentViewType: 'Pane' | 'Dialog';
  editingShortTimeWorkPeriodStatus: EditingShortTimeWorkPeriodStatus;
  onUpdateValue: (key: string, value: string) => void;
};

export default class PeriodStatusForm extends React.Component<Props> {
  render() {
    const { editingShortTimeWorkPeriodStatus, onUpdateValue } = this.props;
    const { shortTimeWorkSettingList } = editingShortTimeWorkPeriodStatus;

    const shortTimeWorkSettingOptions = [
      { text: msg().Admin_Lbl_PleaseSelect, value: '' },
      ...(shortTimeWorkSettingList || []).map(buildShortTimeWorkSettingOption),
    ];

    const format = {
      Pane: { labelCols: 3, childCols: 5 },
      Dialog: { labelCols: 4, childCols: 7 },
    }[this.props.parentViewType || 'Pane'];

    return (
      <div>
        <Label {...format} text={msg().Admin_Lbl_ValidDate}>
          <DateRangeField
            startDateFieldProps={{
              value: editingShortTimeWorkPeriodStatus.validDateFrom,
              onChange: (value) => onUpdateValue('validDateFrom', value),
            }}
            endDateFieldProps={{
              value: editingShortTimeWorkPeriodStatus.validDateThrough,
              onChange: (value) => onUpdateValue('validDateThrough', value),
            }}
            required
          />
        </Label>

        <Label {...format} text={msg().Admin_Lbl_ShortTimeWorkSetting}>
          <SelectField
            options={shortTimeWorkSettingOptions}
            value={editingShortTimeWorkPeriodStatus.shortTimeWorkSettingId}
            onChange={(e) =>
              onUpdateValue('shortTimeWorkSettingId', e.target.value)
            }
            required
          />
        </Label>

        <Label {...format} childCols={8} text={msg().Admin_Lbl_Comment}>
          <TextField
            value={editingShortTimeWorkPeriodStatus.comment || ''}
            onChange={(e, value) => onUpdateValue('comment', value)}
            maxLength={1000}
          />
        </Label>
      </div>
    );
  }
}
