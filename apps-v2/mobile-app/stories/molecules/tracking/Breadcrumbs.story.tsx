import React from 'react';

/* eslint-disable import/no-extraneous-dependencies */
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';

import Breadcrumbs from '../../../components/molecules/tracking/Breadcrumbs';

const items = [
  {
    id: '1',
    name: 'Contracts',
  },
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

export default {
  title: 'Components/molecules/tracking/BreadCrumbs',
  decorators: [withKnobs],
};

export const Default = () => (
  <Breadcrumbs items={items} onClick={action('onClick')} />
);

Default.storyName = 'default';

export const Overflow = () => (
  <div style={{ width: '365px' }}>
    <Breadcrumbs items={items} onClick={action('onClick')} />
  </div>
);

Overflow.storyName = 'overflow';
