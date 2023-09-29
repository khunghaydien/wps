import React from 'react';

import styled from 'styled-components';

import msg from '../../../../../commons/languages';
import TimeUtil from '../../../../../commons/utils/TimeUtil';
import { Text } from '../../../../../core';

import { Data } from '../Props';

type Props = {
  readonly data: Data;
};

const Headline = styled(Text)`
  margin: 0 4px 0 0;
`;

const WorkHours = ({ data }: Props) => {
  const aggregatedValue = data.reduce((acc, datum) => acc + datum.workTime, 0);
  return (
    <>
      <Headline size="large">{msg().Time_Lbl_WorkingHours}:</Headline>
      <Text bold size="large">
        {TimeUtil.toHHmm(aggregatedValue)}
      </Text>
    </>
  );
};

export default WorkHours;
