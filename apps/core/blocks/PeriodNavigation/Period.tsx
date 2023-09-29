import React from 'react';

import styled from 'styled-components';

import DateUtil from '../../../commons/utils/DateUtil';

import Text from '../../elements/Text';
import { Color } from '../../styles';

interface Props {
  startDate: string;
  endDate: string;
}

const S = {
  Text: styled(Text)`
    min-width: 260px;
    font-size: 13px;
    font-weight: bold;
    line-height: 17px;
    color: ${Color.secondary};
  `,
};

const Period: React.FC<Props> = (props: Props) => {
  const period =
    props.startDate && props.endDate
      ? `${DateUtil.formatLongDate(
          props.startDate
        )} - ${DateUtil.formatLongDate(props.endDate)}`
      : '';
  return <S.Text>{period}</S.Text>;
};

export default Period;
