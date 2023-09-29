import * as React from 'react';

import msg from '@commons/languages';

import Select from '../../components/MainContents/DetailPane/Select';

import CheckboxField from './Fields/CheckboxField';

const SF_OBJECT_FIELD_VALUES_KEY = {
  REST_REASONS: 'attRestReasonCodeList',
} as const;

const REST_REASON_KEY = {
  USE_REST_REASON: 'useRestReason',
  REST_REASON_CODE_LIST: 'restReasonCodeList',
} as const;

const THIS_EDIT_RECORD_KEY = {
  USE_SELECT: 'selectRestReasonForTreatAsContractedRest',
  REST_REASON_CODE_LIST: 'restReasonCodeListForTreatAsContracted',
} as const;

const OutsideOfConRestAsConRest: React.FC<{
  config: {
    key: string;
  };
  disabled: boolean;
  tmpEditRecord: Record<string, any>;
  sfObjFieldValues: Record<string, any>;
  onChangeDetailItem: (arg0: string, arg1: any) => void;
}> = ({
  config,
  disabled,
  tmpEditRecord,
  sfObjFieldValues,
  onChangeDetailItem,
}) => {
  const { key } = config;
  const restReasons: { label: string; value: string }[] =
    sfObjFieldValues[SF_OBJECT_FIELD_VALUES_KEY.REST_REASONS];
  const useRestReason: boolean = tmpEditRecord[
    REST_REASON_KEY.USE_REST_REASON
  ] as boolean;
  const selectedRestReasonCodesToWorkingType: string[] =
    (tmpEditRecord[REST_REASON_KEY.REST_REASON_CODE_LIST] as string[]) || null;

  const restReasonCodeOptions = React.useMemo(() => {
    if (!restReasons || !selectedRestReasonCodesToWorkingType) {
      return [];
    }
    return selectedRestReasonCodesToWorkingType?.map((value) => {
      const restReason = restReasons.find(
        ({ value: $value }) => value === $value
      );
      return {
        text: restReason.label,
        value: restReason.value,
      };
    });
  }, [selectedRestReasonCodesToWorkingType, restReasons]);
  console.debug(restReasonCodeOptions);

  const onChange = React.useCallback(
    (value: boolean) => {
      onChangeDetailItem(key, value);
    },
    [key, onChangeDetailItem]
  );

  const onChangeUseSelect = React.useCallback(
    (value: boolean) => {
      onChangeDetailItem(THIS_EDIT_RECORD_KEY.USE_SELECT, value);
    },
    [onChangeDetailItem]
  );

  const onChangeRestTimeReasonList = React.useCallback(
    (value: string[]) => {
      onChangeDetailItem(THIS_EDIT_RECORD_KEY.REST_REASON_CODE_LIST, value);
    },
    [onChangeDetailItem]
  );

  // 休憩理由を使用しない場合
  // 「所定休憩として扱う休憩理由を指定する」は使用できなくなります。
  React.useEffect(() => {
    if (!useRestReason) {
      onChangeUseSelect(false);
      onChangeRestTimeReasonList([]);
    }
  }, [useRestReason]);

  // 「所定休憩として扱う休憩理由を指定する」を使用しない場合
  // 選択していた休憩理由は未選択状態に戻ります。
  React.useEffect(() => {
    if (tmpEditRecord[THIS_EDIT_RECORD_KEY.USE_SELECT]) {
      onChangeRestTimeReasonList([]);
    }
  }, [tmpEditRecord[THIS_EDIT_RECORD_KEY.USE_SELECT]]);

  // 使用する休憩理由を変更した場合
  // 選択していた休憩理由が使えなくなった場合はリストから解除されます。
  React.useEffect(() => {
    if (tmpEditRecord[THIS_EDIT_RECORD_KEY.REST_REASON_CODE_LIST]) {
      onChangeRestTimeReasonList(
        tmpEditRecord[THIS_EDIT_RECORD_KEY.REST_REASON_CODE_LIST]?.filter(
          (value) => selectedRestReasonCodesToWorkingType?.includes(value)
        ) || []
      );
    }
  }, [selectedRestReasonCodesToWorkingType]);

  return (
    <div>
      <CheckboxField
        value={tmpEditRecord[key] || false}
        label={msg().Admin_Lbl_AttTreatAsRestTime}
        disabled={disabled}
        onChange={onChange}
        render={({ value }) =>
          useRestReason &&
          value && (
            <CheckboxField
              value={tmpEditRecord[THIS_EDIT_RECORD_KEY.USE_SELECT]}
              label={msg().Admin_Lbl_AttSelectRestTimeReasonsTreatedAsRestTime}
              disabled={disabled}
              onChange={onChangeUseSelect}
              render={({ value }) =>
                value && (
                  <Select
                    onChange={onChangeRestTimeReasonList}
                    // @ts-ignore
                    options={restReasonCodeOptions}
                    value={
                      tmpEditRecord[THIS_EDIT_RECORD_KEY.REST_REASON_CODE_LIST]
                    }
                    multiple={true}
                  />
                )
              }
            />
          )
        }
      />
    </div>
  );
};

export default OutsideOfConRestAsConRest;
