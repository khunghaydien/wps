import React, { memo } from 'react';

import isNil from 'lodash/isNil';

import styled from 'styled-components';

import { Color } from '@apps/core/styles';
import RecordsIcon from '@commons/components/exp/Form/RecordList/Icon';
import Highlight from '@commons/components/exp/Highlight';
import LabelWithHint from '@commons/components/fields/LabelWithHint';
import ImgEditOn from '@commons/images/btnEditOn.svg';
import FormatUtil from '@commons/utils/FormatUtil';

type Props = {
  currencySymbol?: string | null;
  currencyDecimalPlaces?: number;
  isHighlight: boolean;
  isManual?: boolean;
  label: string;
  preValue?: number | string;
  value: number | string;
  warningMsg?: string;
  width?: string;
};

const Field = ({
  currencySymbol,
  currencyDecimalPlaces,
  isHighlight,
  isManual = false,
  label,
  preValue,
  value,
  warningMsg = '',
  width = '50%',
}: Props) => {
  const isFormatNumber =
    typeof value === 'number' && !isNil(currencyDecimalPlaces);

  const formatNumber = (amount: number) =>
    `${currencySymbol || ''} ${FormatUtil.formatNumber(
      amount,
      currencyDecimalPlaces || 0
    )}`.trim();

  const finalPreValue = isFormatNumber
    ? formatNumber((preValue as number) || 0)
    : preValue || '';
  const finalValue = isFormatNumber ? formatNumber(value) : value;

  return (
    <Content width={width}>
      <LabelGroup>
        <LabelWithHint text={label} />
        {warningMsg && (
          <RecordsIcon className="" idx={1} tooltip={warningMsg} />
        )}
        {isManual && <ImgEditOn aria-hidden="true" />}
      </LabelGroup>
      <Highlight highlight={isHighlight}>{finalValue}</Highlight>
      {isHighlight && (
        <Highlight highlightColor={Color.bgDisabled}>
          {`(${finalPreValue})`}
        </Highlight>
      )}
    </Content>
  );
};

export default memo(Field);

const Content = styled.div<{ width: string }>`
  flex: 1 1 ${({ width }) => width};
  padding-right: 10px;
`;

const LabelGroup = styled.div`
  display: flex;
  align-items: center;
`;
