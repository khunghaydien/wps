import React from 'react';

import { action } from '@storybook/addon-actions';

/* eslint-disable import/no-extraneous-dependencies */
import ListSearchForm from '../components/ListSearchForm';

export default {
  title: 'admin-pc/ListSearchForm',

  decorators: [
    (story: Function) => (
      <div
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        {story()}
      </div>
    ),
  ],
};

export const Default = () => (
  <ListSearchForm
    fields={[
      {
        key: 'code',
        label: 'Code',
        value: 'code',
        width: '100px',
      },
      {
        key: 'name',
        label: 'Name',
        value: 'name',
        width: '150px',
      },
      {
        key: 'department',
        label: 'Department',
        value: '',
      },
    ]}
    onChange={action('onChange')}
    onSubmit={action('onSubmit')}
  />
);
