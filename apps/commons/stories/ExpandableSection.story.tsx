import React, { FC } from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';

import ExpandableSection from '../components/ExpandableSection';

interface FCStory extends FC {
  storyName?: string;
  parameters?: unknown;
}

export default {
  title: 'commons',
  decorators: [withInfo],
};

export const _ExpandableSection: FCStory = () => (
  // @ts-ignore
  <ExpandableSection expanded summary="Lorem-ipsum" onToggle={action('toggle')}>
    Pellentesque dapibus suscipit ligula. Donec posuere augue in quam. Etiam vel
    tortor sodales tellus ultricies commodo. Suspendisse potenti. Aenean in sem
    ac leo mollis blandit. Donec neque quam, dignissim in, mollis nec, sagittis
    eu, wisi. Phasellus lacus. Etiam laoreet quam sed arcu. Phasellus at dui in
    ligula mollis ultricies. Integer placerat tristique nisl. Praesent augue.
    Fusce commodo.
  </ExpandableSection>
);

_ExpandableSection.storyName = 'ExpandableSection';
_ExpandableSection.parameters = {
  info: {
    propTables: [ExpandableSection],
    inline: true,
    source: true,
  },
};
