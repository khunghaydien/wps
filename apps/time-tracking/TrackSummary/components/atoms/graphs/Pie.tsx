import * as React from 'react';

import isNil from 'lodash/isNil';
import range from 'lodash/range';

import { ResponsivePie } from '@nivo/pie';
import styled from 'styled-components';

import variables from '../../../../../commons/styles/wsp.scss';

type Data = Array<{
  id: string;
  label?: string;
  value: number;
}>;

type Props = Readonly<{
  data: Data;
}>;

const Block = styled.div`
  width: 140px;
  height: 140px;
`;

const colors = range(1, 13).map((i) => variables[`graph-color-${i}`]);

const getOrDefault = (data: Data) => {
  return isNil(data) || data.length <= 0 ? [{ id: '-', value: 100 }] : data;
};

const getOrDefaultColors = (data: Data) => {
  return isNil(data) || data.length <= 0 ? ['#ddd'] : colors;
};

const Pie = (props: Props) => (
  <Block>
    <ResponsivePie
      data={getOrDefault(props.data)}
      colors={getOrDefaultColors(props.data)}
      padAngle={0}
      cornerRadius={0}
      innerRadius={0.6}
      enableRadialLabels={false}
      enableSlicesLabels={false}
      theme={{
        tooltip: {
          container: {
            position: 'absolute',
            left: 0,
          },
        },
      }}
    />
  </Block>
);

export default Pie;
