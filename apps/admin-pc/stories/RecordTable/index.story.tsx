import React from 'react';

import { action } from '@storybook/addon-actions';

/* eslint-disable import/no-extraneous-dependencies */
import RecordTable from '../../components/RecordTable';

export default {
  title: 'admin-pc/RecordTable',

  decorators: [
    (story: Function) => (
      <div
        style={{
          height: '80vh',
        }}
      >
        {story()}
      </div>
    ),
  ],
};

export const Default = () => (
  <RecordTable
    fields={[
      {
        key: 'code',
        label: 'Code',
        width: '100px',
      },
      {
        key: 'name',
        label: 'Name',
        width: '150px',
      },
      {
        key: 'department',
        label: 'Department',
        disabledSort: true,
      },
    ]}
    sort={{
      order: 'ASC',
      field: 'code',
    }}
    records={[
      {
        code: 'E-0001',
        name: 'Taro Yamada',
        department: 'Product Development',
      },
      {
        code: 'E-0002',
        name: 'Jiro Watanabe',
        department: 'Product Development',
      },
      {
        code: 'E-0003',
        name: 'Hanako Sato',
        department: 'Product Development',
      },
      {
        code: 'E-0004',
        name: 'Long Long Long Long Long Name',
        department: 'Product Development',
      },
    ]}
    onClickRow={action('onClickRow')}
    onClickHeaderCell={action('onClickHeaderCell')}
  />
);

export const Selected = () => (
  <RecordTable
    fields={[
      {
        key: 'code',
        label: 'Code',
        width: '100px',
      },
      {
        key: 'name',
        label: 'Name',
        width: '150px',
      },
      {
        key: 'department',
        label: 'Department',
        disabledSort: true,
      },
    ]}
    sort={{
      order: 'ASC',
      field: 'code',
    }}
    selectedRowIndex={1}
    records={[
      {
        code: 'E-0001',
        name: 'Taro Yamada',
        department: 'Product Development',
      },
      {
        code: 'E-0002',
        name: 'Jiro Watanabe',
        department: 'Product Development',
      },
      {
        code: 'E-0003',
        name: 'Hanako Sato',
        department: 'Product Development',
      },
      {
        code: 'E-0004',
        name: 'Long Long Long Long Long Name',
        department: 'Product Development',
      },
    ]}
    onClickRow={action('onClickRow')}
    onClickHeaderCell={action('onClickHeaderCell')}
  />
);

export const NotFound = () => (
  <RecordTable
    fields={[
      {
        key: 'code',
        label: 'Code',
        width: '100px',
      },
      {
        key: 'name',
        label: 'Name',
        width: '150px',
      },
      {
        key: 'department',
        label: 'Department',
        disabledSort: true,
      },
    ]}
    sort={{
      order: 'ASC',
      field: 'code',
    }}
    records={[]}
    emptyMessage="Not found (Message here)."
    onClickRow={action('onClickRow')}
    onClickHeaderCell={action('onClickHeaderCell')}
  />
);

export const Scroll = () => (
  <RecordTable
    fields={[
      {
        key: 'code',
        label: 'Code',
        width: '100px',
      },
      {
        key: 'name',
        label: 'Name',
        width: '150px',
      },
      {
        key: 'department',
        label: 'Department',
        disabledSort: true,
      },
    ]}
    sort={{
      order: 'ASC',
      field: 'code',
    }}
    records={[
      {
        code: 'E-0001',
        name: 'Taro Yamada',
        department: 'Product Development',
      },
      {
        code: 'E-0002',
        name: 'Jiro Watanabe',
        department: 'Product Development',
      },
      {
        code: 'E-0003',
        name: 'Hanako Sato',
        department: 'Product Development',
      },
      {
        code: 'E-0004',
        name: 'Long Long Long Long Long Name',
        department: 'Product Development',
      },
      {
        code: 'E-0004',
        name: 'Long Long Long Long Long Name',
        department: 'Product Development',
      },
      {
        code: 'E-0004',
        name: 'Long Long Long Long Long Name',
        department: 'Product Development',
      },
      {
        code: 'E-0004',
        name: 'Long Long Long Long Long Name',
        department: 'Product Development',
      },
      {
        code: 'E-0004',
        name: 'Long Long Long Long Long Name',
        department: 'Product Development',
      },
      {
        code: 'E-0004',
        name: 'Long Long Long Long Long Name',
        department: 'Product Development',
      },
      {
        code: 'E-0004',
        name: 'Long Long Long Long Long Name',
        department: 'Product Development',
      },
      {
        code: 'E-0004',
        name: 'Long Long Long Long Long Name',
        department: 'Product Development',
      },
      {
        code: 'E-0004',
        name: 'Long Long Long Long Long Name',
        department: 'Product Development',
      },
      {
        code: 'E-0004',
        name: 'Long Long Long Long Long Name',
        department: 'Product Development',
      },
      {
        code: 'E-0004',
        name: 'Long Long Long Long Long Name',
        department: 'Product Development',
      },
      {
        code: 'E-0004',
        name: 'Long Long Long Long Long Name',
        department: 'Product Development',
      },
      {
        code: 'E-0004',
        name: 'Long Long Long Long Long Name',
        department: 'Product Development',
      },
      {
        code: 'E-0004',
        name: 'Long Long Long Long Long Name',
        department: 'Product Development',
      },
      {
        code: 'E-0004',
        name: 'Long Long Long Long Long Name',
        department: 'Product Development',
      },
      {
        code: 'E-0004',
        name: 'Long Long Long Long Long Name',
        department: 'Product Development',
      },
      {
        code: 'E-0004',
        name: 'Long Long Long Long Long Name',
        department: 'Product Development',
      },
      {
        code: 'E-0004',
        name: 'Long Long Long Long Long Name',
        department: 'Product Development',
      },
      {
        code: 'E-0004',
        name: 'Long Long Long Long Long Name',
        department: 'Product Development',
      },
      {
        code: 'E-0004',
        name: 'Last',
        department: 'Last Product Development',
      },
    ]}
    emptyMessage="Not found (Message here)."
    onClickRow={action('onClickRow')}
    onClickHeaderCell={action('onClickHeaderCell')}
  />
);
