import * as React from 'react';

import styled from 'styled-components';

import AttTimeField, {
  Props as AttTimeFieldProps,
} from '../../../../commons/components/fields/AttTimeField';

import RangeMark from '../../../images/rangeMark.svg';

type Props = {
  startTime: AttTimeFieldProps;
  endTime: AttTimeFieldProps;
  required?: boolean;
  disabled?: boolean;
};

const S = {
  Container: styled.div`
    display: inline-flex;
    width: 174px;
  `,

  AttTimeFieldContainer: styled.div`
    flex-grow: 1;
  `,

  AttTimeField: styled(AttTimeField)`
    max-width: 75px;
  `,

  SeparationContainer: styled.div`
    display: flex;
    flex: 0;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-left: 7px;
    margin-right: 7px;
  `,
};

const AttTimeRangeField = ({
  startTime,
  endTime,
  required,
  disabled,
}: Props) => {
  return (
    <S.Container>
      <S.AttTimeFieldContainer>
        <S.AttTimeField
          {...startTime}
          required={required}
          disabled={disabled}
        />
      </S.AttTimeFieldContainer>

      <S.SeparationContainer>
        <RangeMark />
      </S.SeparationContainer>

      <S.AttTimeFieldContainer>
        <S.AttTimeField {...endTime} required={required} disabled={disabled} />
      </S.AttTimeFieldContainer>
    </S.Container>
  );
};

export default AttTimeRangeField;
