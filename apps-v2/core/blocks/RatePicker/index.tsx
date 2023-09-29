import React from 'react';

import Combobox from '../../elements/Combobox';
import { useInputState, useRateOptions } from './hooks';

type InputProps = Omit<
  React.PropsWithoutRef<React.ComponentProps<'input'>>,
  'children' | 'onChange' | 'onSelect'
>;

interface Props extends InputProps {
  'data-testid'?: string;
  stepInRate?: number;
  minRate?: number;
  maxRate?: number;
  isOpenByDefault?: boolean;
  value: string | null | undefined;
  onSelect: (value: number) => void;
}

const RatePicker = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      stepInRate = 10,
      minRate = 10,
      maxRate = 110,
      isOpenByDefault,
      value,
      ...props
    }: Props,
    ref: React.Ref<HTMLInputElement>
  ) => {
    const [inputValue, onChange] = useInputState(value);
    const options = useRateOptions(minRate, maxRate, stepInRate);

    const onSelect = React.useCallback(
      (option: { value: string; label: string; id: string }) => {
        props.onSelect(Number(option.value));
      },
      [props.onSelect]
    );

    const onBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
      // Fire custom blue event
      if (props.onBlur) {
        props.onBlur(event);
      }

      // Fire select event to return inputted value to upstream
      const rate = inputValue ? Math.floor(Number(inputValue)) : 0;
      if (!isNaN(rate) && rate >= 0 && rate <= 100) {
        onChange(String(rate));
        props.onSelect(rate);
      } else {
        onChange(value);
      }
    };

    return (
      <Combobox
        ref={ref}
        {...props}
        assistiveInfo="%"
        value={inputValue}
        options={options}
        isOpenByDefault={isOpenByDefault}
        onBlur={onBlur}
        onChange={onChange}
        onSelect={onSelect}
      />
    );
  }
);

export default RatePicker;
