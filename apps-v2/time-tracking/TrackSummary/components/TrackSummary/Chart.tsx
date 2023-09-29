import React from 'react';

import styled from 'styled-components';

import Pie from '../atoms/graphs/Pie';
import { Data } from './Props';

type Props = {
  readonly data: Data;
};

const ChartBlock = styled.div`
  width: 140px;
  height: 140px;
  margin: 0 20px 0 0;
`;

const Chart = ({ data }: Props) => {
  return (
    <ChartBlock>
      <Pie
        data={data.map(
          ({ jobName, workCategoryName, workTimeRatio }, index) => ({
            id: `${index}`,
            value: workTimeRatio,
            label: workCategoryName
              ? `${jobName}/${workCategoryName}`
              : jobName,
          })
        )}
      />
    </ChartBlock>
  );
};

export default Chart;
