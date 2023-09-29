import React from 'react';

import styled from 'styled-components';

import variables from '../../../../commons/styles/wsp.scss';
import DateUtil from '../../../../commons/utils/DateUtil';

import { Text } from '../atoms/Text';

type Props = Readonly<{
  startDate: string;
  endDate: string;
}>;

const StyledText = styled(Text)`
  font-weight: bold;
  color: ${variables['color-text-2']};
`;

const Period = (props: Props) => {
  const period =
    props.startDate && props.endDate
      ? `${DateUtil.formatLongDate(
          props.startDate
        )} - ${DateUtil.formatLongDate(props.endDate)}`
      : '';
  return <StyledText body1>{period}</StyledText>;
};

export default Period;
