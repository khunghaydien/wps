import React from 'react';

import HeaderBar from '../../components/DetailParts/HeaderBar';

export default {
  title: 'approvals-pc/DetailParts',
};

export const _HeaderBar = () => (
  <HeaderBar
    title="title"
    meta={[
      { label: '項目1', value: '値1' },
      { label: '項目2', value: '値2' },
    ]}
  />
);

_HeaderBar.storyName = 'HeaderBar';
_HeaderBar.parameters = {
  info: { propTables: [HeaderBar], inline: true, source: true },
};

export const HeaderBarChangeHedingLevel = () => (
  <HeaderBar
    title="見出しレベルを変更"
    headingLevel={3}
    meta={[
      { label: '項目1', value: '値1' },
      { label: '項目2', value: '値2' },
    ]}
  />
);

HeaderBarChangeHedingLevel.storyName = 'HeaderBar - Change heding level';
HeaderBarChangeHedingLevel.parameters = {
  info: { propTables: false, inline: true, source: true },
};

export const HeaderBarExpandablePane = () => (
  <HeaderBar
    title="見出しレベルを変更"
    headingLevel={3}
    meta={[
      { label: '項目1', value: '値1' },
      { label: '項目2', value: '値2' },
    ]}
    isExpanded
    onTogglePane={() => {}}
  />
);

HeaderBarExpandablePane.storyName = 'HeaderBar - Expandable pane';
HeaderBarExpandablePane.parameters = {
  info: { propTables: false, inline: true, source: true },
};
