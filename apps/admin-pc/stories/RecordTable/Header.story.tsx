import React from 'react';

import { action } from '@storybook/addon-actions';

/* eslint-disable import/no-extraneous-dependencies */
import Header from '../../components/RecordTable/Header';

export default {
  title: 'admin-pc/RecordTable/Header',
};

export const WidthPixel = () => (
  <Header
    fields={[
      {
        key: 'code',
        label: 'Code (80px)',
        width: '80px',
      },
      {
        key: 'name',
        label: 'Name (120px)',
        width: '120px',
      },
      {
        key: 'department',
        label: 'Department (auto)',
        disabledSort: true,
      },
    ]}
    sort={{
      order: 'ASC',
      field: 'code',
    }}
    onClickCell={action('onClickCell')}
  />
);

WidthPixel.storyName = 'Width (Pixel)';

export const Width = () => (
  <Header
    fields={[
      {
        key: 'code',
        label: 'Code (20%)',
        width: '20%',
      },
      {
        key: 'name',
        label: 'Name (25%)',
        width: '25%',
      },
      {
        key: 'department',
        label: 'Department (auto)',
        disabledSort: true,
      },
    ]}
    sort={{
      order: 'DESC',
      field: 'code',
    }}
    onClickCell={action('onClickCell')}
  />
);

Width.storyName = 'Width (%)';
