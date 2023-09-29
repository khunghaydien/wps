import React from 'react';

import isNil from 'lodash/isNil';

import styled from 'styled-components';

import msg from '../../../../commons/languages';
import variables from '../../../../commons/styles/wsp.scss';
import TimeUtil from '../../../../commons/utils/TimeUtil';

import { Headline, Text } from '../atoms/Text';

type Data = ReadonlyArray<{
  workTime: number;
}>;

type Props = Readonly<{
  headline?: boolean;
  data: Data;
}>;

const Heading = styled(Text)<{ body1: boolean }>`
  color: ${variables['color-text-2']};
  margin-right: 16px;
`;

const Emphasis = styled(Headline)<{ isEmpty: boolean }>`
  color: ${(props) =>
    props.isEmpty ? variables['color-text-3'] : variables['color-text-1']};
`;

export default ({ headline, data }: Props) => {
  const aggregatedValue = data.reduce((acc, datum) => acc + datum.workTime, 0);

  return (
    <>
      {headline && <Heading body1>{msg().Time_Lbl_WorkingHours}</Heading>}
      <Emphasis isEmpty={isNil(data) || data.length <= 0}>
        {TimeUtil.toHHmm(aggregatedValue)}
      </Emphasis>
    </>
  );
};
