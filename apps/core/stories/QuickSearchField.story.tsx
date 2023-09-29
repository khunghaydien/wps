import React from 'react';

import { action } from '@storybook/addon-actions';
import styled from 'styled-components';

import { QuickSearchField } from '../index';

const Center = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
`;

const Wrapper = styled.div`
  width: 260px;
`;

export default {
  title: 'core/QuickSearchField',

  decorators: [
    (story: Function) => (
      <Center>
        <Wrapper>{story()}</Wrapper>
      </Center>
    ),
  ],
};

export const Empty = () => (
  <QuickSearchField value="" debounce={false} onChange={action('onChange')} />
);

Empty.storyName = 'empty';

export const Placeholder = () => (
  <QuickSearchField
    value=""
    debounce={false}
    placeholder="Search"
    onChange={action('onChange')}
  />
);

Placeholder.storyName = 'placeholder';

export const ReadOnly = () => (
  <QuickSearchField
    value=""
    debounce={false}
    placeholder="Search"
    onChange={action('onChange')}
    readOnly
  />
);

ReadOnly.storyName = 'readOnly';

export const Disabled = () => (
  <QuickSearchField
    value=""
    debounce={false}
    placeholder="Search"
    onChange={action('onChange')}
    disabled
  />
);

Disabled.storyName = 'disabled';

export const Text = () => (
  <QuickSearchField
    value="Text, Text, Text"
    debounce={false}
    onChange={action('onChange')}
  />
);

Text.storyName = 'text';

export const LongText = () => (
  <QuickSearchField
    value="Text, Text, Text, Text, Text, Text, Text, Text, Text, Text, Text, Text, Text"
    debounce={false}
    onChange={action('onChange')}
  />
);

LongText.storyName = 'long text';

export const Debounce = () => (
  // @ts-ignore because change a value and check debounce
  <QuickSearchField debounce onChange={action('onChange')} />
);

Debounce.storyName = 'debounce';
