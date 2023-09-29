import React from 'react';

import FixedHeaderTable, {
  BodyCell,
  BodyRow,
  HeaderCell,
  HeaderRow,
} from '../components/FixedHeaderTable';

import './FixedHeaderTable.story.scss';

const renderRow = (data, idx) => {
  return (
    <BodyRow key={idx}>
      <BodyCell className="tstory-common-fixed-header-table__column1">{`コンテンツ${idx}-1`}</BodyCell>
      <BodyCell className="tstory-common-fixed-header-table__column2">{`コンテンツ${idx}-2`}</BodyCell>
    </BodyRow>
  );
};

export default {
  title: 'commons',
};

export const _FixedHeaderTable = () => (
  <FixedHeaderTable scrollableClass="story-common-fixed-header-table__scrollabale">
    <HeaderRow>
      <HeaderCell className="tstory-common-fixed-header-table__column1">
        見出し1
      </HeaderCell>
      <HeaderCell className="tstory-common-fixed-header-table__column2">
        見出し2
      </HeaderCell>
    </HeaderRow>

    <BodyRow>
      <BodyCell className="tstory-common-fixed-header-table__column1">
        aaa
      </BodyCell>
      <BodyCell className="tstory-common-fixed-header-table__column2">
        bbb
      </BodyCell>
    </BodyRow>

    {[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}].map(renderRow)}
  </FixedHeaderTable>
);

_FixedHeaderTable.storyName = 'FixedHeaderTable';

_FixedHeaderTable.parameters = {
  info: { propTables: [FixedHeaderTable], inline: true, source: true },
};
