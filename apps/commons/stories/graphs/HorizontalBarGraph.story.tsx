import React from 'react';

import HorizontalBarGraph from '../../components/graphs/HorizontalBarGraph';

import './HorizontalBarGraph.story.scss';

export default {
  title: 'commons/graphs',
};

export const _HorizontalBarGraph = () => (
  <HorizontalBarGraph
    data={[
      {
        value: 30,
        color: 'red',
      },
      {
        value: 50,
        color: 'blue',
      },
    ]}
    className="ts-horizontal-bar-graph-story"
  />
);

_HorizontalBarGraph.storyName = 'HorizontalBarGraph';

_HorizontalBarGraph.parameters = {
  info: { propTables: [HorizontalBarGraph], inline: true, source: true },
};
