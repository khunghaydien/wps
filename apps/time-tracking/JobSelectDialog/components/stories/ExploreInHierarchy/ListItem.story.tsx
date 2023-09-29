import React from 'react';

import { action } from '@storybook/addon-actions';

import ListItem from '../../ExploreInHierarchy/ListItem';

export default {
  title: 'time-tracking/JobSelectDialog/ExploreInHierarchy/ListItem',
};

export const Default = () => (
  <ListItem onClick={action('onClick')}>CONTENT</ListItem>
);

Default.storyName = 'default';

export const HasChildren = () => (
  <ListItem hasChildren onClick={action('onClick')}>
    CONTENT
  </ListItem>
);

HasChildren.storyName = 'hasChildren ';

export const HasChildrenSelected = () => (
  <ListItem hasChildren selected onClick={action('onClick')}>
    CONTENT
  </ListItem>
);

HasChildrenSelected.storyName = 'hasChildren selected';

export const Selected = () => (
  <ListItem selected onClick={action('onClick')}>
    CONTENT
  </ListItem>
);

Selected.storyName = 'selected';

export const Opened = () => (
  <ListItem hasChildren opened onClick={action('onClick')}>
    CONTENT
  </ListItem>
);

Opened.storyName = 'opened';
