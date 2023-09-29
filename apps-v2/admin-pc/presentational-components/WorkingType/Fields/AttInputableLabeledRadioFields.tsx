import * as React from 'react';

import TextField from '../../../../commons/components/fields/TextField';
import msg from '../../../../commons/languages';
import { parseNumberOrStringNull } from '../../../../commons/utils/NumberUtil';

import { Config } from '../../../utils/ConfigUtil';
import { Record } from '../../../utils/RecordUtil';

import PlaceInTemplate from '../../../components/PlaceInTemplate';

import './AttInputableLabeledRadioFields.scss';

const ROOT = 'admin-pc-working-type-fields-att-inputable-labeled-radio-fields';

const { useState, useMemo, useEffect, useCallback } = React;

const convertToNumberString = (value: any) =>
  String(parseNumberOrStringNull(value));

const useValueMap = (
  options: string[],
  initialValue: {
    [key: string]: string;
  } = {}
) => {
  const create = useCallback(
    (
      defaultValue: {
        [key: string]: string;
      } = {}
    ) =>
      options.reduce((obj, $option) => {
        obj[$option] = defaultValue[$option] || '';
        return obj;
      }, {}),
    [options]
  );

  const [valueMap, setValues]: [
    {
      [key: string]: string;
    },
    (
      arg0: (arg0: { [key: string]: string }) =>
        | {
            [key: string]: string;
          }
        | {
            [key: string]: string;
          }
    ) => void
  ] = useState(create(initialValue));

  const setValue = useCallback(
    (option: string, value: string) => {
      setValues((state) => ({ ...state, [option]: value }));
    },
    [setValues]
  );

  const initialize = useCallback(
    (
      obj: {
        [key: string]: string;
      } = {}
    ) => {
      // @ts-ignore
      setValues(create(obj));
    },
    [setValues, create]
  );

  return [valueMap, setValue, initialize];
};

type Props = Readonly<{
  recordUnitKey: string;
  unitProps: [
    {
      name: string;
      embeddedMessageKey: string;
      min: number;
      max: number;
      step?: number;
    }
  ];
  config: Config;
  disabled: boolean;
  tmpEditRecord: Record;
  onChangeDetailItem: (
    arg0: string,
    arg1: string,
    arg2?: 'numeric' | null | undefined
  ) => void;
}>;

const Item = ({
  id,
  name,
  value,
  active,
  disabled,
  required,
  min,
  max,
  step,
  embeddedMessage,
  onChangeRadio,
  onChangeTextField,
}: {
  id: string;
  name: string;
  value: string;
  active: boolean;
  disabled: boolean;
  required: boolean;
  min: number;
  max: number;
  step?: number;
  embeddedMessage: string;
  onChangeRadio: () => void;
  onChangeTextField: (event: React.SyntheticEvent<HTMLInputElement>) => void;
}) => {
  return (
    <>
      <input
        id={id}
        className={`${ROOT}__radio`}
        type="radio"
        value={name}
        checked={active}
        onChange={onChangeRadio}
        disabled={disabled}
      />
      <label htmlFor={id} className={`${ROOT}__label`}>
        {/* @ts-ignore */}
        <PlaceInTemplate
          className={`${ROOT}__input-in-text`}
          template={embeddedMessage}
        >
          <TextField
            className={`${ROOT}__item-value`}
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled || !active}
            isRequired={required}
            onChange={onChangeTextField}
          />
        </PlaceInTemplate>
      </label>
    </>
  );
};

const AttInputableLabeledRadioFields = ({
  recordUnitKey,
  unitProps,
  config,
  disabled,
  tmpEditRecord,
  onChangeDetailItem,
}: Props) => {
  const units = useMemo(
    () => unitProps.map((props) => props.name),
    [unitProps]
  );
  const isRequired = !!config.isRequired;
  const key = config.key;
  const recordValue = tmpEditRecord[key];
  const recordUnit = tmpEditRecord[recordUnitKey];
  const [unitValueMap, setUnitValue, initializeValueMap] = useValueMap(units, {
    [recordUnit]: convertToNumberString(recordValue),
  });

  const onChangeUnit = useCallback(
    (value: string) => onChangeDetailItem(recordUnitKey, value),
    [recordUnitKey, onChangeDetailItem]
  );

  const onChangeConfigKeyItem = useCallback(
    (value: string) => onChangeDetailItem(key, value, 'numeric'),
    [key, onChangeDetailItem]
  );

  const createChangeRadioHandler = useCallback(
    (unit: string) => () => {
      onChangeUnit(unit);
      onChangeConfigKeyItem(unitValueMap[unit]);
    },
    [unitValueMap, onChangeUnit, onChangeConfigKeyItem]
  );

  const createChangeTextFieldHandler = useCallback(
    (unit: string) => (event: React.SyntheticEvent<HTMLInputElement>) => {
      const value = convertToNumberString(event.currentTarget.value);
      // @ts-ignore
      setUnitValue(unit, value);
      onChangeConfigKeyItem(value);
    },
    [setUnitValue, onChangeConfigKeyItem]
  );

  // Reset values if record is changed by clicked list's row.
  useEffect(() => {
    // @ts-ignore
    initializeValueMap({ [recordUnit]: convertToNumberString(recordValue) });
  }, [tmpEditRecord.id]);

  return (
    <>
      {unitProps.map((props) => (
        <div>
          <Item
            id={`${ROOT}-${recordUnitKey}-${props.name}`}
            name={props.name}
            value={unitValueMap[props.name]}
            active={recordUnit === props.name}
            disabled={disabled}
            required={isRequired}
            embeddedMessage={msg()[props.embeddedMessageKey]}
            min={props.min}
            max={props.max}
            step={props.step}
            onChangeRadio={createChangeRadioHandler(props.name)}
            onChangeTextField={createChangeTextFieldHandler(props.name)}
          />
        </div>
      ))}
    </>
  );
};

export default AttInputableLabeledRadioFields;
