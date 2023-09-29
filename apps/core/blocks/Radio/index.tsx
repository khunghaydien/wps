import * as React from 'react';

import styled from 'styled-components';

import CoreRadio from '../../elements/Radio';
import { useId, useTestId } from '../../hooks';
import Label from './Label';

type InputProps = Omit<
  React.PropsWithoutRef<React.ComponentProps<'input'>>,
  'children'
>;

interface Props extends InputProps {
  label?: string;
  disabled?: boolean;
  readOnly?: boolean;
  checked?: boolean;
  'data-testid'?: string;
}

const S = {
  Radio: styled.div`
    display: inline-flex;
    align-items: center;
    min-height: 16px;
  `,
  Label: styled(Label)`
    margin: 0 0 0 8px;

    :hover {
      cursor: pointer;
    }
  `,
};

const Radio: React.FC<Props> = ({ label, ...props }: Props) => {
  const id = useId();
  const labelId = useId();
  const rootTestId = useTestId(props);
  const radioTestId = useTestId(props, (testId) => `${testId}__radio`);
  const labelTestId = useTestId(props, (testId) => `${testId}__label`);
  return (
    <S.Radio data-testid={rootTestId}>
      <>
        <CoreRadio
          {...props}
          data-testid={radioTestId}
          aria-labelledby={labelId}
          id={id}
        />
        {label && (
          <S.Label data-testid={labelTestId} id={labelId} htmlFor={id}>
            {label}
          </S.Label>
        )}
      </>
    </S.Radio>
  );
};

export default Radio;
