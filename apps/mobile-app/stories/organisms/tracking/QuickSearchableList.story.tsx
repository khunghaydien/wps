import React from 'react';

import { action } from '@storybook/addon-actions';
/* eslint-disable import/no-extraneous-dependencies */
import { boolean, withKnobs } from '@storybook/addon-knobs';

import QuickSearchableList from '../../../components/organisms/tracking/QuickSearchableList';

const breadcrumbs = [
  { id: '1', name: 'Contracts' },
  {
    id: '2',
    name: 'Agent TS',
  },
  {
    id: '3',
    name: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  },
  {
    id: '4',
    name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur rhoncus aliquet nisi, sed varius ligula eleifend tempor. Nunc quis accumsan ipsum. Etiam vitae dictum nunc, sed tincidunt ex.',
  },
];

const items = [
  { id: '1', name: 'WSP/Design' },
  {
    id: '2',
    name: 'WSP/Estimate',
  },
  {
    id: '3',
    name: 'WSP/Coding',
  },
  {
    id: '4',
    name: 'WSP/Testing',
  },
];

export default {
  title: 'Components/organisms/tracking',
  decorators: [withKnobs],
};

export const _QuickSearchableList = () => (
  <QuickSearchableList
    isLoading={boolean('isLoading', false)}
    breadcrumbs={breadcrumbs}
    items={items}
    // @ts-ignore
    filterSelector={action('filterSelector')}
    onClickBreadCrumbs={action('onClickBreadCrumbs')}
  >
    {({ items }: any) => {
      return items.map((item) => <div>{`${item.id} ${item.name}`}</div>);
    }}
  </QuickSearchableList>
);

_QuickSearchableList.storyName = 'QuickSearchableList';
