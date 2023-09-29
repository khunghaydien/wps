import React from 'react';

import { action } from '@storybook/addon-actions';

/* eslint-disable import/no-extraneous-dependencies */
import ListSearchForm from '../../components/ListSearchForm';
import ListPagingLayout from '../../components/MainContents/ListPagingLayout';

const fields = [
  {
    key: 'code',
    label: 'Code',
    value: 'code',
    width: '100px',
    disabledSort: false,
  },
  {
    key: 'name',
    label: 'Name',
    value: 'name',
    width: '150px',
    disabledSort: false,
  },
  {
    key: 'department',
    label: 'Department',
    value: '',
    disabledSort: true,
  },
];

export default {
  title: 'admin-pc/MainContents/ListPagingLayout',

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
  <ListPagingLayout
    renderForm={() => (
      <ListSearchForm // eslint-disable-next-line no-unused-vars
        fields={fields.map(({ disabledSort, ...field }) => field)} // eslint-disable-line @typescript-eslint/no-unused-vars
        onChange={action('onChangeSearchValue')}
        onSubmit={action('onSubmitSearchValue')}
      />
    )} // eslint-disable-next-line no-unused-vars
    fields={fields.map(({ value, ...field }) => field)} // eslint-disable-line @typescript-eslint/no-unused-vars
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
    currentPage={3}
    pageSize={100}
    totalNum={1000}
    limit={1000}
    onClickListRow={action('onClickListRow')}
    onClickListHeaderCell={action('onClickListHeaderCell')}
    onClickPagerLink={action('onClickPagerLink')}
    onClickRefreshButton={action('onClickRefresh')}
  />
);

export const NotFound = () => (
  <ListPagingLayout
    renderForm={() => (
      <ListSearchForm // eslint-disable-next-line no-unused-vars
        fields={fields.map(({ disabledSort, ...field }) => field)} // eslint-disable-line @typescript-eslint/no-unused-vars
        onChange={action('onChangeSearchValue')}
        onSubmit={action('onSubmitSearchValue')}
      />
    )} // eslint-disable-next-line no-unused-vars
    fields={fields.map(({ value, ...field }) => field)} // eslint-disable-line @typescript-eslint/no-unused-vars
    sort={{
      order: 'ASC',
      field: 'code',
    }}
    records={[]}
    currentPage={1}
    pageSize={100}
    totalNum={0}
    limit={1000}
    emptyMessage="Not found (Message here)."
    onClickListRow={action('onClickListRow')}
    onClickListHeaderCell={action('onClickListHeaderCell')}
    onClickPagerLink={action('onClickPagerLink')}
    onClickRefreshButton={action('onClickRefresh')}
  />
);

NotFound.storyName = 'Not found';

export const Scroll = () => (
  <ListPagingLayout
    renderForm={() => (
      <ListSearchForm // eslint-disable-next-line no-unused-vars
        fields={fields.map(({ disabledSort, ...field }) => field)} // eslint-disable-line @typescript-eslint/no-unused-vars
        onChange={action('onChangeSearchValue')}
        onSubmit={action('onSubmitSearchValue')}
      />
    )} // eslint-disable-next-line no-unused-vars
    fields={fields.map(({ value, ...field }) => field)} // eslint-disable-line @typescript-eslint/no-unused-vars
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
    currentPage={3}
    pageSize={100}
    totalNum={1000}
    limit={1000}
    onClickListRow={action('onClickListRow')}
    onClickListHeaderCell={action('onClickListHeaderCell')}
    onClickPagerLink={action('onClickPagerLink')}
    onClickRefreshButton={action('onClickRefresh')}
  />
);
