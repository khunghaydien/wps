import React from 'react';

import Collapse from '../../components/Collapse';

import './Collapse.story.scss';

const ROOT = 'commons-story-collapse';

export default {
  title: 'commons',
};

export const _Collapse = () => (
  <Collapse header="Collpase Sample">
    <div className={`${ROOT}__children`}>コンテンツ</div>
  </Collapse>
);

_Collapse.parameters = {
  info: { propTables: [Collapse], inline: true, source: true },
};

export const CollapseWithSummary = () => (
  <Collapse
    header="Collpase Sample"
    summary={<span className={`${ROOT}__summary-sample`}>Sample</span>}
  >
    <div className={`${ROOT}__children`}>コンテンツ</div>
  </Collapse>
);

CollapseWithSummary.storyName = 'Collapse - with Summary';
CollapseWithSummary.parameters = {
  info: { propTables: false, inline: true, source: true },
};
