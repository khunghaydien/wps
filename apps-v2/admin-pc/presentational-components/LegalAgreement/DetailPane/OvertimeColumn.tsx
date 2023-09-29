import * as React from 'react';

import TextAreaField from '@commons/components/fields/TextAreaField';
import msg from '@commons/languages';

import CheckboxField from './Fields/CheckboxField';

const isChange = (arr: string[] | void) =>
  (arr || []).filter((t) => t).length > 0;

const split = (text: string | void) => {
  const arr = String(text || '')
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t);
  return arr.length ? arr : null;
};

const join = (arr: string[] | void) => (arr || []).join(', ');

/**
 * 限度の対象時間
 *
 * DBで使用可否フラグを持たないので useState を使用して Component 側で持たせています。
 * useState はコンポーネントが新規作成されたタイミングで初期化されます。
 * よって以下のタイミングでは初期化されないので id (履歴ID) の変化を感知して変更しています。
 *
 * - 履歴を切り替えた
 * - 新規作成から既存データ詳細を開いた
 * - 既存データ詳細から新規作成を開いた
 *
 * また、実際の対象時間の値は配列なので TextArea で扱えるように文字列に変換しています。
 * かつ、使用可否フラグを Component 側で持っているので使用しない場合は対象時間を削除しなければなりません。
 * 画面では残しておきたいので文字列に変換した値は残しています。
 *
 * @param param0
 * @returns
 */
const OvertimeColumn: React.FC<{
  config: {
    key: string;
  };
  disabled: boolean;
  tmpEditRecord: Record<string, any>;
  onChangeDetailItem: (arg0: string, arg1: any) => void;
}> = ({ config: { key }, tmpEditRecord, disabled, onChangeDetailItem }) => {
  const id = tmpEditRecord.id;
  const value = tmpEditRecord[key] as unknown as string[] | void;
  const [changed, setChanged] = React.useState<boolean>(isChange(value));
  const [strValue, setStrValue] = React.useState<string>(join(value));

  const onChangeCheckBox = React.useCallback(
    (result: boolean) => {
      if (result) {
        onChangeDetailItem(key, split(strValue));
      } else {
        onChangeDetailItem(key, []);
      }
      setChanged(result);
    },
    [strValue, key, onChangeDetailItem]
  );

  const onChangeText = React.useCallback(
    (e: React.SyntheticEvent<HTMLInputElement>) => {
      const $value = String(e.currentTarget.value);
      setStrValue($value);
      onChangeDetailItem(key, split($value));
    },
    [key, onChangeDetailItem]
  );

  React.useEffect(() => {
    setChanged(isChange(value));
    setStrValue(join(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div>
      <CheckboxField
        value={changed}
        label={msg().Admin_Lbl_Change}
        disabled={disabled}
        onChange={onChangeCheckBox}
      />
      {changed && (
        <TextAreaField
          key={key}
          value={strValue}
          disabled={disabled}
          onChange={onChangeText}
        />
      )}
    </div>
  );
};

export default OvertimeColumn;
